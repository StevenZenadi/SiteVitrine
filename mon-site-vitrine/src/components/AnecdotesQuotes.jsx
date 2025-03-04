import React from 'react';
import './AnecdotesQuotes.css';

function AnecdotesQuotes() {
  const quotes = [
    { text: "Une etoile qui brille deux fois plus fort, brille deux fois moins longtemps.", author: "Steven" },
    { text: "La connaissance vient avec la passion, la passion quand à elle est inée.", author: "Steven" },
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
