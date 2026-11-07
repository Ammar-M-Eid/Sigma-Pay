import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type SceneKind = 'overview' | 'budgets' | 'goals' | 'groups' | 'payments' | 'reports' | 'notifications' | 'profile';

const colors = {
  ink: '#0b2338',
  blue: '#4d8cd5',
  sky: '#a8d7ea',
  emerald: '#36bd94',
  citrus: '#d9f27d',
  amber: '#efb466',
  paper: '#f8fbff',
};

function buildFlowDiagram(kind: SceneKind): THREE.Group {
  const diagram = new THREE.Group();
  const material = (color: string, metalness = 0.22, roughness = 0.36) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
  const navy = material(colors.ink, 0.42, 0.28);
  const mint = material(colors.emerald, 0.32, 0.24);
  const blue = material(colors.blue, 0.38, 0.26);
  const pale = material(colors.paper, 0.16, 0.34);
  const citrus = material(colors.citrus, 0.35, 0.23);
  const amber = material(colors.amber, 0.32, 0.28);
  const addMesh = (geometry: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) => {
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    diagram.add(mesh);
    return mesh;
  };

  // A floating ledger plane gives the diagram a clear base instead of a decorative coin.
  const plane = addMesh(new THREE.BoxGeometry(3.45, 0.12, 2.28), navy, 0, -0.72, -0.12);
  plane.rotation.x = -0.12;
  addMesh(new THREE.BoxGeometry(3.02, 0.025, 1.82), pale, 0, -0.645, -0.1);

  // The central account hub routes into three recognisable money tasks.
  const hub = new THREE.Group();
  hub.position.set(0, 0.02, 0.25);
  diagram.add(hub);
  const hubBase = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.64, 0.16), navy);
  hubBase.castShadow = true;
  hubBase.position.y = 0.02;
  hubBase.rotation.y = -0.12;
  hub.add(hubBase);
  const accountMark = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.07), mint);
  accountMark.position.set(-0.23, 0.12, 0.105);
  accountMark.rotation.z = Math.PI / 4;
  hub.add(accountMark);
  const chartPoints = [
    new THREE.Vector3(-0.24, -0.12, 0.11),
    new THREE.Vector3(-0.11, -0.04, 0.12),
    new THREE.Vector3(0.02, -0.08, 0.12),
    new THREE.Vector3(0.15, 0.06, 0.12),
    new THREE.Vector3(0.27, 0.16, 0.12),
  ];
  const accountChart = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(chartPoints), 20, 0.018, 8, false), citrus);
  hub.add(accountChart);
  chartPoints.forEach((point, index) => {
    const marker = new THREE.Mesh(new THREE.SphereGeometry(index === chartPoints.length - 1 ? 0.035 : 0.025, 12, 10), index === chartPoints.length - 1 ? mint : pale);
    marker.position.copy(point);
    hub.add(marker);
  });
  const cardHighlight = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.018, 0.025), pale);
  cardHighlight.position.set(-0.23, -0.11, 0.112);
  hub.add(cardHighlight);

  const nodes = [
    { p: new THREE.Vector3(-1.12, 0.42, 0.42), color: mint, kind: 'budget' },
    { p: new THREE.Vector3(0.08, 0.82, -0.36), color: citrus, kind: 'goal' },
    { p: new THREE.Vector3(1.16, 0.38, 0.33), color: amber, kind: 'bill' },
  ];
  nodes.forEach(({ p, color, kind }, index) => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.14, 0.24),
      new THREE.Vector3(p.x * 0.46, 0.54 + (index === 1 ? 0.15 : 0), p.z + 0.1),
      p,
    ]);
    const lane = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 0.027, 8, false), color);
    lane.castShadow = true;
    diagram.add(lane);
    const plinth = addMesh(new THREE.BoxGeometry(0.62, 0.12, 0.6), blue, p.x, -0.53, p.z);
    plinth.rotation.y = index * 0.14;
    if (kind === 'budget') {
      [0.3, 0.43, 0.58].forEach((height, barIndex) => {
        const bar = addMesh(new THREE.BoxGeometry(0.095, height, 0.12), barIndex === 2 ? mint : pale, p.x + (barIndex - 1) * 0.14, -0.43 + height / 2, p.z + 0.02);
        bar.rotation.z = -0.08;
      });
    } else if (kind === 'goal') {
      const ring = addMesh(new THREE.TorusGeometry(0.2, 0.045, 12, 36), citrus, p.x, -0.15, p.z);
      ring.rotation.x = Math.PI / 2;
      addMesh(new THREE.SphereGeometry(0.09, 20, 16), pale, p.x, -0.14, p.z);
    } else {
      const card = addMesh(new THREE.BoxGeometry(0.38, 0.45, 0.07), pale, p.x, -0.19, p.z);
      card.rotation.y = -0.13;
      card.rotation.z = 0.03;
      [0, 1, 2].forEach((row) => addMesh(new THREE.BoxGeometry(0.2, 0.02, 0.018), row === 0 ? amber : blue, p.x - 0.01, -0.1 - row * 0.09, p.z + 0.045));
    }
    const pin = addMesh(new THREE.SphereGeometry(0.075, 24, 18), color, p.x, p.y, p.z);
    pin.scale.set(1, 0.82, 1);
  });

  // The small chart bars respond to the selected section, keeping each module illustration meaningful.
  const emphasis = kind === 'goals' ? 1 : kind === 'budgets' || kind === 'reports' ? 0 : 2;
  const heights = [0.28, 0.43, 0.62];
  heights.forEach((height, index) => {
    const chartBar = addMesh(new THREE.BoxGeometry(0.085, height, 0.1), index === emphasis ? citrus : pale, -0.12 + index * 0.13, -0.42 + height / 2, -0.33);
    chartBar.rotation.z = -0.05;
  });
  return diagram;
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
    } catch {
      setFailed(true);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 30);
    camera.position.set(0, 0.18, 5.2);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    scene.add(new THREE.HemisphereLight('#f4fbff', '#627d9a', 2.1));
    const key = new THREE.DirectionalLight('#ffffff', 3.15);
    key.position.set(-3, 4, 5);
    scene.add(key);
    const fill = new THREE.PointLight('#51d3ad', 24, 8, 2);
    fill.position.set(1, 1.8, 2.4);
    scene.add(fill);

    const object = buildFlowDiagram(kind);
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

    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    const onMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerX = (event.clientX - bounds.left) / bounds.width * 2 - 1;
      pointerY = (event.clientY - bounds.top) / bounds.height * 2 - 1;
      targetY = pointerX * 0.17;
      targetX = pointerY * 0.08;
    };
    const onLeave = () => { targetX = 0; targetY = 0; };
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);

    let animation = 0;
    const render = () => {
      if (motionEnabled) {
        object.rotation.y += (targetY + 0.08 - object.rotation.y) * 0.018;
        object.rotation.x += (-targetX - 0.07 - object.rotation.x) * 0.018;
        object.position.y = Math.sin(performance.now() * 0.00045) * 0.035;
      } else {
        object.rotation.set(-0.07, 0.08, 0);
      }
      renderer.render(scene, camera);
      animation = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animation);
      observer.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((item) => item.dispose());
        }
      });
      renderer.dispose();
    };
  }, [kind, motionEnabled]);

  return (
    <section className={`scene-panel scene-${kind}`} aria-label={title}>
      <div className="scene-copy">
        <span className="eyebrow">SIGMAPAY / {kind}</span>
        <h2>{title}</h2>
        <p>{description}</p>
        <button className="motion-control" type="button" onClick={() => setMotionEnabled((value) => !value)} aria-pressed={!motionEnabled}>
          {motionEnabled ? 'Pause 3D motion' : 'Resume 3D motion'}
        </button>
      </div>
      {!failed ? <canvas ref={canvasRef} className="scene-canvas" aria-hidden="true" /> : (
        <div className="scene-fallback" role="img" aria-label={`${title} diagram fallback`}>
          <span className="fallback-hub" /><span className="fallback-link fallback-link-one" /><span className="fallback-link fallback-link-two" /><span className="fallback-link fallback-link-three" />
          <span className="fallback-node fallback-node-one" /><span className="fallback-node fallback-node-two" /><span className="fallback-node fallback-node-three" />
        </div>
      )}
    </section>
  );
};

export default FinancialScene;
