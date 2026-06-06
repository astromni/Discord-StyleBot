const WebSocket = require("ws");
const https = require("https");
const config = require("./config.json");

const TOKEN = config.token;

// ─── Nameplate Settings ───────────────────────────────────────────────────────
// Font:   4 = Vampyre  (gothic vampire style)
// Effect: 5 = Neon     (glowing neon effect)
// Color:  0x3B82F6     (blue = 3899126 in decimal)
const FONT_ID = 4;
const EFFECT_ID = 5;
const COLOR = 0x3B82F6;
// ─────────────────────────────────────────────────────────────────────────────

const GATEWAY = "wss://gateway.discord.gg/?v=10&encoding=json";
const API_BASE = "https://discord.com/api/v10";

let heartbeatInterval = null;
let lastSequence = null;
let ws = null;

function log(msg) {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] ${msg}`);
}

function applyNameplate(guildId, guildName) {
    const body = JSON.stringify({
        display_name_font_id: FONT_ID,
        display_name_effect_id: EFFECT_ID,
        display_name_colors: [COLOR],
    });

    const url = new URL(`${API_BASE}/guilds/${guildId}/members/@me`);
    const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: "PATCH",
        headers: {
            Authorization: `Bot ${TOKEN}`,
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(body),
            "User-Agent": "DiscordBot (nameplate-bot, 1.0.0)",
        },
    };

    const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
            if (res.statusCode === 200 || res.statusCode === 204) {
                log(`✅ Nameplate set in: ${guildName} (${guildId})`);
            } else {
                log(`⚠️  Failed in ${guildName} — HTTP ${res.statusCode}: ${data}`);
            }
        });
    });

    req.on("error", (err) => {
        log(`❌ Request error in ${guildName}: ${err.message}`);
    });

    req.write(body);
    req.end();
}

function sendHeartbeat() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ op: 1, d: lastSequence }));
    }
}

function identify() {
    ws.send(
        JSON.stringify({
            op: 2,
            d: {
                token: TOKEN,
                intents: 1 << 0,
                properties: {
                    os: "linux",
                    browser: "nameplate-bot",
                    device: "nameplate-bot",
                },
            },
        })
    );
}
console.clear();
console.log('\x1b[38;5;129m╭──────────────────────────────────────────╮\x1b[0m');
console.log('\x1b[38;5;129m│      Developed by Eclipse             │\x1b[0m');
console.log('\x1b[38;5;129m╰──────────────────────────────────────────╯\x1b[0m');

function connect() {
    log("Connecting to Discord Gateway...");
    ws = new WebSocket(GATEWAY);

    ws.on("open", () => {
        log("Connected.");
    });

    ws.on("message", (raw) => {
        const payload = JSON.parse(raw.toString());
        const { op, d, s, t } = payload;

        if (s) lastSequence = s;

        if (op === 10) {
            const interval = d.heartbeat_interval;
            log(`Heartbeat interval: ${interval}ms`);
            setTimeout(sendHeartbeat, interval * Math.random());
            heartbeatInterval = setInterval(sendHeartbeat, interval);
            identify();
        }

        if (op === 11) {
        }

        if (op === 0) {
            if (t === "READY") {
                log(`✅ Logged in as: ${d.user.username}#${d.user.discriminator}`);
                log(`Watching for new server joins...`);
            }

            if (t === "GUILD_CREATE") {
                const guildId = d.id;
                const guildName = d.name;
                log(`Joined server: ${guildName} — applying nameplate...`);
                setTimeout(() => applyNameplate(guildId, guildName), 1500);
            }
        }

        if (op === 9) {
            log("Session invalidated. Reconnecting...");
            clearInterval(heartbeatInterval);
            ws.close();
            setTimeout(connect, 3000);
        }
    });

    ws.on("close", (code) => {
        log(`Disconnected (code ${code}). Reconnecting in 5s...`);
        clearInterval(heartbeatInterval);
        setTimeout(connect, 5000);
    });

    ws.on("error", (err) => {
        log(`WebSocket error: ${err.message}`);
    });
}

if (!TOKEN || TOKEN === "YOUR_BOT_TOKEN_HERE") {
    console.error("❌ Please set your bot token in config.json first!");
    process.exit(1);
}

log("Starting Nameplate Bot...");
log(`Font: Vampyre (${FONT_ID}) | Effect: Neon (${EFFECT_ID}) | Color: Blue (#3B82F6)`);
connect();
