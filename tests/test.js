 const resultsList = document.getElementById('results');

    function test(name, fn) {
      const li = document.createElement('li');
      try {
        fn();
        li.textContent = `PASS: ${name}`;
        li.className = 'pass';
      } catch (err) {
        li.textContent = `FAIL: ${name} — ${err.message}`;
        li.className = 'fail';
      }
      resultsList.appendChild(li);
    }

    function assertEqual(actual, expected, label) {
      if (actual !== expected) {
        throw new Error(`${label} expected "${expected}", got "${actual}"`);
      }
    }

    // Test 1: Renders quote text and author accurately
    test('updates quote text and author in the DOM', () => {
      const sampleQuote = {
        content: 'Simplicity is the ultimate sophistication.',
        author: 'Leonardo da Vinci'
      };

      renderQuote(sampleQuote);

      const quoteText = document.getElementById('quote-text').textContent;
      const authorText = document.getElementById('quote-author').textContent;

      assertEqual(quoteText.includes(sampleQuote.content), true, 'Quote text');
      assertEqual(authorText.includes(sampleQuote.author), true, 'Author text');
    });

   // Test 2: Handles quotes with missing or empty authors without crashing
    test('handles quotes with missing or unknown authors gracefully', () => {
      const noAuthorQuote = { content: 'Stay curious.', author: '' };
      renderQuote(noAuthorQuote);
      const quoteText = document.getElementById('quote-text').textContent;
        
      assertEqual(quoteText.includes(noAuthorQuote.content), true, 'Quote text'); 
   
    });