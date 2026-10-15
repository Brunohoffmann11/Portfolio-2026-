/* Abertura 3D. Script comum (não module) que carrega o three.js com import() dinâmico:
   assim o site também abre com dois cliques no index.html, sem servidor. */
(function () {
'use strict';
const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js';
let THREE = null;

/* Glyph outlines for the 3D name (three.js typeface format, 1000 units per em).
   Only the letters the name uses. */
const FONT = {"glyphs":{" ":{"ha":212,"x_min":0,"x_max":0,"o":""},"A":{"ha":737,"x_min":16,"x_max":722,"o":"m 499 124 l 237 124 l 195 0 l 16 0 l 270 702 l 468 702 l 722 0 l 541 0 l 499 124 m 455 256 l 368 513 l 282 256 l 455 256"},"B":{"ha":659,"x_min":62,"x_max":622,"o":"m 622 191 q 560.5 51.5 622 103 q 389 0 499 0 l 62 0 l 62 702 l 378 702 q 545.5 653 485 702 q 606 520 606 604 q 573.5 417 606 458 q 487 360 541 376 q 585 299.5 548 347 q 622 191 622 252 m 233 418 l 345 418 q 409.5 436.5 387 418 q 432 491 432 455 q 409.5 546 432 527 q 345 565 387 565 l 233 565 l 233 418 m 449 214 q 424.5 272 449 251 q 357 293 400 293 l 233 293 l 233 138 l 359 138 q 425.5 157.5 402 138 q 449 214 449 177"},"F":{"ha":547,"x_min":62,"x_max":519,"o":"m 519 702 l 519 565 l 233 565 l 233 417 l 447 417 l 447 284 l 233 284 l 233 0 l 62 0 l 62 702 l 519 702"},"H":{"ha":731,"x_min":62,"x_max":670,"o":"m 670 702 l 670 0 l 499 0 l 499 289 l 233 289 l 233 0 l 62 0 l 62 702 l 233 702 l 233 427 l 499 427 l 499 702 l 670 702"},"M":{"ha":918,"x_min":62,"x_max":857,"o":"m 857 702 l 857 0 l 686 0 l 686 421 l 529 0 l 391 0 l 233 422 l 233 0 l 62 0 l 62 702 l 264 702 l 461 216 l 656 702 l 857 702"},"N":{"ha":752,"x_min":62,"x_max":690,"o":"m 690 0 l 519 0 l 233 433 l 233 0 l 62 0 l 62 702 l 233 702 l 519 267 l 519 702 l 690 702 l 690 0"},"O":{"ha":786,"x_min":33,"x_max":753,"o":"m 33 353 q 81.5 538 33 456 q 212.5 666 130 620 q 394 712 295 712 q 575.5 666 493 712 q 705.5 538 658 620 q 753 353 753 456 q 705 167.5 753 250 q 575 39 657 85 q 394 -7 493 -7 q 212.5 39 295 -7 q 81.5 167.5 130 85 q 33 353 33 250 m 579 353 q 528.5 501.5 579 446 q 394 557 478 557 q 258.5 502 309 557 q 208 353 208 447 q 258.5 204.5 208 260 q 394 149 309 149 q 528.5 205 478 149 q 579 353 579 261"},"R":{"ha":652,"x_min":62,"x_max":613,"o":"m 420 0 l 274 265 l 233 265 l 233 0 l 62 0 l 62 702 l 349 702 q 490.5 673 432 702 q 578 593.5 549 644 q 607 481 607 543 q 567.5 356 607 411 q 451 278 528 301 l 613 0 l 420 0 m 233 386 l 339 386 q 409.5 409 386 386 q 433 474 433 432 q 409.5 537 433 514 q 339 560 386 560 l 233 560 l 233 386"},"U":{"ha":705,"x_min":59,"x_max":647,"o":"m 230 702 l 230 282 q 261 185 230 219 q 352 151 292 151 q 444 185 412 151 q 476 282 476 219 l 476 702 l 647 702 l 647 283 q 607 124 647 189 q 499.5 26 567 59 q 349 -7 432 -7 q 200.5 25.5 266 -7 q 97 123.5 135 58 q 59 283 59 189 l 59 702 l 230 702"}},"familyName":"Display","resolution":1000};
const NAME = 'BRUNO HOFFMANN';
const RES = FONT.resolution;
const BG = 0xd9d9d5;
const FLOOR = 0xc6c6c1;
const TRACK = 0.028;
const EXTRUDE = { depth: 0.42, curveSegments: 12, bevelEnabled: true, bevelThickness: 0.065, bevelSize: 0.038, bevelOffset: 0, bevelSegments: 6 };
const lerp = (a, b, t) => a + (b - a) * t;

function glyphShapes(ch) {
  const g = FONT.glyphs[ch];
  if (!g || !g.o) return [];
  const path = new THREE.ShapePath();
  const o = g.o.split(' ');
  const n = (i) => parseFloat(o[i]) / RES;
  for (let i = 0; i < o.length;) {
    const c = o[i++];
    if (c === 'm') { path.moveTo(n(i), n(i + 1)); i += 2; }
    else if (c === 'l') { path.lineTo(n(i), n(i + 1)); i += 2; }
    else if (c === 'q') { path.quadraticCurveTo(n(i + 2), n(i + 3), n(i), n(i + 1)); i += 4; }
    else if (c === 'b') { path.bezierCurveTo(n(i + 2), n(i + 3), n(i + 4), n(i + 5), n(i), n(i + 1)); i += 6; }
  }
  return path.toShapes();
}
const advance = (ch) => (FONT.glyphs[ch] ? FONT.glyphs[ch].ha : RES * 0.5) / RES + TRACK;

const geoCache = new Map();
function letterGeometry(ch) {
  if (geoCache.has(ch)) return geoCache.get(ch);
  const geo = new THREE.ExtrudeGeometry(glyphShapes(ch), EXTRUDE);
  geo.computeBoundingBox();
  const b = geo.boundingBox;
  geo.translate(-(b.min.x + b.max.x) / 2, -b.min.y, -(b.min.z + b.max.z) / 2);
  geo.computeBoundingBox();
  geo.computeVertexNormals();
  geoCache.set(ch, geo);
  return geo;
}

/* a soft studio for reflections: grey room, a few bright panels */
function studio() {
  const s = new THREE.Scene();
  const room = new THREE.Mesh(new THREE.BoxGeometry(34, 22, 34), new THREE.MeshBasicMaterial({ color: 0x5f5f5d, side: THREE.BackSide }));
  room.position.y = 9;
  s.add(room);
  const panel = (w, h, x, y, z, k) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color().setScalar(k), side: THREE.DoubleSide }));
    m.position.set(x, y, z); m.lookAt(0, 1, 0); s.add(m);
  };
  panel(10, 5, 0, 16, 3, 7);
  panel(6, 7, -14, 6, 6, 3.2);
  panel(6, 7, 14, 6, -3, 4.2);
  panel(12, 3, 0, 4.5, -15, 2.4);
  panel(30, 2, 0, 0.2, 14, 1.4);
  return s;
}

