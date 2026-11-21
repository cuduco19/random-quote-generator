const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const historyList = document.getElementById('history-list');

export function renderQuote({ content, author }) {
    quoteText.textContent = content;
    quoteAuthor.textContent = `— ${author}`;
}

export function renderHistory(quoteHistory) {
    historyList.innerHTML = '';

    if (quoteHistory.length === 0) {
        historyList.innerHTML = '<li class="history-empty">No quotes in history yet.</li>';
        return;
    }

    quoteHistory.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="history-quote">"${item.content}"</div>
            <div class="history-author">— ${item.author}</div>
        `;

        li.addEventListener('click', () => renderQuote(item));

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