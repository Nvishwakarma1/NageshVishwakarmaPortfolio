import { useState, useEffect, Suspense, useMemo, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import GlitchText from '../GlitchText';
import Marquee from '../Marquee';
import Magnetic from '../Magnetic';
import ProfileCard from './ProfileCard';

const GithubIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Mathematical Möbius Ring 3D Component
function MobiusRing({ baseSpeed, twists, thickness, renderStyle, activeColor, targetShape }) {
  const meshRef = useRef();
  const groupRef = useRef();
  const pointerActiveRef = useRef(false);
  const scrollVelocityRef = useRef(0);
  const shatterTimeRef = useRef(-10);
  const { clock, viewport, camera } = useThree();

  // 1. Möbius Strip geometry
  const mobiusGeometry = useMemo(() => {
    const radius = 2.0;
    const width = thickness;
    const uSegments = 100;
    const vSegments = 15;

    const geom = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];
    const uvs = [];

    const isOdd = twists % 2 !== 0;

    for (let i = 0; i <= uSegments; i++) {
      for (let j = 0; j <= vSegments; j++) {
        let x, y, z;
        if (i === uSegments) {
          const uStart = 0;
          const vFlipped = isOdd 
            ? ((vSegments - j) / vSegments - 0.5) * width 
            : (j / vSegments - 0.5) * width;
          const angleStart = (uStart * twists) / 2;
          x = (radius + vFlipped * Math.cos(angleStart)) * Math.cos(uStart);
          y = (radius + vFlipped * Math.cos(angleStart)) * Math.sin(uStart);
          z = vFlipped * Math.sin(angleStart);
        } else {
          const u = (i / uSegments) * Math.PI * 2;
          const v = (j / vSegments - 0.5) * width;
          const angle = (u * twists) / 2;
          x = (radius + v * Math.cos(angle)) * Math.cos(u);
          y = (radius + v * Math.cos(angle)) * Math.sin(u);
          z = v * Math.sin(angle);
        }

        vertices.push(x, y, z);
        uvs.push(i / uSegments, j / vSegments);
      }
    }

    for (let i = 0; i < uSegments; i++) {
      for (let j = 0; j < vSegments; j++) {
        const a = i * (vSegments + 1) + j;
        const b = i * (vSegments + 1) + j + 1;
        const c = (i + 1) * (vSegments + 1) + j;
        const d = (i + 1) * (vSegments + 1) + j + 1;

        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();

    geom.userData = {
      originalPositions: Float32Array.from(vertices)
    };

    return geom;
  }, [twists, thickness]);

  // 2. Torus Knot geometry
  const torusKnotGeometry = useMemo(() => {
    const rad = 1.3;
    const tube = 0.25 + thickness * 0.25;
    const geom = new THREE.TorusKnotGeometry(rad, tube, 120, 16, 3, 7);
    geom.computeVertexNormals();
    geom.userData = {
      originalPositions: Float32Array.from(geom.attributes.position.array)
    };
    return geom;
  }, [thickness]);

  // 3. Hyper-Sphere geometry
  const sphereGeometry = useMemo(() => {
    const rad = 1.6 + (thickness - 0.6) * 0.5;
    const geom = new THREE.SphereGeometry(rad, 40, 40);
    geom.computeVertexNormals();
    geom.userData = {
      originalPositions: Float32Array.from(geom.attributes.position.array)
    };
    return geom;
  }, [thickness]);

  // Shape selection & scale transition states
  const [currentRenderedShape, setCurrentRenderedShape] = useState(targetShape);
  const transitionScaleRef = useRef(1.0);

  const geometry = useMemo(() => {
    if (currentRenderedShape === 'TORUS_KNOT') return torusKnotGeometry;
    if (currentRenderedShape === 'SPHERE') return sphereGeometry;
    return mobiusGeometry;
  }, [currentRenderedShape, mobiusGeometry, torusKnotGeometry, sphereGeometry]);

  // Handle scroll velocity tracking
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleWheel = (e) => {
      scrollVelocityRef.current += Math.abs(e.deltaY) * 0.05;
    };
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = Math.abs(currentScrollY - lastScrollY);
      scrollVelocityRef.current += diff * 0.08;
      lastScrollY = currentScrollY;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Adjust group scale dynamically to fit the viewport width in 3D units
  const scaleFactor = Math.min(viewport.width / 5.2, 1.1);

  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 0.1);
    const active = pointerActiveRef.current;
    
    // Dynamic mouse coords
    const mouseX = active ? state.pointer.x : 0;
    const mouseY = active ? state.pointer.y : 0;
    const dist = active ? Math.sqrt(mouseX * mouseX + mouseY * mouseY) : 0;

    // Decay the scroll velocity towards 0
    scrollVelocityRef.current = THREE.MathUtils.lerp(scrollVelocityRef.current, 0, 0.05);

    // Speed up rotation when mouse is active and moving, scaled by scroll booster
    const kineticMultiplier = 1.0 + scrollVelocityRef.current;
    const speedFactor = (1.0 + dist * 1.5) * kineticMultiplier * baseSpeed;

    // Shape transition state machine
    const isTransitioning = targetShape !== currentRenderedShape;
    if (isTransitioning) {
      transitionScaleRef.current = THREE.MathUtils.lerp(transitionScaleRef.current, 0, 0.12);
      if (transitionScaleRef.current < 0.02) {
        setCurrentRenderedShape(targetShape);
      }
    } else {
      transitionScaleRef.current = THREE.MathUtils.lerp(transitionScaleRef.current, 1.0, 0.12);
    }

    const activeScale = scaleFactor * transitionScaleRef.current;

    if (meshRef.current) {
      meshRef.current.rotation.x += clampedDelta * 0.15 * speedFactor;
      meshRef.current.rotation.y += clampedDelta * 0.25 * speedFactor;
      
      // Pulse scale factor based on mouse proximity
      const targetScale = activeScale * (1.0 + dist * 0.15);
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.08));
    }

    if (groupRef.current) {
      // Rotate parent group toward pointer
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouseY * 0.6, 0.08);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX * 0.6, 0.08);
    }

    // Apply interactive physics distortions on the CPU
    if (meshRef.current) {
      const activeGeom = meshRef.current.geometry;
      if (activeGeom && activeGeom.userData && activeGeom.userData.originalPositions) {
        const positions = activeGeom.attributes.position.array;
        const originalPositions = activeGeom.userData.originalPositions;
        const normals = activeGeom.attributes.normal.array;
        const count = activeGeom.attributes.position.count;
        const time = clock.getElapsedTime();

        // Project screen pointer coordinate onto the Z=0 plane in 3D
        const mouse3D = new THREE.Vector3(state.pointer.x, state.pointer.y, 0);
        mouse3D.unproject(camera);
        const dir = mouse3D.sub(camera.position).normalize();
        const distanceToZ0 = -camera.position.z / dir.z;
        const targetPoint = camera.position.clone().add(dir.multiplyScalar(distanceToZ0));

        // Transform target point to local space of the mesh
        const tempMatrix = new THREE.Matrix4();
        meshRef.current.updateMatrixWorld();
        tempMatrix.copy(meshRef.current.matrixWorld).invert();
        const localMouse = targetPoint.clone().applyMatrix4(tempMatrix);

        // Click-to-Shatter explosion math
        const elapsed = clock.getElapsedTime() - shatterTimeRef.current;
        const isExploding = elapsed < 1.2;
        const t = isExploding ? elapsed / 1.2 : 1;
        const explosionFactor = isExploding ? Math.sin(t * Math.PI) * (1 - t) * 1.5 : 0;

        // Distortion radii
        const influenceRadius = 1.0;
        const maxDistortion = 0.4;

        const vertex = new THREE.Vector3();
        const pushDir = new THREE.Vector3();

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          const ox = originalPositions[i3];
          const oy = originalPositions[i3 + 1];
          const oz = originalPositions[i3 + 2];

          vertex.set(ox, oy, oz);

          const nx = normals[i3];
          const ny = normals[i3 + 1];
          const nz = normals[i3 + 2];

          // 1. Hyper-Sphere wavelike pulsation along vertex normal
          if (currentRenderedShape === 'SPHERE') {
            const wave = Math.sin(vertex.x * 2.0 + time * 3.0) * 
                         Math.cos(vertex.y * 2.0 + time * 3.0) * 
                         Math.sin(vertex.z * 2.0 + time * 3.0);
            const pulseAmount = wave * 0.15;
            vertex.x += nx * pulseAmount;
            vertex.y += ny * pulseAmount;
            vertex.z += nz * pulseAmount;
          }

          // 2. Shatter explosion displacement along normal vector
          if (isExploding) {
            // Deterministic speed multiplier per vertex to look shattered
            const seed = Math.sin(i * 12.9898) * 43758.5453;
            const speedMult = 0.4 + (seed - Math.floor(seed)) * 1.2;

            vertex.x += nx * explosionFactor * speedMult * 1.2;
            vertex.y += ny * explosionFactor * speedMult * 1.2;
            vertex.z += nz * explosionFactor * speedMult * 1.2;
          }

          // 3. Mouse push distortion
          const distToMouse = vertex.distanceTo(localMouse);
          if (distToMouse < influenceRadius) {
            const force = Math.pow(1 - distToMouse / influenceRadius, 2);
            pushDir.subVectors(vertex, localMouse);
            if (pushDir.lengthSq() > 0.0001) {
              pushDir.normalize();
              vertex.addScaledVector(pushDir, force * maxDistortion);
            }
          }

          // Update active geometry buffer
          positions[i3] = vertex.x;
          positions[i3 + 1] = vertex.y;
          positions[i3 + 2] = vertex.z;
        }

        activeGeom.attributes.position.needsUpdate = true;
      }
    }
  });

  const solidColor = activeColor;
  const wireframeColor = activeColor;

  // onClick event triggers the shatter
  const handleShatter = (e) => {
    e.stopPropagation();
    shatterTimeRef.current = clock.getElapsedTime();
  };


  if (renderStyle === 'WIREFRAME') {
    return (
      <group 
        ref={groupRef}
        onPointerOver={() => { pointerActiveRef.current = true; }}
        onPointerOut={() => { pointerActiveRef.current = false; }}
      >
        <mesh 
          ref={meshRef} 
          geometry={geometry}
          scale={[scaleFactor, scaleFactor, scaleFactor]}
          onClick={handleShatter}
        >
          <meshBasicMaterial
            color={wireframeColor}
            wireframe={true}
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.9}
          />
        </mesh>
      </group>
    );
  }

  if (renderStyle === 'PARTICLES') {
    return (
      <group 
        ref={groupRef}
        onPointerOver={() => { pointerActiveRef.current = true; }}
        onPointerOut={() => { pointerActiveRef.current = false; }}
      >
        <points
          ref={meshRef}
          geometry={geometry}
          scale={[scaleFactor, scaleFactor, scaleFactor]}
          onClick={handleShatter}
        >
          <pointsMaterial
            color={wireframeColor}
            size={0.05}
            sizeAttenuation={true}
            transparent={true}
            opacity={0.8}
          />
        </points>
      </group>
    );
  }

  // default: SOLID
  return (
    <group 
      ref={groupRef}
      onPointerOver={() => { pointerActiveRef.current = true; }}
      onPointerOut={() => { pointerActiveRef.current = false; }}
    >
      <mesh 
        ref={meshRef} 
        geometry={geometry}
        scale={[scaleFactor, scaleFactor, scaleFactor]}
        onClick={handleShatter}
      >
        <meshStandardMaterial
          color={solidColor}
          flatShading={true}
          roughness={0.5}
          metalness={0.1}
          side={THREE.DoubleSide}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>
    </group>
  );
}

