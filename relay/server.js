// KUA on-campus carbon relay.
//
// Why this exists: cloud Vercel can't reach the Distech Eclypse BMS at
// 10.1.1.27 because it's on the campus LAN. This relay runs on a campus
// machine (Mac Mini, Raspberry Pi, on-prem VM) joined to that LAN, and
// re-uses the same /api/*.js handlers Vercel serves in the cloud. A tunnel
// (Cloudflare Tunnel, Tailscale Funnel) makes the relay reachable from the
// public internet so Vercel can call it.
//
// Run:
//   cd relay
//   npm install        # only express needed
//   BMS_BASE_URL=https://10.1.1.27 \
//   BMS_USERNAME=your-user \
//   BMS_PASSWORD=your-pass \
//   BMS_POINT_MAP='{"m_elec_b_miller":"protocols/bacnet/local/objects/analog-value,5/present-value"}' \
//   METER_SOURCE=bms \
//   PORT=3001 \
//   node server.js
//
// Then expose with Cloudflare Tunnel:
//   cloudflared tunnel --url http://localhost:3001
// or Tailscale Funnel:
//   tailscale funnel 3001
//
// Set BMS_BASE_URL on Vercel to the resulting public URL and METER_SOURCE=bms.
// Cloud-side requests will now read live data through the relay.

import http from 'node:http';
import { URL } from 'node:url';

import metersHandler          from '../api/meters/index.js';
import readingsHandler        from '../api/meters/readings.js';
import readingsImportHandler  from '../api/meters/readings/import.js';
import readingsExportHandler  from '../api/meters/readings/export.js';
import qualityHandler         from '../api/meters/quality.js';
import buildingEnergyHandler  from '../api/buildings/[id]/energy.js';
import emissionsCalculate     from '../api/emissions/calculate.js';
import quizAttemptsHandler    from '../api/quiz/attempts.js';
import chatbotHandler         from '../api/chatbot.js';
import authSessionHandler     from '../api/auth/session.js';

const PORT = Number(process.env.PORT || 3001);

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      if (!body) return resolve({});
      try { resolve(JSON.parse(body)); }
      catch { resolve({}); }
    });
    req.on('error', reject);
  });
}

function adaptResponse(res) {
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
    return res;
  };
  res.send = (data) => {
    res.end(typeof data === 'string' ? data : JSON.stringify(data));
    return res;
  };
}

// Match a request URL/method to a Vercel-style handler.
async function route(req, res, url) {
  const path = url.pathname.replace(/\/+$/, '');
  const m = req.method;

  if (m === 'GET'  && path === '/api/meters')                    return metersHandler(req, res);
  if (m === 'GET'  && path === '/api/meters/readings')           return readingsHandler(req, res);
  if (m === 'GET'  && path === '/api/meters/readings/export')    return readingsExportHandler(req, res);
  if (m === 'POST' && path === '/api/meters/readings/import')    return readingsImportHandler(req, res);
  if (m === 'GET'  && path === '/api/meters/quality')            return qualityHandler(req, res);
  if (m === 'POST' && path === '/api/emissions/calculate')       return emissionsCalculate(req, res);
  if ((m === 'GET' || m === 'POST') && path === '/api/quiz/attempts') return quizAttemptsHandler(req, res);
  if (m === 'POST' && path === '/api/chatbot')                        return chatbotHandler(req, res);
  if (m === 'POST' && path === '/api/auth/session')                   return authSessionHandler(req, res);

  // /api/buildings/:id/energy
  const energyMatch = path.match(/^\/api\/buildings\/([^/]+)\/energy$/);
  if (m === 'GET' && energyMatch) {
    req.query = { ...req.query, id: decodeURIComponent(energyMatch[1]) };
    return buildingEnergyHandler(req, res);
  }

  res.status(404).json({ error: 'Not found' });
}

const server = http.createServer(async (req, res) => {
  // CORS — relay must be readable by the cloud Vercel deployment
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  adaptResponse(res);

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    req.query = Object.fromEntries(url.searchParams);
    if (req.method === 'POST') {
      req.body = await parseBody(req);
    }
    await route(req, res, url);
  } catch (err) {
    console.error('relay error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
});

server.listen(PORT, () => {
  console.log(`KUA carbon relay listening on http://localhost:${PORT}`);
  console.log(`METER_SOURCE = ${process.env.METER_SOURCE || 'mock'}`);
  if (process.env.BMS_BASE_URL) {
    console.log(`BMS upstream  = ${process.env.BMS_BASE_URL}`);
  }
});
