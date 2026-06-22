# Nagesh Vishwakarma — Neo-Brutalist 3D Portfolio

A premium, high-performance, raw single-page developer portfolio built with **React 19**, **Three.js (React Three Fiber)**, and **Tailwind CSS v4**. 

This interface is styled with a retro, high-contrast Neo-Brutalist design system featuring interactive OS window containers, custom mouse tracking coordinate tracers, and a real-time 3D Shape-Shifter viewport.

---

## 🚀 Key Features

### 1. 3D Shape-Shifter Canvas (`SHAPE_SHIFTER //`)
An interactive WebGL viewport rendering multiple complex mathematical structures:
*   **Möbius Strip**: A custom-computed twisted parametric ribbon loop.
*   **Torus Knot**: An interwoven infinite puzzle loop using a customized high-density `TorusKnotGeometry`.
*   **Hyper-Sphere Grid**: A coordinate point matrix that wavelike pulsates along its vertex normal vectors dynamically over time.

### 2. Smooth Scale-Down/Up Transition State Machine
When switching shapes via the header dropdown selector, the geometry performs a smooth shrink-down to zero before swapping and scaling the new geometry back up, preventing sudden layout pops.

### 3. Tactile Pressed Color Swatches Drawer
Docked in the bottom collapsible settings panel is a retro paint swatch selector featuring:
*   **Electric Mint** (`#00FF66`)
*   **Cyber Cyan** (`#00F0FF`)
*   **Toxic Purple / Magenta** (`#FF007F`)
*   **Canary Yellow** (`#FFE600`)
Selecting a swatch immediately overrides the color of the active Solid, Wireframe, or Particle material. The active color swatch performs a 2px offset translate (down and right) and inverts its complement color using XOR math.

### 4. Interactive Physics Mouse-Pluck Distortion
Unprojects the 2D cursor coordinates onto the $Z=0$ 3D plane and transforms it into the mesh's local space. Vertices within an influence radius are pushed away from the pointer using a smooth quadratic fall-off, creating a live tactile bubble effect.

### 5. Click-to-Shatter Particle Burst
Clicking on the active geometry triggers a satisfying explosion where vertices explode outward along their normal vectors, scaled by deterministic per-vertex index noise. Over 1.2 seconds, the fragments cleanly reverse direction and magnetically snap back into the unbroken shape.

### 6. Kinetic Scroll Velocity Booster
Attaches passive wheel and scroll event listeners. Scrolling through the portfolio captures page velocity and multiplies the spin speed of the active 3D geometry. Once scrolling stops, the speed decays smoothly back to the custom Base Speed setting.

### 7. Vector Coordinate Tracker
Displays a screen mouse position tracer in retro coordinate notation (`COORD_TRACER // X: 0000 | Y: 0000`) following the cursor with a brutalist frame.

---

## 🛠️ Technology Stack

*   **Core**: React 19, JavaScript (ES6+), HTML5
*   **Styling**: Tailwind CSS v4, Custom HSL Hues (Neon Accent tokens)
*   **3D WebGL Engine**: Three.js, `@react-three/fiber` (R3F) 9, `@react-three/drei` 10
*   **Interactions & Physics**: GSAP, Framer Motion, custom CPU vertex matrix displacement math
*   **Development & Build Tooling**: Vite 8, ESLint, Lucide React Icons

---

## ⚙️ Setup & Commands

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### Local Development Server
Launch the development server on your local machine:
```bash
npm run dev
```

### Build Production Bundle
Compile and bundle optimized static assets for hosting:
```bash
npm run build
```

### Run Code Linter
Verify that all source files fully satisfy strict formatting and ESLint rules:
```bash
npm run lint
```
