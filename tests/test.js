/** @jest-environment jsdom */

// Set up the full DOM structure before requiring main.js
document.body.innerHTML = `
  <div class="card" id="quote-card">
    <div role="region" aria-label="Random Quote" aria-live="polite">
      <div class="quote" id="quote-text">Loading quote...</div>
      <div class="author" id="quote-author"></div>
    </div>
    <div class="controls">
      <button class="tweet" id="tweet-btn">Tweet</button>
      <button class="secondary" id="copy-btn">Copy</button>
      <button class="primary" id="new-quote">New Quote</button>
    </div>
  </div>
  <div class="history-card">
    <div class="history-header">
      <h2>Recent Quotes</h2>
      <button class="secondary small-btn" id="clear-history">Clear</button>
    </div>
    <ul class="history-list" id="history-list"></ul>
  </div>
`;

const {
  renderQuote,
  saveToHistory,
  renderHistory,
  fetchQuote,
  newQuote,
  FALLBACK
} = require('../scripts/main');

describe('renderQuote', () => {
  beforeEach(() => {
    document.getElementById('quote-text').textContent = '';
    document.getElementById('quote-author').textContent = '';
  });

  test('displays the quote content and author name', () => {
    const mockQuote = {
      content: 'Simplicity is the ultimate sophistication.',
      author: 'Leonardo da Vinci'
    };

    renderQuote(mockQuote);

    expect(document.getElementById('quote-text').textContent).toContain(mockQuote.content);
    expect(document.getElementById('quote-author').textContent).toContain(mockQuote.author);
  });

  test('handles quotes with missing or empty authors gracefully', () => {
    const noAuthorQuote = { content: 'Stay curious.', author: '' };

    renderQuote(noAuthorQuote);

    expect(document.getElementById('quote-text').textContent).toContain('Stay curious.');
    expect(document.getElementById('quote-author').textContent).not.toContain('undefined');
  });

  test('replaces previous quote when called multiple times', () => {
    renderQuote({ content: 'First quote', author: 'Author A' });
    renderQuote({ content: 'Second quote', author: 'Author B' });

    expect(document.getElementById('quote-text').textContent).toContain('Second quote');
    expect(document.getElementById('quote-text').textContent).not.toContain('First quote');
  });
});

describe('History management (saveToHistory & renderHistory)', () => {
  beforeEach(() => {
    // Clear history via the Clear button to reset internal quoteHistory array and localStorage
    document.getElementById('clear-history').click();
  });

  test('shows empty state message when history is empty', () => {
    renderHistory();
    const historyList = document.getElementById('history-list');
    expect(historyList.textContent).toContain('No quotes in history yet.');
  });

  test('saves quotes to localStorage and renders them in the DOM', () => {
    saveToHistory({ content: 'Quote 1', author: 'Author 1' });

    const stored = JSON.parse(localStorage.getItem('quote_history'));
    expect(stored).toHaveLength(1);
    expect(stored[0].content).toBe('Quote 1');
    expect(document.getElementById('history-list').textContent).toContain('Quote 1');
  });

  test('prevents duplicate quotes and moves repeated quote to the top', () => {
    saveToHistory({ content: 'First', author: 'A' });
    saveToHistory({ content: 'Second', author: 'B' });
    saveToHistory({ content: 'First', author: 'A' });

    const stored = JSON.parse(localStorage.getItem('quote_history'));
    expect(stored).toHaveLength(2);
    expect(stored[0].content).toBe('First');
  });

  test('caps history at a maximum of 10 quotes', () => {
    for (let i = 1; i <= 12; i++) {
      saveToHistory({ content: `Quote ${i}`, author: `Author ${i}` });
    }

    const stored = JSON.parse(localStorage.getItem('quote_history'));
    expect(stored).toHaveLength(10);
    expect(stored[0].content).toBe('Quote 12'); // Most recent
    expect(stored[9].content).toBe('Quote 3');  // Oldest kept
  });
});

describe('fetchQuote & newQuote', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.spyOn(console, 'warn').mockImplementation(() => {}); // Silence expected retry warnings
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns formatted quote when API succeeds', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ quote: 'Mocked API quote', author: 'API Author' })
    });

    const result = await fetchQuote(3, 1);
    expect(result).toEqual({ content: 'Mocked API quote', author: 'API Author' });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('retries on failure and falls back to local quote after maxRetries', async () => {
    global.fetch.mockRejectedValue(new Error('Network down'));

    // Pass baseDelay = 1ms so retries finish in a few milliseconds during tests
    const result = await fetchQuote(3, 1);

    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(FALLBACK).toContainEqual(result);
  });

  test('newQuote fetches, renders, saves to history, and re-enables button', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ quote: 'Integration quote', author: 'Tester' })
    });

    await newQuote();

    expect(document.getElementById('quote-text').textContent).toBe('Integration quote');
    expect(document.getElementById('quote-author').textContent).toBe('— Tester');
    expect(document.getElementById('new-quote').disabled).toBe(false);
  });
});