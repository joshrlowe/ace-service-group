"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Create rounded rectangle shape
function createRoundedRectShape(width: number, height: number, radius: number) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;

  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  return shape;
}

// Helper for rounded rectangle on canvas
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Draw icons
function drawIcon(
  ctx: CanvasRenderingContext2D,
  iconType: string,
  scale: number = 1,
) {
  switch (iconType) {
    case "hardhat":
      ctx.fillStyle = "#ffffff";

      // Dome
      ctx.beginPath();
      ctx.ellipse(0, -8, 70 * scale, 50 * scale, 0, Math.PI, 0);
      ctx.fill();

      // Vertical ridges
      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 3 * scale;

      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        const xOffset = i * 18 * scale;
        ctx.moveTo(xOffset, -3);
        ctx.quadraticCurveTo(xOffset, -33 * scale, xOffset * 0.7, -53 * scale);
        ctx.stroke();
      }

      ctx.strokeStyle = "#ffffff";

      // Brim
      ctx.fillStyle = "#ffffff";
      ctx.lineWidth = 22 * scale;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(
        0,
        18,
        85 * scale,
        30 * scale,
        0,
        0.1 * Math.PI,
        0.9 * Math.PI,
      );
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, 18, 85 * scale, 30 * scale, 0, 0, Math.PI);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#ffffff";
      break;

    case "pipewrench":
      ctx.fillStyle = "#ffffff";

      // Upper jaw
      ctx.beginPath();
      ctx.moveTo(-25 * scale, -95 * scale);
      ctx.lineTo(25 * scale, -95 * scale);
      ctx.lineTo(35 * scale, -50 * scale);
      ctx.lineTo(-15 * scale, -50 * scale);
      ctx.closePath();
      ctx.fill();

      // Lower jaw
      ctx.beginPath();
      ctx.moveTo(-15 * scale, -55 * scale);
      ctx.lineTo(40 * scale, -55 * scale);
      ctx.lineTo(45 * scale, -25 * scale);
      ctx.lineTo(-10 * scale, -25 * scale);
      ctx.closePath();
      ctx.fill();

      // Jaw opening gap
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath();
      ctx.moveTo(0, -92 * scale);
      ctx.lineTo(18 * scale, -92 * scale);
      ctx.lineTo(22 * scale, -58 * scale);
      ctx.lineTo(4 * scale, -58 * scale);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ffffff";

      // Adjustment knob
      ctx.beginPath();
      ctx.arc(38 * scale, -40 * scale, 12 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Handle body
      ctx.fillRect(-14 * scale, -28 * scale, 28 * scale, 125 * scale);

      // Grip texture
      ctx.fillStyle = "#1a1a1a";
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(-11 * scale, (10 + i * 18) * scale, 22 * scale, 7 * scale);
      }
      ctx.fillStyle = "#ffffff";

      // Handle bottom
      ctx.beginPath();
      ctx.arc(0, 97 * scale, 14 * scale, 0, Math.PI);
      ctx.fill();
      break;

    case "snowflake":
      ctx.lineWidth = 11 * scale;
      ctx.lineCap = "round";

      for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate((Math.PI / 3) * i);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -80 * scale);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -40 * scale);
        ctx.lineTo(-22 * scale, -58 * scale);
        ctx.moveTo(0, -40 * scale);
        ctx.lineTo(22 * scale, -58 * scale);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -65 * scale);
        ctx.lineTo(-16 * scale, -80 * scale);
        ctx.moveTo(0, -65 * scale);
        ctx.lineTo(16 * scale, -80 * scale);
        ctx.stroke();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(0, 0, 8 * scale, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "lightning":
      // Classic lightning bolt - thick and natural
      ctx.beginPath();
      ctx.moveTo(40 * scale, -100 * scale); // Top point
      ctx.lineTo(-30 * scale, -5 * scale); // Zag down to middle-left
      ctx.lineTo(25 * scale, -5 * scale); // Horizontal jut right
      ctx.lineTo(-50 * scale, 100 * scale); // Down to bottom point
      ctx.lineTo(5 * scale, 5 * scale); // Back up to middle-right
      ctx.lineTo(-45 * scale, 5 * scale); // Horizontal jut left
      ctx.closePath();
      ctx.fill();
      break;
  }
}

