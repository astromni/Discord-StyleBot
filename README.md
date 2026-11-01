# Discord-StyleBot
A lightweight Node.js Discord bot that automatically applies custom nameplate styles (fonts, effects, and colors) to itself upon joining a server.

# AutoPlate

A lightweight, event-driven Discord bot that automatically applies custom nameplate styles (fonts, effects, and colors) to itself whenever it joins a new server. Built purely with Node.js and WebSockets—no heavy Discord libraries required.

By default, the bot is configured to apply the **Vampyre** font, a glowing **Neon** effect, and a **Blue** color scheme upon joining a guild. 

## Features
* **Zero Bloat:** Connects directly to the Discord Gateway using WebSockets (`ws`).
* **Auto-Applying:** Listens for `GUILD_CREATE` events to style itself 1.5 seconds after joining a server.
* **Highly Customizable:** Easily swap out font IDs, effect IDs, and hex colors in the code.

---

##  Setup & Installation

Follow these steps to get your bot up and running:

**1. Install Dependencies**
Make sure you have Node.js installed, then run the following command in the project folder to install the required WebSocket package:
```bash
npm install
```

**2. Configure Your Token**
Open `config.json` and replace the placeholder text with your actual Discord Bot Token:
```json
{
  "token": "YOUR_BOT_TOKEN_HERE"
}
```

**3. Run the Bot**
Start the bot using Node:
```bash
node index.js
```
*You should see logs indicating a successful connection to the Discord Gateway!*

---

##  Configuration & Style Guide

You can change how the bot styles itself by editing the constants at the top of `index.js`:

```javascript
// ─── Nameplate Settings ───────────────────────────────────────────────────────
const FONT_ID = 4;      // Font style (Default: Vampyre)
const EFFECT_ID = 5;    // Visual effect (Default: Neon)
const COLOR = 0x3B82F6; // Hex color code (Default: Blue)
// ─────────────────────────────────────────────────────────────────────────────
```

### Reference: Available Styles

** FONTS (`display_name_font_id`)**
* ` 0 ` — **Default** › Normal Discord font
* ` 1 ` — **Serif** › Classic elegant letters
* ` 2 ` — **Mono** › Typewriter / code style
* ` 3 ` — **Display** › Bold headline style
* ` 4 ` — **Vampyre**  › Gothic dark style

** EFFECTS (`display_name_effect_id`)**
* ` 0 ` — **None** › No effect
* ` 1 ` — **Gradient** › Smooth color fade
* ` 2 ` — **Holographic**  › Rainbow shimmer
* ` 3 ` — **Glitter**  › Sparkling particles
* ` 4 ` — **Confetti**  › Colorful burst
* ` 5 ` — **Neon**  › Glowing neon light
