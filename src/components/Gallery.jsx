import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Photos: you can place real images under `public/gallery/` and reference them via `src` below.
// Add your third image to `public/gallery/photo3.jpg` and it will appear automatically.
const photos = [
  { id: 1, label: 'Together', gradient: 'linear-gradient(135deg, #ff69b4, #d4af37)' },
  { id: 2, label: 'Promise', gradient: 'linear-gradient(135deg, #c084fc, #ff69b4)' },
  // Using images uploaded to `public/` — these files were detected in the project root `public`
  { id: 3, label: 'Joy',     src: '/aqsatogetterpic.jpeg', gradient: 'linear-gradient(135deg, #d4af37, #ff9e6d)' },
  { id: 4, label: 'Love',    src: '/togetheraqsa.jpeg',    gradient: 'linear-gradient(135deg, #f472b6, #c084fc)' },
  { id: 5, label: 'Valima Hall', src: '/valima hall.jpeg',     gradient: 'linear-gradient(135deg, #ff69b4, #c084fc)' },
  { id: 6, label: 'Wedding Hall', src: '/wedding hall.jpeg',   gradient: 'linear-gradient(135deg, #d4af37, #ff69b4)' },
];

export default function Gallery() {
  const [selected, setSelected] = useState(null);

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
          Our Memories
        </p>
        <h2 className="serif-font text-gradient" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>
          Photo Gallery
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelected(photo)}
              style={{
                  height: '220px',
                  borderRadius: '16px',
                  background: photo.gradient,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255,182,193,0.2)',
                  overflow: 'hidden',
                  position: 'relative',
                }}
            >
                {photo.src ? (
                  <img src={encodeURI(photo.src)} alt={photo.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span className="serif-font" style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '3px' }}>
                    {photo.label}
                  </span>
                )}
            </motion.div>
          ))}
        </div>

        <p style={{ marginTop: '1.5rem', color: 'rgba(255,182,193,0.5)', fontSize: '0.85rem', letterSpacing: '2px' }}>
          Photos coming soon — replace gradients with your actual images
        </p>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 999, cursor: 'pointer',
            }}
          >
              <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
              style={{
                width: '80vmin', height: '80vmin', maxWidth: '600px', maxHeight: '600px',
                borderRadius: '24px', background: selected.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {selected.src ? (
                <img src={encodeURI(selected.src)} alt={selected.label} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
              ) : (
                <span className="serif-font" style={{ fontSize: '2rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '4px' }}>
                  {selected.label}
                </span>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
