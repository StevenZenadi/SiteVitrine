// src/pages/Contact.jsx
import React, { useState } from 'react';
import "./Contact.css";
import imageProfil from "../images/Profil.jpg";
import { FaUser, FaEnvelope, FaLinkedin } from 'react-icons/fa';
import LogoSpinner from '../components/LogoSpinner';

function Contact({ apiStatus, onApiOnline }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const response = await fetch(process.env.REACT_APP_CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: "Contact depuis le site",
          message: form.message
        })
      });
      if (!response.ok) {
        const text = await response.text();
        console.error('Réponse brute du serveur:', text);
        throw new Error('Erreur lors de l’envoi du mail');
      }
      setStatus('success');
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <section className="contact-section">
      {/* Photo de profil */}
      <div className="profile-pic-container">
        <img src={imageProfil} alt="Mon portrait" className="profile-pic" />
      </div>

      {/* Accroche personnelle */}
      <p className="accroche-personnelle">
        Passionné par la création de projets innovants, je serais ravi d’échanger avec vous pour donner vie à vos idées.
      </p>

      <h1>Contactez-moi</h1>
      <p className="intro-paragraph">
        N’hésitez pas à me laisser un message si vous souhaitez plus d’informations ou me contacter pour un projet. Je réponds généralement sous 48h.
      </p>

      {/* Lien vers LinkedIn */}
      <div className="social-links">
        <a
          href="https://www.linkedin.com/in/steven-zenadi-885281150"
          target="_blank"
          rel="noopener noreferrer"
          className="linkedin-link"
        >
          <FaLinkedin className="icon-linkedin" /> Mon LinkedIn
        </a>
      </div>

      {/* Affichage conditionnel : spinner si l'API n'est pas en ligne, sinon le formulaire */}
      {apiStatus !== 'online' ? (
        <div className="contact-loading">
          <LogoSpinner size={40} />
          <p>Chargement du service de contact...</p>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              <FaUser className="icon-form" /> Nom
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Votre nom"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope className="icon-form" /> Adresse Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="votre.email@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              placeholder="Votre message..."
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Envoyer
          </button>
        </form>
      )}

      {status === 'sending' && <p>Envoi en cours...</p>}
      {status === 'success' && <p>Email envoyé avec succès !</p>}
      {status === 'error' && <p>Une erreur est survenue lors de l’envoi. Veuillez réessayer.</p>}
    </section>
  );
}

export default Contact;
