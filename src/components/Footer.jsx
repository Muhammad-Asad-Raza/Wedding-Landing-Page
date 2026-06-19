import React from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      style={{
        textAlign: 'center',
        padding: '4rem 2rem 2rem',
        position: 'relative',
        zIndex: 1,
        borderTop: '1px solid rgba(255,182,193,0.1)',
      }}
    >
      <h2 className="serif-font text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Aqsa & Huzaifa</h2>
      <p style={{ color: 'var(--text-secondary)', letterSpacing: '4px', fontSize: '0.85rem', marginBottom: '2rem' }}>
        DECEMBER 15, 2026
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {['Mehndi', 'Baraat', 'Walima', 'Gallery', 'RSVP'].map((item) => (
          <span key={item} style={{ color: 'rgba(255,182,193,0.5)', fontSize: '0.85rem', letterSpacing: '2px', cursor: 'default' }}>{item}</span>
        ))}
      </div>

      <p style={{ fontSize: '0.8rem', color: 'rgba(255,182,193,0.3)', letterSpacing: '1px' }}>
        Made with ❤️ for Aqsa & Huzaifa — All Rights Reserved 2026
      </p>
    </motion.footer>
  );
}
