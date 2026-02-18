import { SoraRequest, SoraResponse, ProcessedVideo } from '../types';

const TARGET_URL = 'https://api.soravideoapp.com/sora-watermark-remover.php';

// List of CORS proxies to try in order
const PROXIES = [
  // Primary proxy
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  // Fallback proxy (ThingProxy often handles headers differently)
  (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`, 
];

// Recursive helper to find any string that looks like a video URL in a messy JSON
const findVideoUrlInObject = (obj: any): string | undefined => {
  if (!obj) return undefined;
  
  // 1. Check if string itself is a video URL (heuristic)
  if (typeof obj === 'string') {
    if (obj.startsWith('http') && (
      obj.match(/\.(mp4|webm|mov)(\?|$)/i) || 
      obj.includes('googlevideo') || 
      obj.includes('openai') ||
      obj.includes('sora')
    )) {
      return obj;
    }
    return undefined;
  }

  // 2. If object, check priority keys first
  if (typeof obj === 'object') {
    const priorityKeys = ['url', 'video', 'video_url', 'download_url', 'link', 'hd', 'sd', 'high', 'low'];
    for (const key of priorityKeys) {
      if (key in obj && typeof obj[key] === 'string' && obj[key].startsWith('http')) {
        // High confidence if it's in a key named "url" or "video"
        return obj[key];
      }
    }

    // 3. Generic traversal for nested structures
    for (const key in obj) {
      // Avoid infinite loops and priority keys we just checked
      if (Object.prototype.hasOwnProperty.call(obj, key) && !priorityKeys.includes(key)) {
        const result = findVideoUrlInObject(obj[key]);
        if (result) return result;
      }
    }
  }
  
  return undefined;
};

export const removeWatermark = async (videoUrl: string): Promise<ProcessedVideo> => {
  const payload: SoraRequest = { videoUrl };

  let lastError: Error | null = null;
  let successData: any = null;

  // Strategy: Direct -> Proxy 1 -> Proxy 2
  const methods = [
    { name: 'Direct', url: TARGET_URL },
    ...PROXIES.map((fn, i) => ({ name: `Proxy ${i+1}`, url: fn(TARGET_URL) }))
  ];

  for (const method of methods) {
    try {
      console.log(`[SoraService] Attempting via ${method.name}:`, method.url);
      
      // Setup options. Note: Browsers block unsafe headers like Origin/Referer in fetch.
      // We rely on the proxy to handle the request forwarding or the server to be lenient.
      const response = await fetch(method.url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const text = await response.text();
      let json: any;
      try {
        json = JSON.parse(text);
      } catch (e) {
        // If response is not JSON (e.g. proxy error page), skip this method
        console.warn(`[SoraService] ${method.name} returned non-JSON body.`);
        throw new Error("Invalid JSON response");
      }

      // We have JSON. Inspect it.
      const candidateUrl = findVideoUrlInObject(json);
      
      if (candidateUrl) {
        successData = { json, candidateUrl };
        console.log(`[SoraService] Success via ${method.name}`);
        break; 
      } else {
         // Valid JSON but no URL.
         if (json.msg || json.message || json.error) {
            // Store this specific API error, might be useful if all fail
            lastError = new Error(json.msg || json.message || json.error);
         } else {
            lastError = new Error(`Parsed JSON from ${method.name} but found no video URL. Data: ${JSON.stringify(json).slice(0, 100)}...`);
         }
         console.warn(`[SoraService] ${method.name} valid JSON but missing URL:`, json);
      }

    } catch (error) {
      console.warn(`[SoraService] ${method.name} failed:`, error);
      if (!lastError) lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  if (successData) {
    const { json, candidateUrl } = successData;
    
    // Attempt to find a thumbnail similarly
    let thumbnail = json.data?.cover || json.data?.thumbnail || json.cover || json.thumbnail;
    if (!thumbnail) {
        // Helper to find image
        const findImage = (o: any): string | undefined => {
            if (typeof o === 'string' && o.match(/\.(jpg|png|webp|jpeg)(\?|$)/i)) return o;
            if (typeof o === 'object' && o !== null) {
                for (const k in o) {
                    const res = findImage(o[k]);
                    if (res) return res;
                }
            }
            return undefined;
        };
        thumbnail = findImage(json);
    }

    return {
      url: candidateUrl,
      thumbnail: thumbnail,
      originalUrl: videoUrl
    };
  }

  // All failed
  throw lastError || new Error("Unable to retrieve video. The service might be protecting against automated requests.");
};