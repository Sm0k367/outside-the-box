import { useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

// Simple neon material helper
const NeonMaterial = ({ color, emissive = "#000000", intensity = 1 }) => (
  <meshStandardMaterial
    color={color}
    emissive={emissive}
    emissiveIntensity={intensity}
    metalness={0.9}
    roughness={0.1}
  />
);

// Basic particle system for debris/code/glitch
const Particles = ({ frame, count = 80, color = "#00f7ff" }) => {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 40;
      positions[i + 1] = (Math.random() - 0.5) * 25 - 5;
      positions[i + 2] = (Math.random() - 0.5) * 40;
      colors[i] = 0.0;
      colors[i + 1] = 0.8;
      colors[i + 2] = 1.0;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, [count]);

  const particleFrame = frame * 0.8; // speed

  return (
    <points geometry={points}>
      <pointsMaterial
        size={0.25}
        vertexColors
        transparent
        opacity={0.7 + Math.sin(particleFrame * 0.2) * 0.3}
        sizeAttenuation
      />
    </points>
  );
};

export const CyberpunkLoop: React.FC<{
  title?: string;
}> = ({ title = "AVATAR vs ENFORCER" }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  
  // 8 shots ~56 frames each (15s = 450 frames)
  const shotDuration = 56;
  const currentShot = Math.floor(frame / shotDuration) % 8; // loops
  const shotProgress = (frame % shotDuration) / shotDuration;

  // Camera position per shot (MS, WS, CU, angles, moves)
  const cameraPos = useMemo(() => {
    const baseX = Math.sin(frame * 0.02) * 3;
    const baseZ = 18 - Math.sin(frame * 0.015) * 5;
    
    if (currentShot === 0) return [baseX - 8, 4, baseZ]; // Shot 1: MS glide
    if (currentShot === 1) return [baseX, -8, baseZ + 5]; // Shot 2: WS collapse
    if (currentShot === 2) return [baseX + 6, 12, baseZ - 8]; // Shot 3: MS apex freeze
    if (currentShot === 3) return [baseX * 0.5, 2, baseZ - 12]; // Shot 4: dramatic push-in
    if (currentShot === 4) return [0, 5, 25]; // Shot 5: WS low angle blast
    if (currentShot === 5) return [0, 3, 6]; // Shot 6: CU slow-mo contact
    if (currentShot === 6) return [baseX * -2, 18, baseZ - 25]; // Shot 7: MS to WS god pose pullback
    return [baseX * 1.5, 6, baseZ + 8]; // Shot 8: shockwave spin + loop reset
  }, [frame, currentShot]);

  const avatarPos = useMemo(() => {
    const sway = Math.sin(frame * 0.15) * 1.5;
    if (currentShot === 0) return [sway - 6, 2 + Math.sin(frame * 0.2) * 1, -8]; // gliding
    if (currentShot === 1) return [sway, -12 + shotProgress * 18, -15]; // freefall
    if (currentShot === 2) return [sway * 0.5, 18, -5]; // pendulum apex freeze
    if (currentShot === 3) return [sway + 4, 3 + Math.cos(shotProgress * Math.PI) * 8, -22]; // rebound
    if (currentShot === 5) return [2, 3, 4]; // contact with enforcer
    if (currentShot === 6) return [sway * -1.5, 22, -18]; // god pose
    if (currentShot === 7) return [sway * 3, 4, -10]; // shockwave spin back to start
    return [sway - 6, 2, -8]; // default glide pose for loop
  }, [frame, currentShot, shotProgress]);

  const enforcerPos = useMemo(() => [8, 8 + Math.sin(frame * 0.08) * 2, -25], [frame]);

  return (
    <div style={{ background: "#0a0014" }}>
      <ThreeCanvas width={width} height={height} style={{ width: "100%", height: "100%" }}>
        {/* Lighting - neon cyberpunk style */}
        <ambientLight intensity={0.3} color="#4400aa" />
        <directionalLight position={[10, 25, 15]} intensity={1.2} color="#00f7ff" />
        <pointLight position={[-15, 8, -10]} intensity={2.5} color="#ff00aa" distance={60} />
        <pointLight position={[20, -5, -30]} intensity={3} color="#ff8800" distance={50} />

        {/* Fog for neon haze */}
        <fog attach="fog" args={["#0a0014", 15, 65]} />

        {/* Neon Lounge Floor + Structures (collapsing feel) */}
        <mesh position={[0, -6, -20]} rotation={[0.2, 0, 0]}>
          <planeGeometry args={[60, 60]} />
          <NeonMaterial color="#110022" emissive="#220044" intensity={0.6} />
        </mesh>

        {/* Collapsing walls / structures */}
        <mesh position={[-18, 8, -35]} rotation={[0.3, 0.4, 0]}>
          <boxGeometry args={[8, 22, 6]} />
          <NeonMaterial color="#220033" emissive="#aa00ff" intensity={1.8} />
        </mesh>
        <mesh position={[22, 6, -28]} rotation={[-0.4, -0.6, 0.2]}>
          <boxGeometry args={[10, 18, 5]} />
          <NeonMaterial color="#002244" emissive="#00ddff" intensity={2.2} />
        </mesh>

        {/* AVATAR (neon glowing figure) */}
        <group position={avatarPos}>
          {/* Body */}
          <mesh>
            <capsuleGeometry args={[1.2, 4, 6, 12]} />
            <NeonMaterial color="#00ffdd" emissive="#00ffff" intensity={3 + Math.sin(frame * 0.4) * 1} />
          </mesh>
          {/* Head */}
          <mesh position={[0, 4, 0]}>
            <sphereGeometry args={[1.1, 16, 16]} />
            <NeonMaterial color="#aaffff" emissive="#00f7ff" intensity={4} />
          </mesh>
          {/* Neon tattoos / energy lines - represented by smaller emissive boxes */}
          <mesh position={[0, 1, 1.6]} rotation={[frame * 0.1, 0, 0]}>
            <boxGeometry args={[0.4, 3.2, 0.3]} />
            <NeonMaterial color="#ff00ff" emissive="#ff00ff" intensity={5} />
          </mesh>
        </group>

        {/* GIANT ENFORCER (shadowy armored giant) */}
        <group position={enforcerPos} scale={[2.8, 2.8, 2.8]}>
          <mesh>
            <boxGeometry args={[3, 7, 2.5]} />
            <NeonMaterial color="#330011" emissive="#880022" intensity={2.5} />
          </mesh>
          <mesh position={[0, 5, 0]}>
            <sphereGeometry args={[2.2, 12, 12]} />
            <NeonMaterial color="#441100" emissive="#ff2200" intensity={1.8} />
          </mesh>
        </group>

        {/* Particles / Holographic Debris / Code Rain / Explosions */}
        <Particles frame={frame} count={120} color="#00f7ff" />
        <Particles frame={frame * 1.4} count={60} color="#ff00aa" />

        {/* Camera Controller */}
        <perspectiveCamera
          makeDefault
          position={cameraPos}
          fov={currentShot === 5 ? 28 : currentShot === 4 ? 42 : 35} // focal length simulation
          lookAt={currentShot === 5 ? [2, 3, 4] : [0, 4, -15]}
        />
      </ThreeCanvas>

      {/* 2D Overlay Text / Shot Labels (Remotion style) */}
      <Sequence from={0} durationInFrames={450} layout="none">
        <div
          style={{
            position: "absolute",
            top: 60,
            left: "50%",
            transform: "translateX(-50%)",
            color: "#00f7ff",
            fontSize: "42px",
            fontWeight: "bold",
            textShadow: "0 0 30px #ff00ff, 0 0 60px #00ffff",
            letterSpacing: "4px",
            textAlign: "center",
            pointerEvents: "none",
            zIndex: 10,
            opacity: 0.95,
          }}
        >
          {title}
          <div style={{ fontSize: "22px", marginTop: "12px", color: "#ff00aa", opacity: 0.9 }}>
            SHOT {currentShot + 1} • {["GLIDE + SHADOW RISE", "LOUNGE COLLAPSE + HOOK", "PENDULUM FREEZE", "DEBRIS REBOUND", "ENERGY BLAST", "CU CONTACT SLOW-MO", "DIGITAL GOD POSE", "SHOCKWAVE LOOP RESET"][currentShot]}
          </div>
        </div>
      </Sequence>
    </div>
  );
};
