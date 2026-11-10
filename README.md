# Soup Training Run Monitor

A high-performance training-run monitor built for the Soup Frontend Engineer take-home task. Designed to handle large ML training metric streams (up to 1,000,000+ data points) with absolute data truthfulness and zero Main Thread UI freezing.

Live Demo: [Insert your Netlify/Vercel URL here]

---

## 🚀 Key Features

- **High-Performance Canvas Rendering:** Uses `uPlot` (HTML5 Canvas) instead of heavy DOM/SVG nodes to ensure 60 FPS zoom/pan interactions on 1M dataset streams.
- **Spike-Preserving Downsampling:** Bucket min/max range aggregation guarantees that single-step loss spikes ($500 divergence risks) remain visible at all zoom levels.
- **Honest Outlier & Failure Handling:** `NaN` and `Infinity` values are safely converted to `null`, rendering clean visual gaps instead of misleading dips to zero.
- **Request Race Protection:** Asynchronous run switching uses cleanup flags (`AbortController` / `isCancelled`) to cancel late-arriving payload state updates.
- **Keyboard Navigation:** Full arrow key support (`ArrowUp` / `ArrowDown`) for quick navigation across training runs.

---

## 🛠 Tech Stack

- **Framework:** React + Vite + TypeScript
- **Styling:** Tailwind CSS
- **Charting Engine:** uPlot
- **Testing:** Vitest
- **Deployment:** Netlify

---

## 🧪 Running Unit Tests

Automated tests cover metric sanitization, spike preservation during downsampling, `NaN` line-break conversions, and step sorting:

```bash
npm test

## ⚡ Performance Audit (CPU Throttling ×4)

- INP (Interaction to Next Paint): 72 ms (Green Zone)
- Memory Footprint: ~35–45 MB JS Heap for 1M points via flat typed arrays.
- Verification: Benchmarked via Chrome DevTools Performance Trace

## 📦 Local Setup

# Clone the repository
git clone <your-repo-url>
cd soup-monitor

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
