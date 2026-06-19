import React from 'react';
import { motion } from 'framer-motion';

const events = [
  {
    title: 'Mehndi Night',
    date: 'December 13, 2026',
    time: '7:00 PM onwards',
    venue: 'Family Residence, Karachi',
    description: 'An evening filled with henna, music, and celebration as we welcome the festivities.',
    icon: '🌸',
    color: '#ff69b4',
  },
  {
    title: 'Baraat Ceremony',
    date: 'December 15, 2026',
    time: '6:00 PM onwards',
    venue: 'Royal Grand Hall, Karachi',
    description: 'The most awaited moment — join us as Huzaifa arrives to take his bride home.',
    icon: '💒',
    color: '#d4af37',
  },
  {
    title: 'Walima Reception',
    date: 'December 17, 2026',
    time: '7:30 PM onwards',
    venue: 'Pearl Continental Banquet, Karachi',
    description: 'Celebrate the union of Aqsa and Huzaifa at a grand reception dinner.',
    icon: '✨',
    color: '#c084fc',
  },
];

export default function Events() {
  return (
    <section className="section">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1 }}
        style={{ textAlign: 'center', width: '100%', maxWidth: '1000px' }}
      >
        <p className="serif-font" style={{ fontSize: '1rem', letterSpacing: '4px', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
          Save The Date
        </p>
        <h2 className="serif-font text-gradient" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>
          Wedding Events
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {events.map((ev, i) => (
            <motion.div
              key={ev.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="glass-panel"
              style={{ textAlign: 'left', borderColor: ev.color + '44', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: ev.color }} />
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{ev.icon}</div>
              <h3 className="serif-font" style={{ fontSize: '1.6rem', color: ev.color, marginBottom: '1rem' }}>{ev.title}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', letterSpacing: '1px', color: 'var(--accent-gold)' }}>📅 {ev.date}</span>
                <span style={{ fontSize: '0.85rem', letterSpacing: '1px', color: 'var(--text-secondary)' }}>🕐 {ev.time}</span>
                <span style={{ fontSize: '0.85rem', letterSpacing: '1px', color: 'var(--text-secondary)' }}>📍 {ev.venue}</span>
              </div>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'rgba(255,240,245,0.7)' }}>{ev.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
