/** @jest-environment jsdom */

// Set up the full DOM structure before requiring app.js
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

const { renderQuote } = require('../scripts/main');

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