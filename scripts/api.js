const API = 'https://dummyjson.com/quotes/random';

export const FALLBACK = [
    { content: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
    { content: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
    { content: "First, solve the problem. Then, write the code.", author: "John Johnson" }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchQuote(maxRetries = 3, baseDelay = 500) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const res = await fetch(API);

            if (!res.ok) {
                throw new Error(`API error: ${res.status}`);
            }

            const data = await res.json();
            return { content: data.quote, author: data.author || 'Unknown' };
        } catch (err) {
            if (attempt === maxRetries - 1) {
                console.warn(`All ${maxRetries} retries failed. Using fallback quote:`, err);
                break;
            }

            const expDelay = baseDelay * Math.pow(2, attempt);
            const half = expDelay / 2;
            const delay = Math.floor(half + Math.random() * half);

            console.warn(`Fetch attempt ${attempt + 1} failed. Retrying in ${delay}ms...`, err);
            await sleep(delay);
        }
    }

    return FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
}