// Create card face texture
function createCardFaceTexture(
  suit: string,
  iconType: string,
  renderer: THREE.WebGLRenderer,
  scale: number = 1,
) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 700;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#000000"; // Changed from #1a1a1a to black
  roundRect(ctx, 0, 0, canvas.width, canvas.height, 30);
  ctx.fill();

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 12;
  roundRect(ctx, 8, 8, canvas.width - 16, canvas.height - 16, 25);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";

  ctx.font = `bold ${85 * scale}px Georgia, serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("A", 35, 25);

  ctx.font = `${70 * scale}px Arial`;
  ctx.fillText(suit, 35, 105);

  ctx.save();
  ctx.translate(canvas.width - 35, canvas.height - 25);
  ctx.rotate(Math.PI);
  ctx.font = `bold ${85 * scale}px Georgia, serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("A", 0, 0);
  ctx.font = `${70 * scale}px Arial`;
  ctx.fillText(suit, 0, 80);
  ctx.restore();

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#ffffff";
  drawIcon(ctx, iconType, scale);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

// Create card mesh
function createCard(
  suit: string,
  iconType: string,
  renderer: THREE.WebGLRenderer,
  scale: number = 1,
) {
  const cardWidth = 1.1 * scale;
  const cardHeight = 1.5 * scale;
  const cardDepth = 0.025 * scale;
  const cornerRadius = 0.08 * scale;

  const group = new THREE.Group();

  const faceTexture = createCardFaceTexture(suit, iconType, renderer, scale);
  const faceMaterial = new THREE.MeshBasicMaterial({
    map: faceTexture,
    side: THREE.FrontSide,
  });

  const faceGeometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
  const faceMesh = new THREE.Mesh(faceGeometry, faceMaterial);
  faceMesh.position.z = cardDepth / 2 + 0.001;
  group.add(faceMesh);

  const backMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.8,
  });
  const backGeometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
  const backMesh = new THREE.Mesh(backGeometry, backMaterial);
  backMesh.position.z = -cardDepth / 2 - 0.001;
  backMesh.rotation.y = Math.PI;
  group.add(backMesh);

  const edgeShape = createRoundedRectShape(
    cardWidth + 0.04 * scale,
    cardHeight + 0.04 * scale,
    cornerRadius,
  );
  const edgeGeometry = new THREE.ExtrudeGeometry(edgeShape, {
    depth: cardDepth,
    bevelEnabled: false,
  });
  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5,
  });
  const edgeMesh = new THREE.Mesh(edgeGeometry, edgeMaterial);
  edgeMesh.position.z = -cardDepth / 2;
  group.add(edgeMesh);

  return group;
}

interface LogoSceneProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function LogoScene({ containerRef }: LogoSceneProps) {
  const { gl, camera, scene } = useThree();
  const logoGroupRef = useRef<THREE.Group>(null);

  // Debounce helper to prevent rapid resize events
  const debounce = (func: () => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  };

