//app.js (ES module)
//const API = 'https://api.quotable.io/random';
const API = 'https://dummyjson.com/quotes/randdssom';

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

async function fetchQuote() {
    try {
        const res = await fetch(API);
        if(!res.ok)
            throw new Error(`API error: ${res.status}`);

        const data = await res.json();

        return { content: data.quote, author: data.author || 'Unkown' };              

    } catch(err) {
        console.warn('Fetch failed, using fallback quotes:', err);

        // Choose random fallback
        return FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
    }
}


function renderQuote({ content, author }) {
    quoteText.textContent = content;
    quoteAuthor.textContent = `— ${author}`;
    throw new Error(`Failure to render`);
}

async function newQuote() {
    // show loading state
    quoteText.textContent = 'Loading quote...';
    quoteAuthor.textContent = '';

    try {
        const q = await fetchQuote();
        renderQuote(q);

    } catch(err) {
        console.error('Unexpected error fetching quote:', err);
        renderQuote({ content: 'Could not load quote.', author:'' });
    }
}

// copy to clipboard
copyBtn.addEventListener('click', async () => {
    const text = `"${quoteText.textContent}" ${quoteAuthor.textContent}`;
         
    try {
         await navigator.clipboard.writeText(text);
         
         copyBtn.textContent ='Copied!';
         
         //setTimeout(() => (copyBtn.textContent ='Copy'),1500);

         setTimeout(() => {
            copyBtn.textContent ='Copy';
         }, 1500);

    } catch(err) {
        console.err('Copy failed', err);
        alert('Copy failed. Your browser may not support clipboard API.');
    }
});

newBtn.addEventListener('click', newQuote);

// inital load
newQuote();