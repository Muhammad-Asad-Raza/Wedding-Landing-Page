import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(encodeURI('/HUGEL x SOLTO - Jamaican (Bam Bam) (Sammy Flash Afro House Remix).mp3'));
    audioRef.current.loop = true;
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3, duration: 1 }}
      style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100 }}
    >
      <button 
        onClick={togglePlay}
        className="btn-premium"
        style={{ padding: '12px', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}
        title="Play Background Music"
      >
        {isPlaying ? '⏸' : '🎵'}
      </button>
    </motion.div>
  );
}