// ─── Black Hole Singularity Component (ported from blackhole_and_singularity.js) ───
function BlackHoleSingularity({ baseSpeed, twists, thickness }) {
  const COUNT = 18000;
  const meshRef = useRef();
  const positionsRef = useRef([]);
  const dummyRef = useRef(new THREE.Object3D());
  const colorRef = useRef(new THREE.Color());
  const { viewport } = useThree();

  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.1), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: true }), []);

  // Pre-fill positions array
  useEffect(() => {
    positionsRef.current = Array.from({ length: COUNT }, () =>
      new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      )
    );
  }, []);

  // Scale to fit the viewport (same logic as MobiusRing)
  const scaleFactor = Math.min(viewport.width / 5.2, 1.1);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh || positionsRef.current.length === 0) return;

    const time = clock.getElapsedTime();
    // baseSpeed controls rotation speed
    const t = time * 0.35 * baseSpeed;

    // Black-hole parameters — wired to control panel sliders:
    //   baseSpeed → spin speed (passed via t above)
    //   twists    → space warp  (maps 1-5 → warp 0.5-4.5)
    //   thickness → disk height (maps 0.2-1.2 → accretion 0.3-2.0)
    const scale = 3;
    const spin = 0.2;
    const accretion = THREE.MathUtils.mapLinear(thickness, 0.2, 1.2, 0.3, 2.0);
    const warp = THREE.MathUtils.mapLinear(twists, 1, 5, 0.5, 4.5);
    const ga = 2.399963229728653;

    for (let i = 0; i < COUNT; i++) {
      const u = (i + 0.5) / COUNT;
      const a = i * ga;
      const band = u * 24.0 - 12.0;
      const disk = 1.0 - Math.abs(Math.sin(band * 0.5));
      const radius = scale * (0.08 + 1.9 * u * u);
      const swirl = a + spin * Math.log(radius + 1.0) - t * (2.0 + 3.0 * (1.0 - u));
      const grav = 1.0 / (1.0 + radius * 0.015);
      const bend = warp * grav * grav;
      const x0 = radius * Math.cos(swirl);
      const z0 = radius * Math.sin(swirl);
      const x = x0 + bend * z0;
      const z = z0 - bend * x0;
      const y = scale * 0.22 * disk * Math.sin(a * 0.17 + t * 4.0) * accretion;

      // Lerp positions for smooth particle flow
      positionsRef.current[i].lerp({ x, y, z }, 0.1);

      const heat = 1.0 - Math.min(1.0, radius / (scale * 2.0));
      const hue = 0.08 + 0.58 * (1.0 - heat);
      const sat = 0.8 + 0.2 * heat;
      const light = 0.15 + 0.55 * Math.pow(heat, 1.5);
      colorRef.current.setHSL(hue, sat, light);

      const dummy = dummyRef.current;
      dummy.position.copy(positionsRef.current[i]);
      dummy.scale.setScalar(scaleFactor);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, colorRef.current);
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, COUNT]}>
    </instancedMesh>
  );
}

