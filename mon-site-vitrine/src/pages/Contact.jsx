// src/pages/Contact.jsx
import React, { useState } from 'react';
import "./Contact.css"; // Pour le style

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent("IMPORTANT");
    const body = encodeURIComponent(
      `Nom : ${form.name}\nEmail : ${form.email}\n\n${form.message}`
    );
    const mailtoLink = `mailto:ton-adresse@example.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="contact-section">
      {/* Conteneur pour la photo */}
      <div className="profile-pic-container">
        <img
          src="/images/moi.jpg" // <- remplace par le chemin de ta photo
          alt="Mon portrait"
          className="profile-pic"
        />
      </div>

      <h1>Contactez-moi</h1>
      <p>
        N’hésitez pas à me laisser un message si vous souhaitez plus d’informations 
        ou me contacter pour un projet.
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nom</label>
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
          <label htmlFor="email">Adresse Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="votre.email@exemple.com"
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
