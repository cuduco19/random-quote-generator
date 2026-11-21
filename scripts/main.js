// app.js (ES module)
//const API = 'https://api.quotable.io/random';
const API = 'https://dummyjson.com/quotes/random';
const STORAGE_KEY = 'quote_history';
const MAX_HISTORY = 10;

// Fallback quotes
const FALLBACK = [
    { content: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
    { content: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
    { content: "First, solve the problem. Then, write the code.", author: "John Johnson" },
];

// DOM elements
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newBtn = document.getElementById('new-quote');
const copyBtn = document.getElementById('copy-btn');
const tweetBtn = document.getElementById('tweet-btn');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');

// Load history from localStorage
let quoteHistory = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Helper to pause execution for a given number of milliseconds
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchQuote(maxRetries = 3, baseDelay = 500) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const res = await fetch(API);
            
            if(!res.ok) {
                throw new Error(`API error: ${res.status}`);
            }

            const data = await res.json();
            return { content: data.quote, author: data.author || 'Unknown' };
            
        } catch (err) {
            // If we have used all retries, log a warning and break out to the fallback
            if (attempt === maxRetries - 1) {
                console.warn(`All ${maxRetries} retries failed. Using fallback quote:`, err);
                break;
            }

            // Calculate exponential backoff: 500ms, 1000ms, 2000ms
            const expDelay = baseDelay * Math.pow(2, attempt);

            // Apply Equal Jitter (guarantees at least 50% of the backoff delay)
            const half = expDelay / 2;
            const delay = Math.floor(half + Math.random() * half);
            
            console.warn(`Fetch attempt ${attempt + 1} failed. Retrying in ${delay}ms...`, err);
            
            await sleep(delay);
        }
    }

    // Choose random fallback
    return FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
}

function saveToHistory(quote) {
    // Prevent duplicate entries if the same quote appears again
    quoteHistory = quoteHistory.filter(item => item.content !== quote.content);

    // Add newest quote to the front and keep only the last 10
    quoteHistory = [quote, ...quoteHistory].slice(0, MAX_HISTORY);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(quoteHistory));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';

    if (quoteHistory.length === 0) {
        historyList.innerHTML = '<li class="history-empty">No quotes in history yet.</li>';
        return;
    }

    quoteHistory.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="history-quote">"${item.content}"</div>
            <div class="history-author">— ${item.author}</div>
        `;

        // Clicking a past quote displays it in the main card without re-adding to history
        li.addEventListener('click', () => renderQuote(item));

        //Making the history items keyboard-accessible
        li.setAttribute('tabindex', '0');
        li.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                renderQuote(item);
            }
        });
        historyList.appendChild(li);
    });
}

function renderQuote({ content, author }) {
    quoteText.textContent = content;
    quoteAuthor.textContent = `— ${author}`;
}

async function newQuote() {
    // show loading state
    newBtn.disabled = true; // Prevent double-clicks during retries
    quoteText.textContent = 'Loading quote...';
    quoteAuthor.textContent = '';

    try {
        const q = await fetchQuote();
        renderQuote(q);
        saveToHistory(q);

    } catch(err) {
        console.error('Unexpected error fetching quote:', err);
        renderQuote({ content: 'Could not load quote.', author:'' });
    } finally {
        newBtn.disabled = false; // Re-enable button once finished
    }
}

// copy to clipboard
copyBtn.addEventListener('click', async () => {
    const text = `"${quoteText.textContent}" ${quoteAuthor.textContent}`;
         
    try {
         await navigator.clipboard.writeText(text);
         
         copyBtn.textContent = 'Copied!';
         
         //setTimeout(() => (copyBtn.textContent ='Copy'),1500);

         setTimeout(() => {
            copyBtn.textContent ='Copy';
         }, 1500);

    } catch(err) {
        console.error('Copy failed', err);
        alert('Copy failed. Your browser may not support clipboard API.');
    }
});

// share quote on Twitter/X in a new window
tweetBtn.addEventListener('click', () => {
    const text = `"${quoteText.textContent}" ${quoteAuthor.textContent}`.trim();
    
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

    window.open(
        tweetUrl,
        '_blank',
        'noopener,noreferrer,width=600,height=400'
    );
});

// Clear history
clearHistoryBtn.addEventListener('click', () => {
    quoteHistory = [];
    localStorage.removeItem(STORAGE_KEY);
    renderHistory();
});

newBtn.addEventListener('click', newQuote);

if (typeof jest !== 'undefined') {
    // Export functions for Jest without starting the app
    module.exports = {
        renderQuote,
        saveToHistory,
        renderHistory,
        fetchQuote,
        newQuote,
        FALLBACK
    };
} else {
    // Run normal startup code only in the browser
    renderHistory();
    newQuote();
}