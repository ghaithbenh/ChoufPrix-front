import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const HeroScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 6;
    camera.position.y = 1;

    // Renderer setup
    const size = 300;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Materials
    const baseMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x2563eb,
      metalness: 0.1,
      roughness: 0.5,
      flatShading: true,
    });
    
    const darkMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x374151,
      metalness: 0.5,
      roughness: 0.2,
      flatShading: true,
    });

    const screenMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf97316,
      emissive: 0xf97316,
      emissiveIntensity: 0.8,
      metalness: 0.1,
      roughness: 0.2,
    });
    
    // For cleanup
    const geometries: THREE.BufferGeometry[] = [];

    const createMesh = (geometry: THREE.BufferGeometry, material: THREE.Material) => {
        const mesh = new THREE.Mesh(geometry, material);
        geometries.push(geometry);
        return mesh;
    };

    // --- LAPTOP ---
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(-1.2, -0.8, 1);
    laptopGroup.rotation.y = Math.PI / 5;

    // Base
    const laptopBaseGeom = new THREE.BoxGeometry(1.6, 0.05, 1.2);
    laptopGroup.add(createMesh(laptopBaseGeom, baseMaterial));

    // Screen
    const laptopScreenGeom = new THREE.BoxGeometry(1.6, 1.1, 0.05);
    const laptopScreen = createMesh(laptopScreenGeom, darkMaterial);
    laptopScreen.position.set(0, 0.55, -0.55);
    laptopScreen.rotation.x = -0.15;
    
    // Display
    const laptopDisplayGeom = new THREE.PlaneGeometry(1.5, 0.9);
    const laptopDisplay = createMesh(laptopDisplayGeom, screenMaterial);
    laptopDisplay.position.set(0, 0, 0.03);
    laptopScreen.add(laptopDisplay);
    
    laptopGroup.add(laptopScreen);
    group.add(laptopGroup);

    // --- PC SETUP ---
    const pcGroup = new THREE.Group();
    pcGroup.position.set(0.8, -0.2, -0.5);
    pcGroup.rotation.y = -Math.PI / 8;

    // Monitor Stand Base
    const standBaseGeom = new THREE.BoxGeometry(0.8, 0.05, 0.6);
    const standBase = createMesh(standBaseGeom, baseMaterial);
    standBase.position.set(0, -0.8, 0);
    pcGroup.add(standBase);

    // Monitor Stand Neck
    const standNeckGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.6);
    const standNeck = createMesh(standNeckGeom, baseMaterial);
    standNeck.position.set(0, -0.5, 0);
    pcGroup.add(standNeck);

    // Monitor
    const monitorGeom = new THREE.BoxGeometry(2.4, 1.4, 0.1);
    const monitor = createMesh(monitorGeom, darkMaterial);
    monitor.position.set(0, 0, 0);
    
    // Monitor Display
    const monitorDisplayGeom = new THREE.PlaneGeometry(2.3, 1.2);
    const monitorDisplay = createMesh(monitorDisplayGeom, screenMaterial);
    monitorDisplay.position.set(0, 0, 0.06);
    monitor.add(monitorDisplay);

    pcGroup.add(monitor);

    // PC Tower
    const towerGeom = new THREE.BoxGeometry(0.8, 2.0, 1.8);
    const tower = createMesh(towerGeom, baseMaterial);
    tower.position.set(1.8, -0.3, -0.5);
    pcGroup.add(tower);

    group.add(pcGroup);

    // Center and scale group
    group.position.y = 0.2;
    group.scale.set(0.8, 0.8, 0.8);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;

    const onDocumentMouseMove = (event: MouseEvent) => {
      // Normalize mouse coordinates to -1 to 1 based on window
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    document.addEventListener('mousemove', onDocumentMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Base passive floating/rotation
      const time = Date.now() * 0.001;
      group.position.y = -0.2 + Math.sin(time) * 0.1;
      
      // Mouse interactive rotation
      const targetRotationX = mouseY * 0.2;
      const targetRotationY = mouseX * 0.2;

      group.rotation.x += 0.05 * (targetRotationX - group.rotation.x);
      group.rotation.y += 0.05 * (targetRotationY - group.rotation.y);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      document.removeEventListener('mousemove', onDocumentMouseMove);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometries.forEach(g => g.dispose());
      baseMaterial.dispose();
      darkMaterial.dispose();
      screenMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-[300px] h-[300px] flex items-center justify-center filter drop-shadow-2xl hover:scale-105 transition-transform duration-700" 
    />
  );
};

export default HeroScene;
