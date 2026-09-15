// AP CS Principles Big Idea 4 — Computer Systems and Networks (11-15%)

export const APCSP_UNIT_4 = {
  number: 4,
  title: 'Computer Systems and Networks',
  weight: '11-15%',
  subunits: [
    {
      code: '4.1',
      title: 'The internet',
      content:
`**Internet.** Global network of networks. No single owner.

**ARPANET (1969).** Precursor. US defense research. Decentralized so no single point of failure.

**Key idea — packet switching.** Messages broken into small packets. Each packet routed independently. Reassembled at destination.

Alternative — circuit switching (old phone system): dedicated line for whole call. Wastes capacity.

**Why packets:**
- **Resilient**: packets can take different routes.
- **Efficient**: many users share infrastructure.
- **Scales**: works for billions of devices.

**Devices connect via:**
- Wired (Ethernet, fiber).
- Wireless (WiFi, cellular, satellite).
- Each device has an IP address.

**Routers** forward packets toward destination based on routing tables.

**ISPs** (Internet Service Providers) connect users to internet backbone.

**Hierarchy:**
- Local network (home, school).
- ISP.
- Regional network.
- Internet backbone (tier-1 ISPs).`,
    },
    {
      code: '4.2',
      title: 'Protocols — TCP/IP, HTTP, DNS',
      content:
`**Protocol.** Agreed rules for communication. Like grammar of language.

**TCP/IP** — foundation of internet.
- **IP (Internet Protocol)**: addressing and routing packets.
- **TCP (Transmission Control Protocol)**: reliable delivery, error checking, reordering.
- **UDP** (alternative): faster, less reliable. Used for streaming, gaming.

**IP addresses.**
- **IPv4**: 32 bits. ~4.3 billion addresses (running out). Format: 192.168.1.1.
- **IPv6**: 128 bits. Vastly more. Format: 2001:0db8::1.

**DNS (Domain Name System).** Translates names (google.com) to IPs (142.250.80.46). Like phone book of internet.

**HTTP / HTTPS.** Hypertext Transfer Protocol. Web traffic.
- HTTPS = HTTP + TLS encryption.
- Methods: GET, POST, PUT, DELETE.
- Status codes: 200 OK, 404 Not Found, 500 Server Error.

**Other protocols:**
- **FTP**: file transfer.
- **SMTP**: email send.
- **IMAP/POP3**: email receive.
- **SSH**: secure shell (remote access).
- **WebSocket**: persistent bidirectional connection.

**Layered model.** Each protocol handles its layer.
- Physical (cables, radio).
- Link (Ethernet, WiFi).
- Network (IP).
- Transport (TCP, UDP).
- Application (HTTP, DNS, SMTP).

**Why layered?** Modularity. Can change one layer without breaking others.`,
    },
    {
      code: '4.3',
      title: 'Fault tolerance and redundancy',
      content:
`**Fault tolerance.** System keeps working when parts fail.

**Internet design.**
- **Redundant paths**: many ways to get from A to B.
- **Distributed routing**: routers decide independently.
- If one router/cable fails, traffic reroutes.

**Examples:**
- Severed undersea cable: traffic reroutes via other cables.
- Server down: load balancer sends to backup.
- ISP outage: customers can sometimes switch.

**Single points of failure.** Avoid: if one thing breaks, whole system breaks.

**Redundancy in storage:**
- **RAID**: redundant array of independent disks.
- **Backups**: separate copies in case primary lost.
- **Cloud replication**: data copied to multiple data centers.

**Trade-offs:**
- Redundancy costs more.
- Synchronizing copies adds complexity.
- More moving parts = more places for bugs.

**Scalability.** System handles growing load.
- **Vertical scaling**: bigger machine.
- **Horizontal scaling**: more machines.
- Internet uses horizontal — millions of routers, billions of devices.`,
    },
    {
      code: '4.4',
      title: 'Parallel and distributed computing',
      content:
`**Sequential computing.** Operations one at a time. Total time = sum of operations.

**Parallel computing.** Multiple operations at same time on one machine (multi-core CPU, GPU).

**Distributed computing.** Multiple machines working on parts of problem (cluster, cloud).

**Speedup.** Time saved by parallelism.
- Speedup = sequential time / parallel time.
- Limited by parts that can\'t be parallelized (Amdahl\'s law).

**Examples:**
- Searching: split data; each worker searches portion.
- Web servers: handle many requests at once.
- Video rendering: each frame independent.
- Training AI: parallel matrix math on GPUs.
- Scientific simulations.

**Not everything parallelizes well.**
- Sequential dependencies (each step uses previous).
- Communication overhead between workers.
- Synchronization (sharing state safely).

**Cloud computing.** Renting computing from providers (AWS, Google Cloud, Azure).
- Pay for use.
- Scale up/down on demand.
- Don\'t maintain hardware yourself.

**Pros**: cost flexibility, scalability, geographic distribution.
**Cons**: ongoing cost, vendor lock-in, dependence on internet.`,
    },
  ],
  keyConcepts: [
    'Internet = packet-switched network of networks.',
    'TCP/IP foundational protocols; HTTP/HTTPS for web; DNS for names.',
    'IPv4 (4B addresses) running out; IPv6 (vastly more).',
    'Fault tolerance through redundancy and distributed routing.',
    'Parallel computing: multiple cores. Distributed: multiple machines.',
    'Cloud computing: rent compute on demand.',
    'Amdahl\'s law: sequential parts limit parallel speedup.',
  ],
  practice: [
    {
      q: 'Why does the internet use packet switching instead of circuit switching?',
      a: 'Packets share infrastructure efficiently, can reroute around failures, and scale to billions of devices.',
    },
  ],
  pitfalls: [
    '"Internet = web" — internet is infrastructure; web is one service running on it.',
    '"Parallel always 10× faster with 10 cores" — overhead and sequential bottlenecks limit it.',
  ],
};
