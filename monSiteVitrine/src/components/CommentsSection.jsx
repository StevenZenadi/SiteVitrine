// src/components/CommentsSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import './CommentsSection.css';
import LogoSpinner from '../components/LogoSpinner';

function CommentsSection({ apiStatus, onApiOnline }) {
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const pollingRef = useRef(null);

  const fetchComments = async () => {
    try {
      const res = await fetch(process.env.REACT_APP_COMMENTS_ENDPOINT);
      if (!res.ok) throw new Error("Erreur réseau: " + res.status);
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Format de réponse inattendu");
      }
      setComments(data);
      // Lorsque tout est ok, on arrête le polling et on signale que l'API est online
      if (onApiOnline) onApiOnline();
      clearInterval(pollingRef.current);
    } catch (error) {
      console.error(error);
      setStatus('error'); 
      // On ne change pas l'état global, donc on reste en "loading"
    }
  };

  // Mise en place du polling local tant que l'API est en "loading"
  useEffect(() => {
    if (apiStatus === 'loading') {
      // Tentative initiale
      fetchComments();

      // Mise en place du polling toutes les 5s
      pollingRef.current = setInterval(() => {
        fetchComments();
      }, 5000);

      return () => clearInterval(pollingRef.current);
    }
  }, [apiStatus]);

  // Nouvel effet : si l'API est online, on refait un fetch au montage ou au retour sur la page
  useEffect(() => {
    if (apiStatus === 'online' && comments.length === 0) {
      fetchComments();
    }
  }, [apiStatus, comments.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const response = await fetch(process.env.REACT_APP_COMMENTS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!response.ok) {
        throw new Error('Erreur lors de l’envoi du commentaire');
      }
      const newComment = await response.json();
      setComments([newComment, ...comments]);
      setForm({ name: '', email: '', message: '' });
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  if (apiStatus === 'loading') {
    return (
      <div className="comments-section-container">
        <div className="loading-container">
          <LogoSpinner />
          <p>Chargement de l'API, veuillez patienter...</p>
          {status === 'error' && (
            <p className="error-message">Erreur CORS ou réseau. Nouvelle tentative dans 5s.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="comments-section-container">
      <form className="comments-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Votre nom"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Votre email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Votre commentaire..."
          rows="4"
          value={form.message}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-primary">Envoyer</button>
      </form>
      {status === 'sending' && <p>Envoi en cours...</p>}
      {status === 'success' && <p>Commentaire envoyé avec succès !</p>}
      {status === 'error' && <p className="error-message">Erreur lors de l’envoi. Réessayez.</p>}
      <div className="comments-list">
        {comments.length === 0 ? (
          <p>Aucun commentaire pour le moment.</p>
        ) : (
          comments.map(comment => {
            const year = new Date(comment.created_at).getFullYear();
            return (
              <div key={comment.id} className="comment-card">
                <p className="comment-header">
                  <strong>{comment.name}</strong> <span className="comment-date">{year}</span>
                </p>
                <p className="comment-message">{comment.message}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default CommentsSection;
