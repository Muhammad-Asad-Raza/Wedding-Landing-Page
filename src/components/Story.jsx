import React from 'react';
import { motion } from 'framer-motion';

const timeline = [
  { year: '2022', title: 'First Meeting', desc: 'Two families, one fateful introduction — and from that moment, something beautiful began to bloom.', icon: '🌷' },
  { year: '2023', title: 'Growing Together', desc: 'Shared moments, quiet conversations, and the slow realization that this was something meant to be.', icon: '🌿' },
  { year: '2024', title: 'The Promise', desc: 'Hearts aligned, families united — Huzaifa asked, and Aqsa said yes. The journey truly began.', icon: '💍' },
  { year: '2026', title: 'Forever Begins', desc: 'Now we stand at the threshold of forever, grateful and joyful, ready to begin our new chapter together.', icon: '✨' },
];

export default function Story() {
  return (
    <section className="section">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1 }}
        style={{ textAlign: 'center', width: '100%', maxWidth: '800px' }}
      >
        <p className="serif-font" style={{ fontSize: '1rem', letterSpacing: '4px', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
          How It All Began
        </p>
        <h2 className="serif-font text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Our Story</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'rgba(255,240,245,0.7)', marginBottom: '4rem' }}>
          Two souls, one beautiful journey. Join us as we celebrate the union of <strong style={{ color: 'var(--text-secondary)' }}>Aqsa Kanwal</strong> and <strong style={{ color: 'var(--accent-gold)' }}>Huzaifa Khan</strong> in a night filled with love, joy, and unforgettable memories.
        </p>

        {/* Timeline */}
        <div style={{ position: 'relative', textAlign: 'left' }}>
          {/* vertical line */}
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(255,182,193,0.3), transparent)', transform: 'translateX(-50%)' }} />

          {timeline.map((item, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                style={{
                  display: 'flex',
                  justifyContent: isLeft ? 'flex-start' : 'flex-end',
                  marginBottom: '2rem',
                  position: 'relative',
                }}
              >
                {/* dot */}
                <div style={{
                  position: 'absolute', left: '50%', top: '1.5rem',
                  width: '12px', height: '12px', borderRadius: '50%',
                  background: 'var(--accent-gold)',
                  transform: 'translateX(-50%)',
                  boxShadow: '0 0 12px rgba(212,175,55,0.6)',
                }} />

                <div className="glass-panel" style={{ width: '44%', padding: '1.5rem' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{item.icon}</div>
                  <div style={{ fontSize: '0.75rem', letterSpacing: '3px', color: 'var(--accent-gold)', marginBottom: '0.25rem' }}>{item.year}</div>
                  <h3 className="serif-font" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.7', color: 'rgba(255,240,245,0.65)' }}>{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
