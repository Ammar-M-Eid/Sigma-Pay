import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type SceneKind = 'overview' | 'budgets' | 'goals' | 'groups' | 'payments' | 'reports' | 'notifications' | 'profile';

const palette = {
  deep: new THREE.MeshStandardMaterial({ color: '#173b3b', metalness: 0.62, roughness: 0.28 }),
  mint: new THREE.MeshStandardMaterial({ color: '#72bda8', metalness: 0.42, roughness: 0.32 }),
  brass: new THREE.MeshStandardMaterial({ color: '#d4a95f', metalness: 0.74, roughness: 0.24 }),
  paper: new THREE.MeshStandardMaterial({ color: '#edf2e9', metalness: 0.12, roughness: 0.62 }),
};

function makeObject(kind: SceneKind): THREE.Group {
  const group = new THREE.Group();
  const add = (geometry: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };

  if (kind === 'overview') {
    const coinMaterial = new THREE.MeshStandardMaterial({ color: '#d6ad5c', metalness: 0.7, roughness: 0.3 });
    const edgeMaterial = new THREE.MeshStandardMaterial({ color: '#855d22', metalness: 0.78, roughness: 0.28 });
    // A readable stack of coins, presented face-on so it is immediately understood as money.
    for (let index = 0; index < 4; index += 1) {
      const y = -0.67 + index * 0.18;
      const coin = add(new THREE.CylinderGeometry(0.72, 0.72, 0.15, 64), index % 2 ? coinMaterial : edgeMaterial, -0.12, y, 0);
      coin.rotation.x = Math.PI / 2;
      add(new THREE.TorusGeometry(0.59, 0.025, 10, 64), palette.paper, -0.12, y, 0.085);
    }
    const face = add(new THREE.CylinderGeometry(0.68, 0.68, 0.08, 64), coinMaterial, -0.12, 0.13, 0.12);
    face.rotation.x = Math.PI / 2;
    add(new THREE.TorusGeometry(0.53, 0.026, 10, 64), palette.paper, -0.12, 0.13, 0.18);
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#fff5d8';
      context.font = '700 86px Segoe UI, sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('$', 64, 67);
    }
    const texture = new THREE.CanvasTexture(canvas);
    const currency = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
    currency.position.set(-0.12, 0.13, 0.22);
    currency.scale.set(0.72, 0.72, 1);
    group.add(currency);
    // A small rising bar graph reinforces the money-management context without competing with the coin.
    [0.46, 0.72, 0.96].forEach((height, index) => {
      const bar = add(new THREE.BoxGeometry(0.16, height, 0.15), index === 2 ? palette.mint : palette.paper, 0.7 + index * 0.19, -0.75 + height / 2, -0.18);
      bar.rotation.z = -0.12;
    });
    add(new THREE.BoxGeometry(0.76, 0.025, 0.18), palette.brass, 0.89, -0.77, -0.17);
  } else if (kind === 'budgets' || kind === 'reports') {
    const heights = kind === 'budgets' ? [0.72, 1.1, 0.54, 1.42, 0.94] : [0.56, 1.22, 0.82, 1.5, 1.04];
    heights.forEach((height, index) => add(new THREE.BoxGeometry(0.3, height, 0.34), index === 3 ? palette.brass : (index % 2 ? palette.mint : palette.deep), (index - 2) * 0.42, height / 2 - 0.55, 0));
    add(new THREE.BoxGeometry(2.35, 0.045, 0.58), palette.paper, 0, -0.62, 0);
  } else if (kind === 'goals') {
    const targetBase = add(new THREE.CylinderGeometry(0.86, 0.86, 0.1, 64), palette.deep, 0, 0, -0.08);
    targetBase.rotation.x = Math.PI / 2;
    add(new THREE.TorusGeometry(0.67, 0.055, 16, 72), palette.paper);
    add(new THREE.TorusGeometry(0.4, 0.045, 16, 72), palette.brass);
    add(new THREE.SphereGeometry(0.15, 32, 24), palette.mint, 0, 0, 0.08);
    [[0.92, 0.28, 0], [-0.7, -0.58, 0.3], [0.16, 1.04, -0.12]].forEach(([x, y, z], i) => add(new THREE.SphereGeometry(0.1, 20, 16), i === 1 ? palette.brass : palette.paper, x, y, z));
  } else if (kind === 'groups') {
    const nodes = [[0, 0.8], [0.78, 0.24], [0.48, -0.68], [-0.48, -0.68], [-0.78, 0.24]];
    nodes.forEach(([x, y], index) => add(new THREE.SphereGeometry(index === 0 ? 0.19 : 0.13, 24, 18), index === 0 ? palette.brass : palette.mint, x, y, 0));
    const points = nodes.map(([x, y]) => new THREE.Vector3(x, y, 0));
    const loop = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: '#a9c7bb' }));
    group.add(loop);
  } else if (kind === 'payments') {
    const card = add(new THREE.BoxGeometry(2.05, 1.25, 0.08), palette.deep);
    card.rotation.set(0.16, -0.28, -0.1);
    const band = add(new THREE.BoxGeometry(2.05, 0.2, 0.018), palette.brass, 0, 0.26, 0.055);
    band.rotation.copy(card.rotation);
    const chip = add(new THREE.BoxGeometry(0.31, 0.22, 0.02), palette.paper, -0.62, -0.18, 0.068);
    chip.rotation.copy(card.rotation);
    const cardEdge = add(new THREE.BoxGeometry(1.35, 0.035, 0.018), palette.brass, 0.28, -0.2, 0.07);
    cardEdge.rotation.copy(card.rotation);
  } else if (kind === 'notifications') {
    add(new THREE.SphereGeometry(0.7, 32, 24), palette.deep);
    add(new THREE.TorusGeometry(0.95, 0.035, 10, 72), palette.brass).rotation.x = 0.7;
    add(new THREE.SphereGeometry(0.12, 20, 16), palette.mint, 0.88, 0.48, 0.05);
  } else {
    add(new THREE.SphereGeometry(0.67, 40, 30), palette.paper);
    add(new THREE.TorusGeometry(0.98, 0.045, 12, 80), palette.mint).rotation.x = 0.88;
    add(new THREE.SphereGeometry(0.2, 24, 18), palette.brass, 0, 0, 0.64);
  }

  if (kind === 'overview') group.scale.setScalar(0.84);
    group.rotation.set(-0.02, 0.02, 0.015);
  return group;
}