  // Disable AudioListener to prevent AirPods/audio device switching
  // React Three Fiber creates an AudioListener by default, which causes
  // macOS/iOS to switch audio output devices even when no audio is playing
  useEffect(() => {
    // Remove the AudioListener to prevent audio device switching
    // React Three Fiber adds listener property dynamically, so we need to check for it
    const sceneWithListener = scene as THREE.Scene & {
      listener?: THREE.AudioListener;
    };
    if (sceneWithListener.listener) {
      try {
        const listener = sceneWithListener.listener;
        if (listener.context && listener.context.state !== "closed") {
          listener.context.close().catch(() => {
            // Ignore errors if context is already closed
          });
        }
      } catch {
        // Ignore errors
      }
      // Remove listener reference to prevent it from being used
      delete sceneWithListener.listener;
    }
  }, [scene]);
  const cardsRef = useRef<
    Array<{
      mesh: THREE.Group;
      targetX: number;
      targetY: number;
      targetRotation: number;
      zOffset: number;
    }>
  >([]);
  const isDraggingRef = useRef(false);
  const prevXRef = useRef(0);
  const prevYRef = useRef(0);
  const velXRef = useRef(0);
  const velYRef = useRef(0);
  const targetRotXRef = useRef(0);
  const targetRotYRef = useRef(0);
  const introProgressRef = useRef(0);
  const timeRef = useRef(0);
  const initializedRef = useRef(false);
  const scaleRef = useRef(1);

