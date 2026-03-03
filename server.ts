import express from 'express';
import axios from 'axios';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Proxy endpoint for Xtream Codes API
  app.get('/api/proxy', async (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required' });
    }

    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      res.json(response.data);
    } catch (error: any) {
      console.error('Proxy Error:', error.message);
      res.status(error.response?.status || 500).json({ 
        error: 'Failed to fetch from IPTV server',
        message: error.message 
      });
    }
  });

  // Stream proxy endpoint to bypass CORS for video
  app.get('/api/stream', async (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
      return res.status(400).send('URL is required');
    }

    const headers: Record<string, string> = {
      'User-Agent': 'VLC/3.0.16 LibVLC/3.0.16', // Use a common IPTV player user agent
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'Icy-MetaData': '1'
    };

    if (req.headers.range) {
      headers['Range'] = req.headers.range;
    }

    try {
      const response = await axios({
        method: 'get',
        url: url,
        responseType: 'stream',
        headers: headers,
        timeout: 30000, // Increase timeout for slow IPTV servers
        maxRedirects: 5,
        validateStatus: (status) => status < 400 // Only follow successful redirects
      });

      // Forward relevant headers
      let contentType = response.headers['content-type'];
      
      // Force correct MIME type for TS files if the server returns something generic
      if (url.includes('.ts') && (!contentType || contentType === 'application/octet-stream' || contentType === 'video/mpeg')) {
        contentType = 'video/mp2t';
      }
      
      if (contentType) res.set('Content-Type', contentType);
      
      if (response.headers['content-length']) {
        res.set('Content-Length', response.headers['content-length']);
      }
      if (response.headers['content-range']) {
        res.set('Content-Range', response.headers['content-range']);
        res.status(206);
      }
      res.set('Accept-Ranges', 'bytes');
      res.set('Cache-Control', 'no-cache');

      // Handle stream errors
      response.data.on('error', (err: any) => {
        console.error('Stream Error during pipe:', err.message);
        if (!res.headersSent) {
          res.status(500).send('Stream interrupted');
        }
        res.end();
      });

      response.data.pipe(res);
    } catch (error: any) {
      console.error('Stream Proxy Connection Error:', error.message);
      if (!res.headersSent) {
        const status = error.response?.status || 500;
        res.status(status).send(`Failed to connect to stream: ${error.message}`);
      }
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
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