function createStage(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(BG, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);
  scene.fog = new THREE.Fog(BG, 30, 90);
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0.78, 10);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xc2c2bd, 0.24));
  const key = new THREE.DirectionalLight(0xffffff, 5);
  key.position.set(2.6, 5, 5.2);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { near: 1, far: 22, left: -7.5, right: 7.5, top: 7 * 0.55, bottom: -7 * 0.35 });
  key.shadow.normalBias = 0.022;
  key.shadow.bias = -0.0004;
  key.shadow.radius = 3.2;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.34);
  fill.position.set(-5.5, 2.8, 3.5);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 1.15);
  rim.position.set(-1.2, 3.4, -6);
  scene.add(rim);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshStandardMaterial({ color: FLOOR, roughness: 0.94, metalness: 0 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(studio(), 0.04);
  scene.environment = env.texture;
  scene.environmentIntensity = 0.3;
  pmrem.dispose();

  let fitW = 8, fitH = 1;
  const state = { push: 0 };
  function frame() {
    const aspect = camera.aspect;
    const m = aspect < 1 ? 1.24 : 1.26;
    const half = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    const zW = (fitW * m) / (2 * half * aspect);
    const zH = (fitH * m * (aspect < 1 ? 2.6 : 1.75)) / (2 * half);
    const z = Math.max(zW, zH);
    camera.position.z = z * (1 - state.push * 0.085);
    camera.position.y = fitH * 0.6 + state.push * fitH * 0.04;
    camera.lookAt(0, fitH * 0.44, 0);
    camera.updateProjectionMatrix();
    scene.fog.near = z * 1.5;
    scene.fog.far = z * 3.6;
  }
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, w * h > 2.6e6 ? 1.6 : 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    frame();
  }
  return {
    renderer, scene, camera, state, frame, resize,
    fit(w, h) { fitW = w; fitH = h; resize(); },
    project(v) { const p = v.clone().project(camera); return { x: (p.x * 0.5 + 0.5) * 100, y: (-p.y * 0.5 + 0.5) * 100 }; },
    render() { renderer.render(scene, camera); },
    dispose() {
      env.dispose();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) [].concat(o.material).forEach((m) => m.dispose());
      });
      renderer.dispose();
    }
  };
}