  // Determine scale based on screen size
  useEffect(() => {
    const updateScale = () => {
      const isMobile = window.innerWidth < 768;
      scaleRef.current = isMobile ? 0.7 : 1.4; // Mobile: 0.7x, Desktop: 1.4x
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Initialize scene
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const isMobile = window.innerWidth < 768;
    const scale = isMobile ? 0.7 : 1.4;
    scaleRef.current = scale;

    // Set background to transparent
    scene.background = null;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 0.4);
    frontLight.position.set(0, 0, 10);
    scene.add(frontLight);

    // Main group - raised to align with header text
    const logoGroup = new THREE.Group();
    logoGroup.position.y = 2.2 * scale; // Raised further to align better with header
    scene.add(logoGroup);
    logoGroupRef.current = logoGroup;

    // Card configuration
    const pivotPoint = { x: 0, y: -3.5 * scale };
    const cardDistance = isMobile ? 1.8 : 2.8; // Closer on mobile, further on desktop

    const cardConfigs = [
      { suit: "♠", icon: "hardhat", angle: 120, zOffset: 0.0 },
      { suit: "♣", icon: "pipewrench", angle: 100, zOffset: 0.06 },
      { suit: "♥", icon: "snowflake", angle: 80, zOffset: 0.12 },
      { suit: "♦", icon: "lightning", angle: 60, zOffset: 0.18 },
    ];

    const cards: Array<{
      mesh: THREE.Group;
      targetX: number;
      targetY: number;
      targetRotation: number;
      zOffset: number;
    }> = [];

    cardConfigs.forEach((config) => {
      const card = createCard(config.suit, config.icon, gl, scale);

      const angleRad = THREE.MathUtils.degToRad(config.angle);
      const finalX = pivotPoint.x + cardDistance * Math.cos(angleRad);
      const finalY = pivotPoint.y + cardDistance * Math.sin(angleRad);
      const finalRotation = config.angle - 90;

      card.position.set(0, -4 * scale, config.zOffset * scale);

      cards.push({
        mesh: card,
        targetX: finalX,
        targetY: finalY,
        targetRotation: finalRotation,
        zOffset: config.zOffset * scale,
      });

      logoGroup.add(card);
    });

    cardsRef.current = cards;

    // Interaction handlers
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevXRef.current = e.clientX;
      prevYRef.current = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const dx = e.clientX - prevXRef.current;
        const dy = e.clientY - prevYRef.current;
        targetRotYRef.current += dx * 0.005;
        targetRotXRef.current += dy * 0.005;
        targetRotXRef.current = Math.max(
          -0.5,
          Math.min(0.5, targetRotXRef.current),
        );
        velXRef.current = dy * 0.002;
        velYRef.current = dx * 0.002;
        prevXRef.current = e.clientX;
        prevYRef.current = e.clientY;
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      isDraggingRef.current = true;
      prevXRef.current = e.touches[0].clientX;
      prevYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingRef.current) {
        const dx = e.touches[0].clientX - prevXRef.current;
        const dy = e.touches[0].clientY - prevYRef.current;
        targetRotYRef.current += dx * 0.005;
        targetRotXRef.current += dy * 0.005;
        targetRotXRef.current = Math.max(
          -0.5,
          Math.min(0.5, targetRotXRef.current),
        );
        velXRef.current = dy * 0.002;
        velYRef.current = dx * 0.002;
        prevXRef.current = e.touches[0].clientX;
        prevYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      camera.position.z += e.deltaY * 0.003;
      camera.position.z = Math.max(3, Math.min(12, camera.position.z));
    };

    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;

      // Use container dimensions instead of window dimensions
      // This prevents issues when mobile address bar shows/hides during scroll
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Only update aspect for PerspectiveCamera (OrthographicCamera doesn't have aspect)
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
      gl.setSize(width, height, false); // false = don't update CSS, prevents layout shifts
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousedown", handleMouseDown);
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseup", handleMouseUp);
      container.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      container.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });
      container.addEventListener("touchend", handleTouchEnd);
      container.addEventListener("wheel", handleWheel, { passive: true });
    }

    // Debounce resize handler to prevent rapid updates on mobile scroll
    const debouncedResize = debounce(handleResize, 150);
    window.addEventListener("resize", debouncedResize);

    return () => {
      if (container) {
        container.removeEventListener("mousedown", handleMouseDown);
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseup", handleMouseUp);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
        container.removeEventListener("wheel", handleWheel);
      }
      window.removeEventListener("resize", debouncedResize);
    };
  }, [gl, camera, scene, containerRef]);

  // Animation
  useFrame((state, delta) => {
    const logoGroup = logoGroupRef.current;
    if (!logoGroup) return;

    timeRef.current += delta;
    introProgressRef.current = Math.min(
      1,
      introProgressRef.current + delta / 1.8,
    );

    function easeOutBack(x: number) {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }

    cardsRef.current.forEach((cardData, index) => {
      const delay = index * 0.12;
      const progress = Math.max(
        0,
        Math.min(1, (introProgressRef.current - delay) / 0.5),
      );
      const eased = easeOutBack(progress);

      const startY = -4 * scaleRef.current;
      const startX = 0;

      // Only animate if intro is not complete
      if (introProgressRef.current < 1) {
        cardData.mesh.position.x = startX + (cardData.targetX - startX) * eased;
        cardData.mesh.position.y = startY + (cardData.targetY - startY) * eased;
        cardData.mesh.rotation.z = THREE.MathUtils.degToRad(
          cardData.targetRotation * eased,
        );
      } else {
        // After intro, maintain target position with smooth floating
        const floatOffset =
          Math.sin(timeRef.current * 1.2 + index * 0.7) * 0.008;
        // Smoothly interpolate to target position if not already there
        cardData.mesh.position.x +=
          (cardData.targetX - cardData.mesh.position.x) * 0.1;
        cardData.mesh.position.y = cardData.targetY + floatOffset;
        cardData.mesh.rotation.z +=
          (THREE.MathUtils.degToRad(cardData.targetRotation) -
            cardData.mesh.rotation.z) *
          0.1;
      }
    });

    if (!isDraggingRef.current) {
      velXRef.current *= 0.95;
      velYRef.current *= 0.95;
      targetRotYRef.current += velYRef.current;
      targetRotXRef.current += velXRef.current;

      // Add slow auto-rotation after intro completes
      if (introProgressRef.current >= 1) {
        targetRotYRef.current += delta * 0.1; // Slow rotation: 0.1 radians per second
      }
    }

    logoGroup.rotation.y +=
      (targetRotYRef.current - logoGroup.rotation.y) * 0.08;
    logoGroup.rotation.x +=
      (targetRotXRef.current - logoGroup.rotation.x) * 0.08;
  });

  return null;
}

interface Logo3DProps {
  className?: string;
}

export function Logo3D({ className = "" }: Logo3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
      >
        <LogoScene containerRef={containerRef} />
      </Canvas>
    </div>
  );
}