// Hex inversion helper for Neo-Brutalist swatch visual active state
const invertColor = (hex) => {
  const color = parseInt(hex.slice(1), 16);
  const inverted = (0xFFFFFF ^ color).toString(16).padStart(6, '0');
  return `#${inverted}`;
};

export default function HeroFrame({ onNavigate, theme, layoutMode }) {
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // States for interactive features
  const [renderStyle, setRenderStyle] = useState('SOLID');
  const [baseSpeed, setBaseSpeed] = useState(1.0);
  const [twists, setTwists] = useState(1);
  const [thickness, setThickness] = useState(0.6);
  const [activeColor, setActiveColor] = useState('#00FF66'); // Default to Electric Mint
  const [activeShape, setActiveShape] = useState('MOBIUS'); // Default to Möbius Strip
  const [isControlsExpanded, setIsControlsExpanded] = useState(false);

  useEffect(() => {
    if (layoutMode === 'minimal') {
      setActiveColor('#ffffff');
      setRenderStyle('WIREFRAME');
    } else {
      setActiveColor('#00FF66');
      setRenderStyle('SOLID');
    }
  }, [layoutMode]);

  // Mouse offset state for watermark parallax reaction
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const handleFrameMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMouseOffset({ x: x * 0.08, y: y * 0.08 });
  };

  const handleFrameMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const SHAPE_NAMES = {
    MOBIUS: 'MOBIUS_RING.EXE',
    TORUS_KNOT: 'TORUS_KNOT.SYS',
    SPHERE: 'HYPER_SPHERE.RAW',
    BLACK_HOLE: 'BLACKHOLE.SINGULARITY'
  };

  useEffect(() => {
    const titles = [
      "Frontend Developer",
      "React Engineer",
      "UI/UX Architect",
      "AI Workflow Integrator",
      "Device Troubleshooter",
      "Problem Solver"
    ];
    let timer;
    const activeWord = titles[currentWordIdx];
    
    const tick = () => {
      if (!isDeleting) {
        setCurrentText(activeWord.slice(0, currentText.length + 1));
        if (currentText === activeWord) {
          timer = setTimeout(() => setIsDeleting(true), 1500);
          return;
        }
      } else {
        setCurrentText(activeWord.slice(0, currentText.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentWordIdx((prev) => (prev + 1) % titles.length);
          return;
        }
      }
      
      const speed = isDeleting ? 40 : 80;
      timer = setTimeout(tick, speed);
    };

    timer = setTimeout(tick, isDeleting ? 40 : 80);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIdx]);

  const marqueeItems = [
    "OPEN TO WORK",
    "REACT SPECIALIST",
    "INTERFACE ENGINEER",
    "AI-ACCELERATED DEVELOPER",
    "SYSTEM TROUBLESHOOTER",
    "NEO-BRUTALIST DESIGN"
  ];

  return (
    <div className="flex flex-col gap-12 pt-[0px]">
      
      {/* Asymmetrical Hero Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative min-h-[500px] lg:min-h-0">
        
        {/* Left Side: Heavy Typography */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left relative z-10">
          
          <div className="flex flex-col">
            <span className="font-mono text-sm font-bold text-pink mb-2 tracking-wider">
              {`> ${currentText}`}
              <span className="animate-pulse text-pink">|</span>
            </span>
            
            <h1 className="font-heading text-5xl md:text-5xl font-black text-text-base leading-none uppercase tracking-tighter">
              <span className="text-mint"><GlitchText text="NAGESH" /></span>
              <span className="block text-2xl md:text-2xl mt-2 text-text-base font-extrabold font-heading">
                <GlitchText text="/ INTERFACE ENGINEER" />
              </span>
            </h1>
          </div>

          <p className="font-mono text-sm md:text-base text-text-base leading-relaxed max-w-2xl border-l-4 border-black pl-4 py-1">
            I craft raw, high-performance web experiences with React, Tailwind CSS, and kinetic micro-interactions. Specializing in responsive interface structures, vector coordinates, and hardware/software diagnostic automation.
          </p>

          {/* Quick Stats tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            {['React 19', 'JavaScript (ES6+)', 'Tailwind CSS', 'AI Engineering', 'B.Tech IT'].map((tag) => (
              <span 
                key={tag}
                className="font-mono text-xs font-bold border-2 border-border-base bg-card-bg px-2.5 py-1 text-text-base shadow-[2px_2px_0px_0px_var(--border-color)]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Magnetic>
              <button 
                onClick={() => onNavigate('projects')} 
                className="bg-mint text-black border-3 border-border-base font-heading font-black text-sm uppercase px-6 py-3 shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-hover active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
              >
                Explore Projects <ArrowRight size={16} />
              </button>
            </Magnetic>
            <Magnetic>
              <button 
                onClick={() => onNavigate('contact')} 
                className="bg-card-bg text-text-base border-3 border-border-base font-heading font-black text-sm uppercase px-6 py-3 shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-hover active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                Get In Touch
              </button>
            </Magnetic>
            
            {/* Social icons with magnetic pull */}
            <div className="flex gap-2">
              <Magnetic>
                <a 
                  href="https://github.com/Nvishwakarma1" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-card-bg text-text-base border-3 border-border-base p-3 shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-hover active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center cursor-pointer"
                  aria-label="GitHub Profile"
                >
                  <GithubIcon />
                </a>
              </Magnetic>
              <Magnetic>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-card-bg text-text-base border-3 border-border-base p-3 shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-hover active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center cursor-pointer"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon />
                </a>
              </Magnetic>
            </div>
          </div>

        </div>

        {/* Right Side: 3D Möbius Ring Viewport (Stylized) OR Photo (Minimal) */}
        {layoutMode === 'minimal' ? (
          <div 
            onMouseMove={handleFrameMouseMove}
            onMouseLeave={handleFrameMouseLeave}
            className="lg:col-span-5 w-full h-[350px] sm:h-[400px] lg:h-[480px] relative z-0 mt-[-25px] lg:mt-0 border border-[#3e4045] flex flex-col overflow-hidden group select-none"
          >
            {/* Minimal Header */}
            <div className="border-b border-[#3e4045] px-3 py-1.5 flex items-center justify-between font-mono text-[9px] uppercase text-[#888c94] bg-[#1a1b1d] transition-colors duration-300">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-white rounded-full inline-block animate-pulse"></span>
                <span>IMAGE_PREVIEW.RAW // USER_OBJECT</span>
              </div>
              <span>MONO_ACTIVE</span>
            </div>

            {/* Hologram Watermark Overlay - Diagonal Repeated Particle Grid */}
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden flex items-center justify-center">
              <div 
                className="w-[150%] h-[150%] flex flex-col justify-center gap-6 transition-transform duration-300 ease-out select-none"
                style={{
                  transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0) rotate(-25deg)`,
                }}
              >
                {Array.from({ length: 6 }).map((_, r) => (
                  <div key={r} className="flex justify-around items-center" style={{ transform: `translateX(${(r % 2 === 0 ? 1 : -1) * 35}px)` }}>
                    {Array.from({ length: 6 }).map((_, c) => (
                      <div 
                        key={c} 
                        className="hologram-watermark font-mono text-[25px] font-extrabold border border-dotted px-3 py-1.5 flex items-center justify-center rounded-sm"
                        style={{
                          color: '#ffffff',
                          borderColor: 'rgba(255, 255, 255, 0.15)',
                        }}
                      >
                        &lt;/&gt;
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Card View */}
            <div className="flex-1 relative w-full h-full flex items-center justify-center p-4 bg-[#161719]">
              <ProfileCard
                name="Nagesh"
                title="Interface Engineer"
                handle="nagesh_vishwakarma"
                status="Online"
                avatarUrl="/heropro.png"
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={true}
                behindGlowEnabled={true}
                behindGlowColor="rgba(255, 255, 255, 0.12)"
                behindGlowSize="35%"
                innerGradient="linear-gradient(145deg, #1f2022 0%, #2e3033 100%)"
              />
            </div>
          </div>
        ) : (
          <div 
            onMouseMove={handleFrameMouseMove}
            onMouseLeave={handleFrameMouseLeave}
            className="lg:col-span-5 w-full h-[350px] sm:h-[400px] lg:h-[480px] relative z-0 mt-[-25px] lg:mt-0 border-3 border-border-base bg-card-bg shadow-brutal flex flex-col transition-all duration-300"
          >
            <div className="border-b-3 border-border-base px-3 py-1.5 bg-card-bg flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] font-black uppercase text-text-base select-none transition-colors duration-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 border border-border-base bg-mint rounded-full inline-block animate-pulse"></span>
                <span>{SHAPE_NAMES[activeShape]}</span>

                {/* SELECT_GEOMETRY drop-down selector */}
                <div className="flex items-center gap-1.5 border-l-2 border-border-base pl-2 ml-1">
                  <span className="opacity-60 text-[8px] tracking-tight">SELECT_GEOMETRY //</span>
                  <select
                    value={activeShape}
                    onChange={(e) => setActiveShape(e.target.value)}
                    className="bg-card-bg text-text-base border border-border-base px-1 py-0.2 font-mono text-[8px] font-black outline-none cursor-pointer"
                  >
                    <option value="MOBIUS">MÖBIUS STRIP</option>
                    <option value="TORUS_KNOT">TORUS KNOT</option>
                    <option value="SPHERE">HYPER-SPHERE</option>
                    <option value="BLACK_HOLE">BLACK HOLE ★</option>
                  </select>
                </div>
              </div>

              {/* Command Toggle Style Shifters — hidden for BLACK_HOLE */}
              <div className="flex items-center gap-2">
                {activeShape !== 'BLACK_HOLE' ? (
                  <div className="flex gap-1">
                    {['WIREFRAME', 'SOLID', 'PARTICLES'].map((style) => (
                      <button
                        key={style}
                        onClick={() => setRenderStyle(style)}
                        className={`px-1.5 py-0.5 border border-border-base text-[9px] font-bold cursor-pointer transition-colors duration-150 ${
                          renderStyle === style 
                            ? 'bg-mint text-black font-black' 
                            : 'bg-card-bg text-text-base hover:bg-border-base/10'
                        }`}
                      >
                        {`[ ${style} ]`}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="px-1.5 py-0.5 border border-border-base text-[9px] font-bold bg-orange-500/20 text-orange-400 animate-pulse">
                    [ SINGULARITY_MODE ]
                  </span>
                )}
                <span className="opacity-75 hidden sm:inline">3D_RENDER: OK</span>
              </div>
            </div>

            {/* Hologram Watermark Overlay - Diagonal Repeated Particle Grid */}
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden flex items-center justify-center">
              <div 
                className="w-[150%] h-[150%] flex flex-col justify-center gap-6 transition-transform duration-300 ease-out select-none"
                style={{
                  transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0) rotate(-25deg)`,
                }}
              >
                {Array.from({ length: 6 }).map((_, r) => (
                  <div key={r} className="flex justify-around items-center" style={{ transform: `translateX(${(r % 2 === 0 ? 1 : -1) * 35}px)` }}>
                    {Array.from({ length: 6 }).map((_, c) => (
                      <div 
                        key={c} 
                        className="hologram-watermark font-mono text-[14px] font-extrabold border border-dotted px-3 py-1.5 flex items-center justify-center rounded-sm"
                        style={{
                          color: 'var(--accent-mint)',
                          borderColor: 'rgba(0, 255, 102, 0.22)',
                        }}
                      >
                        &lt;/&gt;
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div 
              className="flex-1 relative w-full h-full overflow-hidden"
              style={{
                backgroundImage: 'radial-gradient(var(--dot-color) 1.5px, transparent 1.5px)',
                backgroundSize: '16px 16px'
              }}
            >
              <Suspense fallback={
                <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-text-base">
                  LOADING 3D SCENE...
                </div>
              }>
                <div
                  style={{
                    position: 'absolute', inset: 0,
                    filter: activeShape === 'BLACK_HOLE'
                      ? 'drop-shadow(0 0 6px #ff6600) drop-shadow(0 0 18px #ff3300) brightness(1.15)'
                      : 'none',
                    transition: 'filter 0.6s ease',
                  }}
                >
                  <Canvas
                    camera={{ position: [0, 0, 7], fov: 45 }}
                    dpr={[1, 2]}
                    gl={{ antialias: true, alpha: true }}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <ambientLight intensity={theme === 'dark' ? 0.3 : 0.6} />
                    <directionalLight position={[5, 5, 5]} intensity={theme === 'dark' ? 1.0 : 1.5} />
                    <directionalLight position={[-5, -5, -5]} intensity={theme === 'dark' ? 0.2 : 0.4} />
                    {activeShape === 'BLACK_HOLE' ? (
                      <BlackHoleSingularity
                        baseSpeed={baseSpeed}
                        twists={twists}
                        thickness={thickness}
                      />
                    ) : (
                      <MobiusRing
                        baseSpeed={baseSpeed}
                        twists={twists}
                        thickness={thickness}
                        renderStyle={renderStyle}
                        activeColor={activeColor}
                        targetShape={activeShape}
                      />
                    )}
                  </Canvas>
                </div>
              </Suspense>

              {/* Retro Sliders Control Panel */}
              <div className="absolute bottom-0 left-0 right-0 border-t-3 border-border-base bg-card-bg font-mono text-[10px] text-text-base z-20">
                <button 
                  onClick={() => setIsControlsExpanded(!isControlsExpanded)}
                  className="w-full flex items-center justify-between px-3 py-1.5 border-none bg-transparent hover:bg-black/5 dark:hover:bg-white/5 font-bold uppercase cursor-pointer"
                >
                  <span>[ CONTROL_PANEL ]</span>
                  <span>{isControlsExpanded ? '[-] CLOSE' : '[+] OPEN'}</span>
                </button>
                {isControlsExpanded && (
                  <div className="p-3 border-t-3 border-border-base flex flex-col gap-2.5 bg-card-bg select-none">
                    
                    {/* Retro Color Swatches Paint Selector at bottom */}
                    <div className="flex flex-col gap-1 border-b border-border-base/15 pb-2.5 mb-0.5">
                      <span className="font-bold text-[8px] opacity-60">SELECT_COLOR //</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {(layoutMode === 'minimal'
                           ? ['#ffffff', '#d4d4d8', '#a1a1aa', '#71717a']
                           : ['#00FF66', '#00F0FF', '#FF007F', '#FFE600']
                        ).map((color) => {
                          const isActive = activeColor === color;
                          return (
                            <button
                              key={color}
                              onClick={() => setActiveColor(color)}
                              title={color}
                              className={`w-4 h-4 border-2 border-border-base cursor-pointer transition-all duration-100 ${
                                isActive 
                                  ? 'translate-x-[2px] translate-y-[2px] shadow-none' 
                                  : 'shadow-[2px_2px_0px_0px_var(--border-color)] hover:translate-y-[-0.5px]'
                              }`}
                              style={{
                                backgroundColor: isActive ? invertColor(color) : color
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                    {/* Base Speed Slider */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between font-bold">
                        <span>{activeShape === 'BLACK_HOLE' ? 'ROTATION SPEED' : 'BASE SPEED'}</span>
                        <span>{baseSpeed.toFixed(1)}X</span>
                      </div>
                      <input 
                        type="range"
                        min="0.1"
                        max="3.0"
                        step="0.1"
                        value={baseSpeed}
                        onChange={(e) => setBaseSpeed(parseFloat(e.target.value))}
                        className="neo-slider"
                      />
                    </div>
                    {/* Geometry Twists / Space Warp Slider */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between font-bold">
                        <span>{activeShape === 'BLACK_HOLE' ? 'SPACE WARP' : 'GEOMETRY TWISTS'}</span>
                        <span>{activeShape === 'BLACK_HOLE' ? `${(twists * 0.9).toFixed(1)}x` : twists}</span>
                      </div>
                      <input 
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={twists}
                        onChange={(e) => setTwists(parseInt(e.target.value))}
                        className="neo-slider"
                      />
                    </div>
                    {/* Thickness / Disk Height Slider */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between font-bold">
                        <span>{activeShape === 'BLACK_HOLE' ? 'DISK HEIGHT' : 'THICKNESS'}</span>
                        <span>{thickness.toFixed(2)}</span>
                      </div>
                      <input 
                        type="range"
                        min="0.2"
                        max="1.2"
                        step="0.05"
                        value={thickness}
                        onChange={(e) => setThickness(parseFloat(e.target.value))}
                        className="neo-slider"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Infinite Scroll Ticker Banner */}
      {layoutMode !== 'minimal' && (
        <div className="mt-8">
          <Marquee items={marqueeItems} />
        </div>
      )}

    </div>
  );
}

