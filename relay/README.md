# KUA carbon relay

A tiny Node http server that re-uses the same `/api/*.js` handlers Vercel
serves in the cloud, but runs **on the campus network** so it can reach
the Distech Eclypse BMS at `10.1.1.27`. A public tunnel (Cloudflare,
Tailscale, ngrok) makes the relay visible to Vercel; cloud-side requests
get proxied through the relay onto the LAN.

## Why we need this

Vercel Functions run in cloud regions. They cannot open TCP connections
to RFC1918 addresses like `10.1.1.27`. So either:

- **Option A — relay (this directory):** run a small server on a campus
  machine, tunnel it to the public internet, point Vercel at the tunnel.
  Reuses 100% of the dashboard's API code; no duplication.
- **Option B — push from campus:** a campus job posts readings into
  Supabase periodically, and the dashboard reads from Supabase. Adds a
  hop and storage but eliminates the tunnel.
- **Option C — VPN:** static-IP route from Vercel's edge into KUA's LAN.
  Generally not allowed under Vercel's networking model unless you're
  on Enterprise.

Option A is simplest and what this directory implements.

## Run locally

```bash
cd relay
node server.js
```

That starts the relay in mock mode (no BMS connection) on port 3001 so
you can verify the routing wiring before involving the real BMS.

```bash
curl http://localhost:3001/api/meters
curl 'http://localhost:3001/api/meters/readings?buildingId=b_miller&start=2026-04-01T00:00:00Z&end=2026-04-02T00:00:00Z'
```

## Run against the Eclypse BMS

```bash
METER_SOURCE=bms \
BMS_BASE_URL=https://10.1.1.27 \
BMS_USERNAME=...  \
BMS_PASSWORD=...  \
BMS_POINT_MAP='{"m_elec_b_miller":"protocols/bacnet/local/objects/analog-value,5/present-value", "m_elec_b_whittemore":"protocols/bacnet/local/objects/analog-value,11/present-value"}' \
node server.js
```

If your Eclypse uses a self-signed cert, set
`NODE_TLS_REJECT_UNAUTHORIZED=0` while testing — but get a real cert before
production.

## Expose to the public internet

### Cloudflare Tunnel (recommended)

```bash
brew install cloudflared
cloudflared tunnel login
cloudflared tunnel create kua-carbon-relay
cloudflared tunnel route dns kua-carbon-relay relay.kua.org
cloudflared tunnel run --url http://localhost:3001 kua-carbon-relay
```

### Tailscale Funnel

```bash
tailscale funnel 3001
# Funnel will print a public URL like https://kua-relay.tail-scale.ts.net
```

### Quick test (ngrok, dev only)

```bash
ngrok http 3001
```

## Point Vercel at the relay

In the Vercel project settings, add:

```
METER_SOURCE       = bms
BMS_BASE_URL       = https://relay.kua.org
BMS_USERNAME       = ...
BMS_PASSWORD       = ...
BMS_POINT_MAP      = {"m_elec_b_miller":"protocols/bacnet/local/objects/analog-value,5/present-value", ...}
```

Redeploy. The cloud dashboard's `/api/buildings/[id]/energy` endpoint will
now make outbound HTTPS requests to `relay.kua.org`, which then talks to
`10.1.1.27` over the campus LAN.

## Auto-start on a campus machine

### macOS LaunchAgent

```xml
<!-- ~/Library/LaunchAgents/org.kua.carbon-relay.plist -->
<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0"><dict>
  <key>Label</key><string>org.kua.carbon-relay</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/node</string>
    <string>/path/to/kua-carbon-dashboard/relay/server.js</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>METER_SOURCE</key><string>bms</string>
    <key>BMS_BASE_URL</key><string>https://10.1.1.27</string>
    <!-- secrets via /usr/bin/security or a sourced file, not inline -->
  </dict>
  <key>KeepAlive</key><true/>
  <key>RunAtLoad</key><true/>
</dict></plist>
```

### Linux systemd

```ini
# /etc/systemd/system/kua-carbon-relay.service
[Unit]
Description=KUA carbon relay
After=network.target

[Service]
Environment=METER_SOURCE=bms
EnvironmentFile=/etc/kua/relay.env
ExecStart=/usr/bin/node /opt/kua-carbon-dashboard/relay/server.js
Restart=on-failure
User=kua-relay

[Install]
WantedBy=multi-user.target
```

## What runs in the relay

The exact same Vercel API handlers shipped in `/api/`:

- `GET  /api/meters`
- `GET  /api/meters/readings`
- `POST /api/meters/readings/import`
- `GET  /api/meters/quality`
- `GET  /api/buildings/:id/energy`
- `POST /api/emissions/calculate`

Plus CORS so the cloud Vercel deployment can call it directly.
