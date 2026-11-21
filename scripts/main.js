import { fetchQuote, FALLBACK } from './api.js';
import { getHistory, addQuoteToHistory, clearStoredHistory } from './storage.js';
import { renderQuote, renderHistory } from './render.js';

const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newBtn = document.getElementById('new-quote');
const copyBtn = document.getElementById('copy-btn');
const tweetBtn = document.getElementById('tweet-btn');
const clearHistoryBtn = document.getElementById('clear-history');

let quoteHistory = getHistory();

function saveToHistory(quote) {
    quoteHistory = addQuoteToHistory(quote);
    renderHistory(quoteHistory);
}

async function newQuote() {
    newBtn.disabled = true;
    quoteText.textContent = 'Loading quote...';
    quoteAuthor.textContent = '';

    try {
        const q = await fetchQuote();
        renderQuote(q);
        saveToHistory(q);
    } catch (err) {
        console.error('Unexpected error fetching quote:', err);
        renderQuote({ content: 'Could not load quote.', author: '' });
    } finally {
        newBtn.disabled = false;
    }
}

copyBtn.addEventListener('click', async () => {
    const text = `"${quoteText.textContent}" ${quoteAuthor.textContent}`;

    try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
        }, 1500);
    } catch (err) {
        console.error('Copy failed', err);
        alert('Copy failed. Your browser may not support clipboard API.');
    }
});

tweetBtn.addEventListener('click', () => {
    const text = `"${quoteText.textContent}" ${quoteAuthor.textContent}`.trim();
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

    window.open(
        tweetUrl,
        '_blank',
        'noopener,noreferrer,width=600,height=400'
    );
});

clearHistoryBtn.addEventListener('click', () => {
    quoteHistory = clearStoredHistory();
    renderHistory(quoteHistory);
});

newBtn.addEventListener('click', newQuote);

if (typeof jest !== 'undefined') {
    module.exports = {
        renderQuote,
        saveToHistory,
        renderHistory: () => renderHistory(quoteHistory),
        fetchQuote,
        newQuote,
        FALLBACK
    };
} else {
    renderHistory(quoteHistory);
    newQuote();
}