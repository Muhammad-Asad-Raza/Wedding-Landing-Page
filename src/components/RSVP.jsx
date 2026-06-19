import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function RSVP() {
  const [form, setForm] = useState({ name: '', phone: '', guests: '1', attending: 'yes', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to backend / WhatsApp / email
    setSubmitted(true);
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,182,193,0.05)',
    border: '1px solid rgba(255,182,193,0.2)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    fontFamily: 'Poppins, sans-serif',
    outline: 'none',
    transition: 'border-color 0.3s',
  };

  return (
    <section className="section">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1 }}
        style={{ textAlign: 'center', width: '100%', maxWidth: '600px' }}
      >
        <p className="serif-font" style={{ fontSize: '1rem', letterSpacing: '4px', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
          You're Invited
        </p>
        <h2 className="serif-font text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
          RSVP
        </h2>
        <p style={{ color: 'rgba(255,240,245,0.6)', marginBottom: '2.5rem', lineHeight: '1.7' }}>
          Please confirm your attendance by <strong style={{ color: 'var(--accent-gold)' }}>December 1, 2026</strong>. We can't wait to celebrate with you!
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel"
            style={{ padding: '3rem' }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💌</div>
            <h3 className="serif-font text-gradient" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Thank You!</h3>
            <p style={{ color: 'rgba(255,240,245,0.7)', lineHeight: '1.7' }}>
              Your RSVP has been received. We look forward to celebrating this beautiful day with you, {form.name}!
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-panel" style={{ textAlign: 'left' }}>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>Full Name</label>
                <input style={inputStyle} type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>Phone / WhatsApp</label>
                <input style={inputStyle} type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+92 300 0000000" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>Attending?</label>
                  <select style={inputStyle} name="attending" value={form.attending} onChange={handleChange}>
                    <option value="yes">Yes, I'll be there!</option>
                    <option value="no">Sadly, can't make it</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>No. of Guests</label>
                  <select style={inputStyle} name="guests" value={form.guests} onChange={handleChange}>
                    {['1','2','3','4','5','6+'].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>Message (Optional)</label>
                <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical' }} name="message" value={form.message} onChange={handleChange} placeholder="Send your wishes to the couple..." />
              </div>

              <button type="submit" className="btn-premium" style={{ width: '100%', padding: '14px' }}>
                Confirm Attendance
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </section>
  );
}