function whiteMaterial() {
  return new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0, envMapIntensity: 0.55 });
}

function buildWord(material) {
  const chars = [...NAME];
  const width = chars.reduce((s, ch) => s + advance(ch), 0) - TRACK;
  const group = new THREE.Group();
  const letters = [];
  let x = -width / 2;
  chars.forEach((ch, i) => {
    const adv = advance(ch);
    const cx = x + (adv - TRACK) / 2;
    x += adv;
    if (ch === ' ') return;
    const L = { ch, x: cx, y: 0, i, mesh: null };
    letters.push(L);
    if (i === 0) { L.empty = true; return; } // the first B arrives on its own
    const mesh = new THREE.Mesh(letterGeometry(ch), material);
    mesh.position.set(cx, 0, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    L.mesh = mesh;
  });
  const height = letterGeometry('B').boundingBox.max.y;
  return { group, letters, width, height, slot: letters[0], target: letters.find((l) => l.ch === 'R') };
}

function buildHero(material) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(letterGeometry('B'), material);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);
  return { group, body };
}

function buildRing() {
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.2, 0.34, 48),
    new THREE.MeshBasicMaterial({ color: 0x12315f, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.004;
  ring.scale.setScalar(0.001);
  ring.renderOrder = 2;
  return ring;
}

function ripple(gsap, ring, x, y, k) {
  ring.position.set(x, y + 0.004, 0);
  ring.scale.setScalar(0.25);
  ring.material.opacity = 0.3 * k;
  gsap.to(ring.scale, { x: 2.6 * k + 0.6, y: 2.6 * k + 0.6, duration: 0.72, ease: 'power2.out' });
  gsap.to(ring.material, { opacity: 0, duration: 0.72, ease: 'power2.out' });
}

/* a hop with anticipation, stretch on the way up and squash on landing */
function hop(gsap, obj, { to, height, dur, spin = 0, crouch = 0.08, recoil = 'dry', sound, power = 1 }) {
  const tl = gsap.timeline();
  tl.add(() => sound.hop(power), crouch);
  tl.add(() => sound.land(power), crouch + dur);
  const p = obj.position, s = obj.scale, r = obj.rotation;
  const peak = Math.max(p.y, to.y) + height;
  tl.to(s, { y: 0.82, x: 1.11, z: 1.11, duration: crouch, ease: 'power2.out' }, 0);
  tl.to(s, { y: 1.2, x: 0.9, z: 0.9, duration: dur * 0.24, ease: 'power2.out' }, crouch);
  tl.to(s, { y: 1, x: 1, z: 1, duration: dur * 0.32, ease: 'sine.inOut' }, crouch + dur * 0.24);
  tl.to(p, { x: to.x, duration: dur, ease: 'none' }, crouch);
  if (to.z !== undefined) tl.to(p, { z: to.z, duration: dur, ease: 'sine.inOut' }, crouch);
  tl.to(p, { y: peak, duration: dur * 0.46, ease: 'power2.out' }, crouch);
  tl.to(p, { y: to.y, duration: dur * 0.54, ease: 'power2.in' }, crouch + dur * 0.46);
  tl.to(r, { z: spin, duration: dur * 0.45, ease: 'sine.out' }, crouch);
  tl.to(r, { z: 0, duration: dur * 0.55, ease: 'sine.inOut' }, crouch + dur * 0.45);
  tl.to(s, { y: 1.15, x: 0.94, z: 0.94, duration: dur * 0.26, ease: 'power1.in' }, crouch + dur * 0.74);
  const land = crouch + dur;
  tl.to(s, { y: 0.74, x: 1.17, z: 1.17, duration: 0.07, ease: 'power3.out' }, land);
  const springy = recoil === 'elastic';
  tl.to(s, { y: 1, x: 1, z: 1, duration: springy ? 0.7 : 0.15, ease: springy ? 'elastic.out(1, 0.4)' : 'power2.out' }, land + 0.07);
  return tl;
}

function create({ canvas, caption, root, sound }) {
  const gsap = window.gsap;
  const stage = createStage(canvas);
  const material = whiteMaterial();
  const word = buildWord(material);
  const hero = buildHero(material);
  const ring = buildRing();
  stage.scene.add(word.group, hero.group, ring);
  hero.group.visible = false;
  stage.fit(word.width, word.height);

  const captionAnchor = new THREE.Vector3(0, -0.3, 0);
  let alive = true;
  const render = () => {
    if (!alive) return;
    root.style.setProperty('--caption-y', stage.project(captionAnchor).y.toFixed(2) + '%');
    stage.render();
  };
  gsap.ticker.add(render);

  const life = [];
  function startLife() {
    const g = hero.group;
    life.push(gsap.to(g.scale, { y: 1.012, x: 0.994, z: 0.994, duration: 1.9, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    life.push(gsap.to(g.rotation, { z: 0.008, duration: 2.7, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    const glance = () => {
      const side = Math.random() < 0.5 ? -1 : 1;
      life.push(gsap.to(g.rotation, { y: side * 0.14, duration: 0.42, ease: 'power2.out', yoyo: true, repeat: 1, repeatDelay: 0.5 }));
      life.push(gsap.delayedCall(3 + Math.random() * 3.6, glance));
    };
    life.push(gsap.delayedCall(2.8, glance));
  }
  function stopLife() { life.forEach((t) => t.kill()); life.length = 0; }

  function play(onDone) {
    const g = hero.group;
    const slot = word.slot;
    const tgt = word.target;
    const tgtH = tgt.mesh.geometry.boundingBox.max.y;
    const FRONT = 1.35;
    const xStart = word.width / 2 + 0.9;
    const press = { k: 1, free: false };
    const applyPress = () => {
      const k = press.k;
      tgt.mesh.scale.y = k;
      tgt.mesh.scale.x = tgt.mesh.scale.z = 1 + (1 - k) * 0.42;
      if (!press.free) g.position.y = tgt.y + tgtH * k;
    };
    const tl = gsap.timeline({ paused: true, onComplete: onDone });
    const meshes = word.letters.filter((l) => l.mesh);
    const STAG = 0.035;
    const cam = stage.camera;
    const topVisible = cam.position.y + cam.position.z * Math.tan((cam.fov * Math.PI) / 360);
    const lift = Math.max(5.2, topVisible + 1.4);
    const fall = Math.min(0.72, 0.44 * Math.sqrt(lift / 5.2));

    /* 1 · the letters rain down and bounce */
    meshes.forEach((l, i) => {
      const t0 = 0.15 + i * STAG;
      l.mesh.position.y = l.y + lift;
      tl.to(l.mesh.position, { y: l.y, duration: fall, ease: 'power2.in' }, t0);
      tl.add(() => sound.tap(i), t0 + fall);
      tl.to(l.mesh.scale, { y: 0.8, x: 1.12, z: 1.12, duration: 0.06, ease: 'power3.out' }, t0 + fall);
      tl.to(l.mesh.scale, { y: 1, x: 1, z: 1, duration: 0.6, ease: 'elastic.out(1, 0.45)' }, t0 + fall + 0.06);
    });
    const landed = 0.15 + (meshes.length - 1) * STAG + fall + 0.06;

    /* 2 · the missing B hops in from the right */
    g.position.set(xStart, 0, FRONT);
    g.rotation.set(0, -0.4, 0);
    g.visible = false;
    tl.set(g, { visible: true }, landed - 0.12);
    const near = tgt.x + 0.85;
    const GAP = 0.66;
    let t = landed - 0.12;
    for (let i = 0; i < 3; i++) {
      const k = Math.pow((i + 1) / 3, 0.82);
      tl.add(hop(gsap, g, { to: { x: lerp(xStart, near, k), y: 0, z: FRONT }, height: 0.66 - i * 0.04, dur: 0.36, spin: 0.1, sound, power: 0.75 + i * 0.1 }), t);
      t += GAP;
    }
    tl.to(g.rotation, { y: -0.1, duration: 3 * GAP, ease: 'sine.inOut' }, landed - 0.12);

    /* 3 · jumps on the R and squashes it */
    tl.add(hop(gsap, g, { to: { x: tgt.x, y: tgt.y + tgtH, z: 0 }, height: 0.9, dur: 0.5, spin: 0.14, recoil: 'elastic', sound, power: 1.05 }), t);
    t += 0.58;
    tl.add(() => sound.creak(0.6), t + 0.02);
    tl.to(press, { k: 0.9, duration: 0.09, ease: 'power3.out', onUpdate: applyPress }, t);
    tl.to(press, { k: 1, duration: 0.8, ease: 'elastic.out(1, 0.35)', onUpdate: applyPress }, t + 0.09);
    t += 0.26;
    tl.to(g.rotation, { x: 0.2, y: 0.1, duration: 0.3, ease: 'power2.out' }, t);
    tl.add(() => sound.click(), t + 0.26);
    tl.to(g.rotation, { x: 0, duration: 0.28, ease: 'power2.inOut' }, t + 0.5);
    t += 0.5;
    tl.add(() => sound.hop(0.7), t);
    tl.to(g.position, { y: tgt.y + tgtH + 0.6, duration: 0.27, ease: 'power2.out' }, t);
    tl.to(g.scale, { y: 1.18, x: 0.9, z: 0.9, duration: 0.27, ease: 'power2.out' }, t);
    tl.to(g.position, { y: tgt.y + tgtH, duration: 0.18, ease: 'power3.in' }, t + 0.27);
    tl.to(g.scale, { y: 1, x: 1, z: 1, duration: 0.18, ease: 'power1.in' }, t + 0.27);
    t += 0.45;
    tl.add(() => { sound.land(1.2); sound.creak(1.3); }, t);
    tl.to(press, { k: 0.28, duration: 0.1, ease: 'power4.out', onUpdate: applyPress }, t);
    tl.to(g.scale, { y: 0.68, x: 1.22, z: 1.22, duration: 0.1, ease: 'power4.out' }, t);
    tl.add(() => ripple(gsap, ring, tgt.x, tgt.y, 0.55), t + 0.09);
    t += 0.14;
    tl.add(() => { press.free = true; }, t);
    tl.to(press, { k: 1.16, duration: 0.15, ease: 'power3.out', onUpdate: applyPress }, t);
    tl.to(press, { k: 1, duration: 1, ease: 'elastic.out(1, 0.3)', onUpdate: applyPress }, t + 0.15);

    /* 4 · the R springs it into a flip, straight into its own slot */
    const FLIP = 0.78;
    const apex = Math.max(slot.y, tgt.y + tgtH) + 1.55;
    const flip = gsap.timeline();
    flip.to(g.scale, { y: 1.34, x: 0.84, z: 0.84, duration: 0.17, ease: 'power2.out' }, 0);
    flip.to(g.scale, { y: 1, x: 1, z: 1, duration: 0.32, ease: 'sine.inOut' }, 0.17);
    flip.to(g.position, { x: slot.x, duration: FLIP, ease: 'none' }, 0);
    flip.to(g.position, { z: 0, duration: FLIP, ease: 'sine.inOut' }, 0);
    flip.to(g.position, { y: apex, duration: FLIP * 0.5, ease: 'power2.out' }, 0);
    flip.to(g.position, { y: slot.y, duration: FLIP * 0.5, ease: 'power2.in' }, FLIP * 0.5);
    flip.to(g.rotation, { z: Math.PI * 2, duration: FLIP, ease: 'power1.inOut' }, 0);
    flip.to(g.rotation, { y: 0, duration: FLIP, ease: 'sine.inOut' }, 0);
    flip.to(g.scale, { y: 1.2, x: 0.92, z: 0.92, duration: 0.2, ease: 'power1.in' }, FLIP - 0.2);
    flip.set(g.rotation, { z: 0 }, FLIP);
    flip.to(g.scale, { y: 0.62, x: 1.26, z: 1.26, duration: 0.08, ease: 'power4.out' }, FLIP);
    flip.to(g.scale, { y: 1, x: 1, z: 1, duration: 1, ease: 'elastic.out(1, 0.34)' }, FLIP + 0.08);
    tl.add(flip, t + 0.13);
    tl.add(() => sound.spring(), t + 0.02);
    tl.add(() => sound.whoosh(FLIP), t + 0.13);

    /* 5 · impact: the whole name jumps a little, closest letters first */
    const touch = t + 0.13 + FLIP;
    tl.add(() => { ripple(gsap, ring, slot.x, slot.y, 1); sound.impact(meshes.length); }, touch);
    meshes.forEach((l) => {
      const d = Math.hypot(l.x - slot.x, l.y - slot.y);
      const up = Math.max(0.018, 0.1 - d * 0.011);
      const delay = d * 0.02;
      tl.to(l.mesh.position, { y: l.y + up, duration: 0.1, ease: 'power2.out' }, touch + delay);
      tl.to(l.mesh.position, { y: l.y, duration: 0.66, ease: 'elastic.out(1, 0.4)' }, touch + delay + 0.1);
    });
    let u = touch + 0.32;
    tl.to(g.rotation, { y: 0.16, duration: 0.36, ease: 'power2.out' }, u);
    tl.to(g.rotation, { y: 0, duration: 0.55, ease: 'power2.inOut' }, u + 0.36);
    tl.add(() => sound.click(), u + 0.66);
    u += 0.5;
    tl.add(() => { caption.classList.add('is-focus'); sound.chord(); }, u);
    tl.add(() => { if (onDone) onDone(); }, u + 0.12);
    tl.to(stage.state, { push: 1, duration: u + 0.6, ease: 'power1.inOut', onUpdate: stage.frame }, 0.2);
    tl.add(startLife, u + 0.35);
    tl.timeScale(1.38);
    return tl;
  }

  function settle() {
    word.letters.forEach((l) => { if (l.mesh) { l.mesh.position.set(l.x, l.y, 0); l.mesh.scale.set(1, 1, 1); } });
    const g = hero.group;
    g.position.set(word.slot.x, word.slot.y, 0);
    g.rotation.set(0, 0, 0);
    g.scale.set(1, 1, 1);
    g.visible = true;
    stage.state.push = 1;
    stage.frame();
    caption.classList.add('is-focus');
    startLife();
  }

  function leave() {
    gsap.to(stage.state, { push: 4.2, duration: 0.62, ease: 'power2.in', onUpdate: stage.frame });
    gsap.to(hero.group.scale, { y: 0.86, x: 1.08, z: 1.08, duration: 0.16, ease: 'power2.out' });
  }

  function destroy() {
    if (!alive) return;
    alive = false;
    stopLife();
    gsap.ticker.remove(render);
    gsap.killTweensOf([stage.state, hero.group.scale, hero.group.rotation, hero.group.position]);
    stage.dispose();
  }

  return { play, settle, leave, resize: stage.resize, destroy };
}

if (!window.gsap) {
  window.dispatchEvent(new Event('bh:stage-fail'));
  return;
}
import(THREE_URL).then((mod) => {
  THREE = mod;
  window.BH_STAGE = { create };
  window.dispatchEvent(new Event('bh:stage'));
}).catch((err) => {
  console.warn('abertura 3D: three.js não carregou', err);
  window.dispatchEvent(new Event('bh:stage-fail'));
});
})();
