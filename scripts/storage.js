const STORAGE_KEY = 'quote_history';
const MAX_HISTORY = 10;

export function getHistory() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function addQuoteToHistory(quote) {
    const current = getHistory().filter((item) => item.content !== quote.content);
    const updated = [quote, ...current].slice(0, MAX_HISTORY);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
}

export function clearStoredHistory() {
    localStorage.removeItem(STORAGE_KEY);
    return [];
}