import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const WEDDING_DATE = new Date('2026-12-15T18:00:00');

function pad(n) { return String(n).padStart(2, '0'); }

export default function Countdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = WEDDING_DATE - Date.now();
      if (diff <= 0) return;
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ];

  return (
    <section className="section">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1 }}
        style={{ textAlign: 'center', width: '100%' }}
      >
        <p className="serif-font" style={{ fontSize: '1rem', letterSpacing: '4px', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
          Counting Down To
        </p>
        <h2 className="serif-font text-gradient" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>
          The Big Day
        </h2>

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {units.map(({ label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-panel"
              style={{ minWidth: '120px', padding: '2rem 1.5rem' }}
            >
              <div className="serif-font text-gradient" style={{ fontSize: '3.5rem', fontWeight: 'bold', lineHeight: 1 }}>
                {pad(value)}
              </div>
              <div style={{ fontSize: '0.75rem', letterSpacing: '3px', color: 'var(--text-secondary)', marginTop: '0.75rem', textTransform: 'uppercase' }}>
                {label}
              </div>
            </motion.div>
          ))}
        </div>

        <p style={{ marginTop: '2rem', color: 'var(--text-secondary)', letterSpacing: '2px', fontSize: '1rem' }}>
          December 15, 2026
        </p>
      </motion.div>
    </section>
  );
}
