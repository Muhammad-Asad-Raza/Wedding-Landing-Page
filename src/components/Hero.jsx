import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div className="hero-section" style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffb6c1" />
          <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Sphere args={[1.5, 64, 64]} position={[0, 0, 0]}>
              <MeshDistortMaterial
                color="#ff69b4"
                attach="material"
                distort={0.4}
                speed={1.5}
                roughness={0.2}
                metalness={0.8}
              />
            </Sphere>
          </Float>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      <div className="hero-content" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, pointerEvents: 'none' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className="glass-panel text-center"
          style={{ pointerEvents: 'auto', textAlign: 'center' }}
        >
          <h2 className="serif-font" style={{ fontSize: '1.5rem', letterSpacing: '4px', marginBottom: '1rem', color: '#ffb6c1' }}>THE WEDDING CELEBRATION OF</h2>
          <h1 className="serif-font text-gradient" style={{ fontSize: '4.5rem', lineHeight: '1.2', marginBottom: '1rem', fontWeight: 'bold' }}>Aqsa &<br/>Huzaifa</h1>
          <p style={{ fontSize: '1.2rem', letterSpacing: '2px', marginBottom: '2rem', color: '#fff0f5' }}>DECEMBER 2026</p>
          <button className="btn-premium">View Invitation</button>
        </motion.div>
      </div>
    </div>
  );
}
