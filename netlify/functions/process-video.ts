import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

export const handler: Handler = async (event, context) => {
  const videoUrl = event.queryStringParameters?.url;

  if (!videoUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing url parameter' }),
    };
  }

  try {
    const targetUrl = `https://snapsora.app/getlink.php?url=${encodeURIComponent(videoUrl)}`;
    
    console.log(`Proxying request to: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.5',
        'priority': 'u=1, i',
        'referer': 'https://snapsora.app/',
        'sec-ch-ua': '"Not:A-Brand";v="99", "Brave";v="145", "Chromium";v="145"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'sec-gpc': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Upstream API error: ${response.statusText}` }),
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error: any) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
};
