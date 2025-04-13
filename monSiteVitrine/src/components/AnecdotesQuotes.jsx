import React from 'react';
import './AnecdotesQuotes.css';

function AnecdotesQuotes() {
  const quotes = [
    { text: "La connaissance naît de la passion, tout autre éléments ne sont que catalyseurs ou inhibiteurs. La passion est inée.", author: "Steven" },
  ];

  return (
    <div className="anecdotes-quotes">
      {quotes.map((quote, index) => (
        <blockquote key={index}>
          <p>"{quote.text}"</p>
          <footer>- {quote.author}</footer>
        </blockquote>
      ))}
    </div>
  );
}

export default AnecdotesQuotes;
