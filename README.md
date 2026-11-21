# Random Quote Generator

A fast, resilient, and accessible quote generator built with vanilla JavaScript, exponential backoff retry logic, `localStorage` history, and automated Jest unit tests.

## Live Demo

- **Live Site:** [https://evancru-quote-generator.netlify.app](https://evancru-quote-generator.netlify.app)

## Features

- **Dynamic Quote Fetching:** Asynchronously fetches random quotes from the [DummyJSON Quotes API](https://dummyjson.com).
- **Resilient Networking:** Features exponential backoff retry logic with jitter and a fallback to curated local quotes.
- **Persistent History:** Saves the last 10 unique quotes in `localStorage` with keyboard navigation support.
- **Sharing Tools:** Copy quotes to the clipboard or share directly to X (Twitter).
- **Accessibility & Performance:** Semantic markup, `aria-live` announcements, focus management, and zero layout shift (96+ Lighthouse score).
- **Testing:** Includes a 10-test Jest and `jsdom` test suite covering rendering, storage, and API fallbacks.

## Project Structure

```text
random-quote-generator/
├── index.html              # Semantic HTML5 markup
├── styles/main.css         # Responsive layout & accessibility styles
├── scripts/main.js         # Core application logic & API handling
├── test/test.js            # Jest unit tests
├── dist/                   # Production build assets (minified)
├── package.json            # Dependencies & Jest configuration
└── README.md
```

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com
   cd random-quote-generator
   ```
2. **Install dependencies & run tests:**
   ```bash
   npm install
   npm test
   ```
3. **Build and preview:**
   ```bash
   npm run build
   ```

## Deployment

Configured for static deployment on **Netlify** via GitHub (Publish directory: `.` / `dist/`).

## Author

**EvanCru** — [cuduco_19@hotmail.com](mailto:cuduco_19@hotmail.com)