interface FinancialSceneProps {
  kind: SceneKind;
  title: string;
  description: string;
}

const FinancialScene: React.FC<FinancialSceneProps> = ({ kind, title, description }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch (_error) {
      setFailed(true);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 30);
    camera.position.set(0, 0, 4.65);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    scene.add(new THREE.HemisphereLight('#f8f4e9', '#526c67', 2.15));
    const key = new THREE.DirectionalLight('#fff2d9', 3.4);
    key.position.set(-3, 4, 5);
    scene.add(key);
    const object = makeObject(kind);
    scene.add(object);

    const resize = () => {
      const width = canvas.clientWidth || 1;
      const height = canvas.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    let animation = 0;
    const render = () => {
      if (motionEnabled) {
        object.rotation.y += 0.00045;
        object.position.y = Math.sin(performance.now() * 0.00055) * 0.025;
      }
      renderer.render(scene, camera);
      animation = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animation);
      observer.disconnect();
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) child.geometry.dispose();
        if (child instanceof THREE.Mesh && Array.isArray(child.material)) child.material.forEach((material) => material.dispose());
      });
      renderer.dispose();
    };
  }, [kind, motionEnabled]);

  return (
    <section className="scene-panel" aria-label={title}>
      <div className="scene-copy">
        <span className="eyebrow">SIGMAPAY / {kind.toUpperCase()}</span>
        <h2>{title}</h2>
        <p>{description}</p>
        <button className="motion-control" type="button" onClick={() => setMotionEnabled((value) => !value)}>
          {motionEnabled ? 'Pause visual motion' : 'Resume visual motion'}
        </button>
      </div>
      {!failed ? (
        <canvas ref={canvasRef} className="scene-canvas" aria-hidden="true" />
      ) : (
        <div className={`scene-fallback scene-fallback-${kind}`} role="img" aria-label={`${title} illustration`}>
          <span className="fallback-core" />
          <span className="fallback-orbit fallback-orbit-one" />
          <span className="fallback-orbit fallback-orbit-two" />
        </div>
      )}
    </section>
  );
};

export default FinancialScene;
