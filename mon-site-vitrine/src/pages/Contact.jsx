// src/pages/Contact.jsx
import React, { useState } from 'react';
import "./Contact.css";
import imageProfil from "../images/Profil.jpg";
import { FaUser, FaEnvelope, FaLinkedin } from 'react-icons/fa';

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Préparer le sujet et le corps du message
    const subject = encodeURIComponent("IMPORTANT");
    const body = encodeURIComponent(
      `Nom : ${form.name}\nEmail : ${form.email}\n\n${form.message}`
    );
    // Construire le lien mailto
    const mailtoLink = `mailto:steven.zenadi@orange.fr?subject=${subject}&body=${body}`;

    // Ouvrir le client mail par défaut
    window.location.href = mailtoLink;
    // Réinitialiser le formulaire
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="contact-section">
      {/* Photo de profil */}
      <div className="profile-pic-container">
        <img
          src={imageProfil}
          alt="Mon portrait"
          className="profile-pic"
        />
      </div>

      {/* Accroche personnelle */}
      <p className="accroche-personnelle">
        Passionné par la création de projets innovants, je serais ravi d’échanger
        avec vous pour donner vie à vos idées.
      </p>

      <h1>Contactez-moi</h1>
      <p className="intro-paragraph">
        N’hésitez pas à me laisser un message si vous souhaitez plus d’informations
        ou me contacter pour un projet. Je réponds généralement sous 48h.
      </p>

      {/* Lien vers LinkedIn */}
      <div className="social-links">
        <a
          href="https://www.linkedin.com/in/steven-zenadi-885281150"
          target="_blank"
          rel="noopener noreferrer"
          className="linkedin-link"
        >
          <FaLinkedin className="icon-linkedin" />
          Mon LinkedIn
        </a>
      </div>

      {/* Formulaire */}
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
            placeholder="steven.zenadi@orange.fr"
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
    </section>
  );
}

export default Contact;
