import express from 'express';
import { createServer as createViteServer } from 'vite';
import fetch from 'node-fetch';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to proxy requests to snapsora.app
  app.get('/api/process-video', async (req, res) => {
    const videoUrl = req.query.url as string;

    if (!videoUrl) {
      return res.status(400).json({ error: 'Missing url parameter' });
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
        throw new Error(`Upstream API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error('Proxy error:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
