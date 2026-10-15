(function () {
  'use strict';

  var doc = document;
  var html = doc.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var smoothstep = function (t) { return t * t * (3 - 2 * t); };
  var headerH = function () { return parseFloat(getComputedStyle(html).getPropertyValue('--header')) || 74; };
  var store = {
    get: function (s, k) { try { return window[s].getItem(k); } catch (e) { return null; } },
    set: function (s, k, v) { try { window[s].setItem(k, v); } catch (e) {} }
  };

  /* one rAF loop for everything that follows the page every frame */
  var frameFns = [];
  function onFrame(fn) { frameFns.push(fn); }
  (function loop(t) {
    requestAnimationFrame(loop);
    for (var i = 0; i < frameFns.length; i++) frameFns[i](t);
  })(performance.now());

  /* =====================================================================
     SOUND · synthesized with Web Audio, no files
     ===================================================================== */
  function createSound() {
    var AC = window.AudioContext || window.webkitAudioContext;
    var ctx = null, out = null, noise = null, on = true, hushed = false;
    if (store.get('localStorage', 'bh:sound') === 'off') on = false;

    function ensure() {
      if (ctx || !AC) return ctx;
      try { ctx = new AC(); } catch (e) { ctx = null; return null; }
      var comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -16; comp.knee.value = 10; comp.ratio.value = 4;
      comp.attack.value = 0.003; comp.release.value = 0.18;
      out = ctx.createGain(); out.gain.value = 0.85;
      out.connect(comp).connect(ctx.destination);
      noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      var d = noise.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      return ctx;
    }
    function live() { return on && !hushed && ctx && ctx.state === 'running'; }
    function env(g, t, peak, att, dur) {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + att);
      g.gain.exponentialRampToValueAtTime(0.0001, t + att + dur);
    }
    function tone(o) {
      var t = o.t != null ? o.t : ctx.currentTime, att = o.att || 0.004, f1 = o.f1 || o.f0;
      var osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = o.type || 'sine';
      osc.frequency.setValueAtTime(o.f0, t);
      osc.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t + o.dur);
      if (o.vib) {
        var lfo = ctx.createOscillator(), lg = ctx.createGain();
        lfo.frequency.value = o.vibHz;
        lg.gain.setValueAtTime(o.vib, t);
        lg.gain.exponentialRampToValueAtTime(1, t + o.dur);
        lfo.connect(lg).connect(osc.frequency);
        lfo.start(t); lfo.stop(t + o.dur + 0.05);
      }
      env(g, t, o.peak, att, o.dur);
      osc.connect(g).connect(o.dest || out);
      osc.start(t); osc.stop(t + att + o.dur + 0.05);
    }
    function hiss(o) {
      var t = o.t != null ? o.t : ctx.currentTime, att = o.att || 0.005, f1 = o.f1 || o.f0;
      var src = ctx.createBufferSource(); src.buffer = noise;
      var f = ctx.createBiquadFilter();
      f.type = o.type || 'bandpass'; f.Q.value = o.q || 1;
      f.frequency.setValueAtTime(o.f0, t);
      f.frequency.exponentialRampToValueAtTime(Math.max(f1, 20), t + o.dur);
      var g = ctx.createGain(); env(g, t, o.peak, att, o.dur);
      src.connect(f).connect(g).connect(out);
      src.start(t, Math.random() * 0.5); src.stop(t + att + o.dur + 0.05);
    }
    var fx = {
      tap: function (i) {
        if (!live()) return;
        var t = ctx.currentTime, f = 300 + ((i || 0) * 37) % 140;
        tone({ f0: f, f1: f * 0.55, t: t, dur: 0.07, peak: 0.22 });
        tone({ f0: 130, f1: 60, t: t, dur: 0.09, peak: 0.18 });
        hiss({ t: t, dur: 0.03, peak: 0.08, f0: 2400, q: 1.6 });
      },
      hop: function (s) {
        if (!live()) return; s = s == null ? 1 : s;
        var t = ctx.currentTime;
        tone({ type: 'triangle', f0: 160, f1: 470 + s * 60, t: t, dur: 0.1, peak: 0.13 * s });
        tone({ f0: 2300, f1: 1700, t: t + 0.01, dur: 0.1, peak: 0.025 * s });
      },
      land: function (s) {
        if (!live()) return; s = s == null ? 1 : s;
        var t = ctx.currentTime;
        tone({ f0: 125, f1: 42, t: t, dur: 0.17 + s * 0.05, peak: 0.46 * s });
        hiss({ t: t, dur: 0.05, peak: 0.16 * s, type: 'lowpass', f0: 1100, f1: 220 });
        tone({ type: 'triangle', f0: 270, f1: 230, t: t + 0.015, dur: 0.24, peak: 0.05 * s, vib: 45, vibHz: 21 });
      },
      creak: function (s) {
        if (!live()) return; s = s == null ? 1 : s;
        var t = ctx.currentTime, bp = ctx.createBiquadFilter();
        bp.type = 'bandpass'; bp.Q.value = 7; bp.frequency.value = 1150; bp.connect(out);
        tone({ type: 'sawtooth', f0: 820, f1: 560 + s * 40, t: t, dur: 0.2 + s * 0.06, peak: 0.07 * s, vib: 60, vibHz: 28, dest: bp });
      },
      spring: function () {
        if (!live()) return;
        var t = ctx.currentTime;
        tone({ type: 'triangle', f0: 105, f1: 330, t: t, dur: 0.55, peak: 0.3, vib: 70, vibHz: 15 });
        tone({ f0: 210, f1: 660, t: t, dur: 0.45, peak: 0.07, vib: 90, vibHz: 15 });
      },
      whoosh: function (d) {
        if (!live()) return; d = d || 0.55;
        var t = ctx.currentTime;
        hiss({ t: t, dur: d * 0.5, peak: 0.14, f0: 450, f1: 2600, q: 1.1, att: 0.05 });
        hiss({ t: t + d * 0.45, dur: d * 0.55, peak: 0.1, f0: 2600, f1: 600, q: 1.1 });
      },
      impact: function (n) {
        if (!live()) return; n = n || 9;
        var t = ctx.currentTime;
        fx.land(1.5);
        tone({ f0: 62, f1: 30, t: t, dur: 0.4, peak: 0.55 });
        for (var i = 0; i < n; i++) {
          var f = 520 + (i * 53) % 220;
          tone({ f0: f, f1: f * 0.7, t: t + 0.03 + i * 0.022, dur: 0.05, peak: 0.05 * (1 - i / (n + 2)) });
        }
      },
      click: function () { if (live()) tone({ f0: 3400, f1: 2600, dur: 0.018, peak: 0.03, att: 0.001 }); },
      chord: function () {
        if (!live()) return;
        var t = ctx.currentTime;
        tone({ f0: 784, t: t, dur: 1.7, peak: 0.07, att: 0.012 });
        tone({ f0: 1174.7, t: t + 0.07, dur: 1.5, peak: 0.05, att: 0.012 });
        tone({ f0: 196, t: t, dur: 1.3, peak: 0.06, att: 0.05 });
      },
      shimmer: function (d) {
        if (live()) hiss({ dur: d || 1, peak: 0.035, type: 'highpass', f0: 2500, f1: 7000, q: 0.7, att: (d || 1) * 0.4 });
      },
      ready: function () { if (live()) tone({ f0: 1568, dur: 1, peak: 0.045, att: 0.006 }); },
      out: function () {
        if (!live()) return;
        var t = ctx.currentTime;
        hiss({ t: t, dur: 0.02, peak: 0.22, f0: 2200, q: 2 });
        tone({ f0: 95, f1: 38, t: t, dur: 0.22, peak: 0.34 });
        tone({ type: 'triangle', f0: 220, f1: 52, t: t + 0.04, dur: 0.95, peak: 0.07 });
      }
    };
    return Object.assign({}, fx, {
      get on() { return on; },
      set: function (v) {
        on = !!v;
        store.set('localStorage', 'bh:sound', on ? 'on' : 'off');
        if (on && ensure() && ctx.resume) ctx.resume().catch(function () {});
        return on;
      },
      arm: function () {
        if (!ensure()) return;
        var resume = function () { if (ctx.state !== 'running') ctx.resume().catch(function () {}); };
        resume();
        var evs = ['pointerdown', 'mousedown', 'touchstart', 'keydown', 'click'];
        var once = function () { resume(); evs.forEach(function (e) { window.removeEventListener(e, once, true); }); };
        evs.forEach(function (e) { window.addEventListener(e, once, { capture: true, passive: true }); });
      },
      unlock: function () {
        ensure();
        if (ctx && ctx.state !== 'running') return ctx.resume().then(function () { return true; }, function () { return false; });
        return Promise.resolve(!!ctx);
      },
      hush: function (v) { hushed = v; }
    });
  }

  /* =====================================================================
     TRACE · the light that flies in and draws the enter button
     ===================================================================== */
  function createTrace(opt) {
    var canvas = opt.canvas, button = opt.button, root = opt.root, calm = opt.calm, sound = opt.sound;
    var ctx = canvas.getContext('2d');
    var dpr = 1, W = 0, H = 0, started = false, stopped = false, readyFn = null;
    var DEEP = '18,49,95', MID = '38,86,168';
    var bw, bh, cx, cy, r, run, per, P0, P1, P2;

    function size() {
      W = window.innerWidth; H = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function along(d) {
      d = ((d % per) + per) % per;
      if (d < run) return { x: cx - run / 2 + d, y: cy - r };
      d -= run;
      if (d < Math.PI * r) { var a = -Math.PI / 2 + d / r; return { x: cx + run / 2 + r * Math.cos(a), y: cy + r * Math.sin(a) }; }
      d -= Math.PI * r;
      if (d < run) return { x: cx + run / 2 - d, y: cy + r };
      d -= run;
      var b = Math.PI / 2 + d / r;
      return { x: cx - run / 2 + r * Math.cos(b), y: cy + r * Math.sin(b) };
    }
    function measure() {
      var b = button.getBoundingClientRect();
      bw = b.width; bh = b.height; cx = b.left + bw / 2; cy = b.top + bh / 2;
      r = bh / 2; run = Math.max(1, bw - 2 * r); per = 2 * run + 2 * Math.PI * r;
      root.style.setProperty('--focus-y', (cy / H * 100).toFixed(1) + '%');
      P0 = { x: W + 220, y: H * 0.2 }; P1 = { x: W * 0.68, y: H * 0.42 }; P2 = along(0);
    }
    function curve(t) {
      var u = 1 - t;
      return { x: u * u * P0.x + 2 * u * t * P1.x + t * t * P2.x, y: u * u * P0.y + 2 * u * t * P1.y + t * t * P2.y };
    }

    var DUR = 1100, t0 = 0, fired = false, trail = [], sparks = [];
    function step(now) {
      if (stopped) return;
      if (!t0) t0 = now;
      measure();
      var p = Math.min(1, (now - t0) / DUR);
      var a = clamp01(p / 0.3), b = clamp01((p - 0.3) / 0.48);
      var approaching = a > 0 && b <= 0, tracing = b > 0 && b < 1;
      var drawn = (1 - Math.pow(1 - b, 3.2)) * per;
      var head = b > 0 ? along(drawn) : curve(1 - Math.pow(1 - a, 2.2));
      var i, k, s;
      if (b < 1) {
        trail.push({ x: head.x, y: head.y, t: now });
        for (i = 0; i < 2; i++) {
          var ang = Math.random() * Math.PI * 2, sp = 10 + Math.random() * 58;
          sparks.push({ x: head.x, y: head.y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 16, t: now, life: 420 + Math.random() * 520 });
        }
      }
      while (trail.length && now - trail[0].t > 560) trail.shift();

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'multiply';
      ctx.lineCap = 'round';
      var fade = 1 - clamp01((p - 0.8) / 0.12);
      if (b > 0 && fade > 0) {
        ctx.beginPath();
        for (var d = 0; d <= drawn; d += 5) { var q = along(d); if (d === 0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y); }
        var e = along(drawn); ctx.lineTo(e.x, e.y);
        ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(' + DEEP + ',' + (0.07 * fade).toFixed(3) + ')'; ctx.stroke();
        ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(' + DEEP + ',' + (0.62 * fade).toFixed(3) + ')'; ctx.stroke();
      }
      for (i = 1; i < trail.length; i++) {
        var A = trail[i - 1], B = trail[i];
        k = 1 - (now - B.t) / 560;
        if (k <= 0) continue;
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y);
        ctx.lineWidth = 2 + 9 * k * k; ctx.strokeStyle = 'rgba(' + MID + ',' + (0.16 * k * k * k).toFixed(3) + ')'; ctx.stroke();
        ctx.lineWidth = 1 + 2.4 * k * k; ctx.strokeStyle = 'rgba(' + DEEP + ',' + (0.5 * k * k).toFixed(3) + ')'; ctx.stroke();
      }
      for (i = sparks.length - 1; i >= 0; i--) {
        s = sparks[i];
        var age = now - s.t; k = age / s.life;
        if (k >= 1) { sparks.splice(i, 1); continue; }
        var sec = age / 1000, al = (1 - k) * (1 - k) * 0.5, sz = 1 + 1.6 * (1 - k);
        ctx.fillStyle = 'rgba(' + DEEP + ',' + al.toFixed(3) + ')';
        ctx.fillRect(s.x + s.vx * sec - sz / 2, s.y + s.vy * sec - sz / 2, sz, sz);
      }
      if (approaching || tracing) {
        var rad = 34 + 10 * Math.sin(now / 90);
        var gr = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, rad);
        gr.addColorStop(0, 'rgba(' + DEEP + ',.85)');
        gr.addColorStop(0.18, 'rgba(' + MID + ',.5)');
        gr.addColorStop(0.5, 'rgba(' + MID + ',.14)');
        gr.addColorStop(1, 'rgba(' + MID + ',0)');
        ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(head.x, head.y, rad, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';

      root.style.setProperty('--born', clamp01((p - 0.74) / 0.14).toFixed(3));
      if (p >= 0.84 && !fired) {
        fired = true; root.classList.add('is-ready'); pulse(); sound.ready();
        if (readyFn) readyFn();
      }
      if (p < 1 || sparks.length) requestAnimationFrame(step);
      else ctx.clearRect(0, 0, W, H);
    }

    var pulseId = 0;
    function pulse() {
      var id = ++pulseId, s0 = 0;
      requestAnimationFrame(function f(now) {
        if (id !== pulseId || stopped) return;
        if (!s0) s0 = now;
        var el = now - s0, v, sc;
        if (el < 1440) {
          v = Math.pow(Math.sin(((el % 720) / 720) * Math.PI), 0.7); sc = 0.86 + v * 0.34;
        } else {
          var s = (el - 1440) / 1000;
          var n = 0.5 + 0.26 * Math.sin(s * 1.7) + 0.16 * Math.sin(s * 2.71 + 1.1) + 0.08 * Math.sin(s * 4.13 + 2.4);
          v = 0.16 + Math.max(0, n) * 0.3; sc = 0.9 + v * 0.22;
        }
        root.style.setProperty('--pulse', v.toFixed(3));
        root.style.setProperty('--pulse-s', sc.toFixed(3));
        requestAnimationFrame(f);
      });
    }

    return {
      start: function () {
        if (started) return;
        started = true; size(); measure();
        if (calm) {
          root.style.setProperty('--born', '1'); root.classList.add('is-ready'); fired = true;
          if (readyFn) readyFn();
          return;
        }
        t0 = 0; sound.shimmer(DUR / 1000 * 0.84);
        requestAnimationFrame(step);
      },
      onReady: function (fn) { readyFn = fn; },
      resize: function () { size(); if (started) measure(); },
      stop: function () { stopped = true; pulseId++; ctx.clearRect(0, 0, W, H); }
    };
  }

  /* =====================================================================
     OPENING · 3D stage (module below) or a static poster as fallback
     ===================================================================== */
  function webglOK() {
    try { var c = doc.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); }
    catch (e) { return false; }
  }

  function initIntro(opt) {
    var sound = opt.sound;
    var root = $('#intro'), stageCanvas = $('#stage'), caption = $('#intro-caption');
    var enter = $('#enter'), skip = $('#skip'), toggle = $('#sound-toggle');
    var seen = store.get('sessionStorage', 'bh:intro') === '1';
    var trace = createTrace({ canvas: $('#trace'), button: enter, root: root, calm: reduce, sound: sound });
    var scene = null, tl = null, left = false, decided = false;

    function syncToggle() {
      toggle.setAttribute('aria-pressed', String(sound.on));
      $('.sound-label', toggle).textContent = sound.on ? 'Som ligado' : 'Som desligado';
    }
    toggle.addEventListener('click', function () {
      var next = !sound.on; sound.set(next);
      if (next) sound.unlock().then(syncToggle); else syncToggle();
    });
    syncToggle();

    function leave(withReel) {
      if (left) return;
      left = true;
      store.set('sessionStorage', 'bh:intro', '1');
      /* o vídeo monta já aqui: aparece sob a lavagem, sem piscar preto no meio */
      if (opt.onBeforeEnter) opt.onBeforeEnter(withReel === true);
      root.classList.add('is-leaving');
      trace.stop();
      root.style.setProperty('--pulse', '0');
      root.classList.add('is-wash');
      sound.out();
      if (scene) scene.leave();
      setTimeout(function () { root.classList.add('is-wash-end'); }, 420);
      setTimeout(function () {
        root.classList.add('is-done');
        doc.body.classList.remove('is-loading');
        if (opt.onEnter) opt.onEnter(withReel === true);
        setTimeout(function () { if (scene) scene.destroy(); }, 900);
      }, 780);
    }

    function startStatic() {
      root.classList.add('is-static', 'is-running');
      var poster = doc.createElement('div');
      poster.className = 'intro-poster';
      poster.innerHTML = '<p>BRUNO HOFFMANN</p>';
      root.insertBefore(poster, caption);
      caption.classList.add('is-focus');
      trace.start();
    }

    function start3D() {
      try {
        scene = window.BH_STAGE.create({ canvas: stageCanvas, caption: caption, root: root, sound: sound });
      } catch (err) {
        console.warn('abertura 3D:', err);
        scene = null; startStatic(); return;
      }
      var pending = 0;
      window.addEventListener('resize', function () {
        if (left || pending) return;
        pending = requestAnimationFrame(function () { pending = 0; scene.resize(); trace.resize(); });
      });
      if (reduce || seen) {
        scene.settle(); root.classList.add('is-running'); trace.start();
      } else {
        tl = scene.play(function () { trace.start(); });
        if (sound.on) sound.arm();
        root.classList.add('is-running');
        requestAnimationFrame(function () { requestAnimationFrame(function () { tl.play(); }); });
      }
    }

    function decide(fn) { if (decided) return; decided = true; fn(); }

    /* entrar pelo botão leva ao vídeo; pular a abertura vai direto ao site */
    enter.addEventListener('click', function () { leave(true); });
    skip.addEventListener('click', function () {
      if (!decided) decide(startStatic);
      if (tl) { sound.hush(true); tl.progress(1); tl.pause(); sound.hush(false); }
      if (root.classList.contains('is-ready')) leave(false); else trace.start();
    });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !root.classList.contains('is-done')) { e.preventDefault(); leave(false); }
    });
    window.addEventListener('resize', function () { if (!scene) trace.resize(); });

    if (!webglOK() || !window.gsap) decide(startStatic);
    else if (window.BH_STAGE) decide(start3D);
    else {
      window.addEventListener('bh:stage', function () { decide(start3D); }, { once: true });
      window.addEventListener('bh:stage-fail', function () { decide(startStatic); }, { once: true });
      setTimeout(function () { decide(startStatic); }, 8000);
    }
    return { leave: leave };
  }

  /* =====================================================================
     BACKGROUND · marble of domain-warped noise, rendered small and scaled up
     ===================================================================== */
  var VERT = '#version 300 es\nvoid main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.0-1.0,0.0,1.0);}';
  var FRAG = [
    '#version 300 es',
    'precision highp float;',
    'out vec4 outColor;',
    'uniform vec2 uRes;',
    'uniform float uTime;',
    'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}',
    'float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);',
    '  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}',
    'float fbm(vec2 p){float v=0.0,a=0.5;mat2 m=mat2(0.8,0.6,-0.6,0.8);',
    '  for(int i=0;i<4;i++){v+=a*noise(p);p=m*p*2.02;a*=0.5;}return v;}',
    'void main(){',
    '  vec2 uv=gl_FragCoord.xy/uRes;',
    '  vec2 p=(uv-0.5)*vec2(uRes.x/uRes.y,1.0)*2.6;',
    '  float t=uTime*0.035;',
    '  vec2 q=vec2(fbm(p+vec2(0.0,t)),fbm(p+vec2(5.2,1.3-t)));',
    '  vec2 r=vec2(fbm(p+3.0*q+vec2(1.7,9.2)+t*0.7),fbm(p+3.0*q+vec2(8.3,2.8)-t*0.5));',
    '  float f=fbm(p+3.4*r);',
    '  vec3 c=mix(vec3(0.020,0.024,0.039),vec3(0.043,0.062,0.118),clamp(f*1.8,0.0,1.0));',
    '  c=mix(c,vec3(0.075,0.115,0.208),clamp(length(r)*0.85,0.0,1.0));',
    '  c=mix(c,vec3(0.16,0.235,0.40),pow(clamp(q.x*q.y*2.8,0.0,1.0),2.4));',
    '  float vein=pow(clamp(1.0-abs(f-0.56)*7.5,0.0,1.0),3.2);',
    '  c+=vec3(0.10,0.14,0.24)*vein*0.75;',
    '  float vig=smoothstep(1.3,0.28,length(uv-0.5)*1.55);',
    '  c*=0.5+0.5*vig;',
    '  c+=(hash(gl_FragCoord.xy+fract(uTime))-0.5)*0.014;',
    '  outColor=vec4(c,1.0);',
    '}'
  ].join('\n');

  function initTexture() {
    var canvas = $('#texture');
    if (!canvas) return;
    var gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power', preserveDrawingBuffer: true });
    if (!gl) { html.classList.add('no-texture'); return; }
    function sh(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn('textura:', gl.getShaderInfoLog(s)); return null; }
      return s;
    }
    var vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { html.classList.add('no-texture'); return; }
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { html.classList.add('no-texture'); return; }
    gl.useProgram(prog);
    var uRes = gl.getUniformLocation(prog, 'uRes'), uTime = gl.getUniformLocation(prog, 'uTime');
    var SCALE = 0.55;
    function size() {
      var w = Math.max(2, Math.round(window.innerWidth * SCALE)), h = Math.max(2, Math.round(window.innerHeight * SCALE));
      canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); gl.uniform2f(uRes, w, h);
    }
    function draw(t) { gl.uniform1f(uTime, t); gl.drawArrays(gl.TRIANGLES, 0, 3); }
    size(); draw(0);
    var pending = 0;
    window.addEventListener('resize', function () {
      if (pending) return;
      pending = requestAnimationFrame(function () { pending = 0; size(); draw(performance.now() / 1000); });
    });
    if (reduce) { draw(12.7); return; }
    var visible = true, last = 0;
    var io = new IntersectionObserver(function (es) {
      visible = es.some(function (e) { return e.isIntersecting; });
    }, { rootMargin: '10% 0px' });
    $$('.sec--texture').forEach(function (s) { io.observe(s); });
    onFrame(function (now) {
      if (!visible || doc.hidden || now - last < 33.3) return;
      last = now; draw(now / 1000);
    });
  }

  /* =====================================================================
     REEL · o vídeo de apresentação entre a abertura e o site
     ===================================================================== */
  function initReel() {
    var root = $('#reel');
    if (!root) return null;
    var video = $('#reel-video', root);
    var fill = $('.reel-bar-fill', root);
    var muteBtn = $('#reel-mute', root);
    var muteLabel = $('.reel-mute-label', muteBtn);
    var skipBtn = $('#reel-skip', root);
    var shell = [$('#header'), $('main')].filter(Boolean);
    var onDone = null, guard = 0, live = false;

    function syncMute() {
      muteBtn.setAttribute('aria-pressed', String(video.muted));
      muteLabel.textContent = video.muted ? 'Som desligado' : 'Som ligado';
    }

    function finish() {
      if (!live) return;
      live = false;
      clearTimeout(guard);
      root.classList.remove('is-open');
      root.classList.add('is-out');
      try { video.pause(); } catch (err) {}
      html.classList.remove('modal-open');
      shell.forEach(function (el) { el.removeAttribute('inert'); });
      setTimeout(function () {
        root.hidden = true;
        root.classList.remove('is-out');
        video.removeAttribute('src');
        try { video.load(); } catch (err) {}
      }, reduce ? 0 : 800);
      var cb = onDone; onDone = null;
      if (cb) cb();
    }

    muteBtn.addEventListener('click', function () { video.muted = !video.muted; syncMute(); });
    skipBtn.addEventListener('click', finish);
    video.addEventListener('ended', finish);
    video.addEventListener('error', finish);
    video.addEventListener('timeupdate', function () {
      var d = video.duration;
      if (d && isFinite(d)) fill.style.width = (video.currentTime / d * 100).toFixed(2) + '%';
    });
    doc.addEventListener('keydown', function (e) {
      if (live && e.key === 'Escape') { e.preventDefault(); finish(); }
    });

    return {
      /* mostra o pôster ainda durante a lavagem da abertura */
      mount: function () {
        live = true;
        root.hidden = false;
        html.classList.add('modal-open');
        shell.forEach(function (el) { el.setAttribute('inert', ''); });
        /* ler offsetWidth descarrega o layout do estado fechado, então a transição
           ainda anima sem depender de um rAF chegar na hora certa */
        void root.offsetWidth;
        root.classList.add('is-open');
      },
      play: function (wantSound, cb) {
        if (!live) { if (cb) cb(); return; }
        onDone = cb;
        video.muted = !wantSound;
        syncMute();
        var p = video.play();
        if (p && p.catch) {
          p.catch(function () {
            /* o navegador barrou o som; o vídeo tem legenda embutida, então mudo resolve */
            video.muted = true; syncMute();
            var q = video.play();
            if (q && q.catch) q.catch(finish);
          });
        }
        /* rede ruim ou decodificação travada não podem prender ninguém na abertura;
           a folga acompanha a duração do vídeo em vez de um número fixo */
        var dur = (isFinite(video.duration) && video.duration) || 30;
        guard = setTimeout(finish, dur * 1000 + 15000);
      },
      skip: finish
    };
  }

  /* =====================================================================
     SMOOTH SCROLL
     ===================================================================== */
  function initScroll() {
    var lenis = null;
    if (!reduce && window.Lenis) {
      lenis = new window.Lenis({
        duration: 1.15,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smoothWheel: true,
        syncTouch: false
      });
      onFrame(function (t) { lenis.raf(t); });
    }
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (!id || id.length < 2) return;
        var el = $(id);
        if (!el) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(el, { offset: -headerH(), duration: 1.35 });
        else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - headerH(), behavior: reduce ? 'auto' : 'smooth' });
      });
    });
    return {
      stop: function () { if (lenis) lenis.stop(); },
      resume: function () {
        if (lenis) { lenis.scrollTo(0, { immediate: true }); lenis.start(); }
        else window.scrollTo(0, 0);
      },
      /* freeze in place (modal open), unlike stop/resume, keeps the scroll position */
      pause: function () { if (lenis) lenis.stop(); },
      play: function () { if (lenis) lenis.start(); }
    };
  }

  /* =====================================================================
     MENU · marks the section under 42% of the viewport
     ===================================================================== */
  function initMenu() {
    var secs = $$('[data-section]'), links = $$('.nav a');
    function measure() {
      var mark = window.innerHeight * 0.42, active = null;
      secs.forEach(function (s) { var r = s.getBoundingClientRect(); if (r.top <= mark && r.bottom > mark) active = s.id; });
      links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + active); });
    }
    var pending = 0;
    var on = function () { if (!pending) pending = requestAnimationFrame(function () { pending = 0; measure(); }); };
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    measure();
    return { measure: measure };
  }

  /* =====================================================================
     REVEAL · blocks rise in; display lines rise word by word
     ===================================================================== */
  function splitWords(el) {
    if (el.dataset.split) return;
    el.dataset.split = '1';
    var n = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = doc.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (!part.trim()) { frag.appendChild(doc.createTextNode(part)); return; }
            var w = doc.createElement('span'); w.className = 'w'; w.style.setProperty('--i', n++);
            var i = doc.createElement('i'); i.textContent = part; w.appendChild(i);
            frag.appendChild(w);
          });
          c.replaceWith(frag);
        } else if (c.nodeType === 1) walk(c);
      });
    })(el);
  }

  function initReveal() {
    var items = $$('.reveal');
    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return { start: function () {} };
    }
    $$('.display').forEach(function (el) { if (el.closest('.reveal')) splitWords(el); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    items.forEach(function (el) {
      var sibs = Array.prototype.filter.call(el.parentElement ? el.parentElement.children : [], function (s) { return s.classList.contains('reveal'); });
      var i = sibs.indexOf(el);
      if (i > 0) el.style.setProperty('--delay', Math.min(i, 6) * 70 + 'ms');
    });
    var on = false;
    return { start: function () { if (on) return; on = true; items.forEach(function (el) { io.observe(el); }); } };
  }

  /* =====================================================================
     PORTRAIT · flies from the hero into the About frame as the page scrolls
     ===================================================================== */
  function initFace() {
    var face = $('#face'), from = $('#face-hero'), to = $('#face-dest');
    if (!face || !from || !to) return null;
    if (reduce) { html.classList.add('face-still'); return null; }
    doc.body.appendChild(face);
    face.classList.add('face--flying');
    var sec = to.closest('.sec') || to, travel = 1, hidden = -1;
    function measure() { travel = Math.max(1, sec.getBoundingClientRect().top + window.scrollY - headerH()); }
    function update() {
      var k = smoothstep(clamp01(window.scrollY / travel));
      var a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
      var x = lerp(a.left, b.left, k), y = lerp(a.top, b.top, k), w = lerp(a.width, b.width, k), h = lerp(a.height, b.height, k);
      face.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      face.style.width = w.toFixed(1) + 'px';
      face.style.height = h.toFixed(1) + 'px';
      face.style.setProperty('--fade', (1 - k).toFixed(3));
      var off = y + h < -80 || y > window.innerHeight + 80;
      if (off !== (hidden === 1)) { face.style.visibility = off ? 'hidden' : 'visible'; hidden = off ? 1 : 0; }
    }
    measure();
    onFrame(update);
    window.addEventListener('resize', function () { measure(); update(); });
    var img = $('img', face);
    if (img && !img.complete) img.addEventListener('load', measure, { once: true });
    update();
    return { measure: measure };
  }

  /* =====================================================================
     WORK · project rows open a dialog built from the <template> that carries the project
     ===================================================================== */
  function initProjects(scroll) {
    var tops = $$('.project-top[data-project]');
    var modal = $('#project-modal');
    if (!tops.length || !modal) return;

    var panel = $('.project-modal-panel', modal);
    var body = $('#project-modal-body');
    var closeBtn = $('.project-modal-close', modal);
    var shell = [$('#header'), $('main')].filter(Boolean);
    var opener = null, closing = 0;

    var FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

    function lockScrollbar() {
      var w = window.innerWidth - html.clientWidth;
      html.style.setProperty('--sbw', (w > 0 ? w : 0) + 'px');
    }

    function open(id, trigger) {
      var tpl = doc.getElementById('project-tpl-' + id);
      if (!tpl || !modal.hidden) return;
      clearTimeout(closing);
      body.innerHTML = '';
      body.appendChild(tpl.content.cloneNode(true));
      opener = trigger || null;
      lockScrollbar();
      modal.hidden = false;
      panel.scrollTop = 0;
      html.classList.add('modal-open');
      shell.forEach(function (el) { el.setAttribute('inert', ''); });
      if (scroll) scroll.pause();
      /* mesmo truque do reel: descarrega o layout fechado e anima em seguida */
      void panel.offsetWidth;
      modal.classList.add('is-open');
      closeBtn.focus();
    }

    function close() {
      if (modal.hidden) return;
      modal.classList.remove('is-open');
      html.classList.remove('modal-open');
      shell.forEach(function (el) { el.removeAttribute('inert'); });
      if (scroll) scroll.play();
      if (opener) { opener.focus(); opener = null; }
      closing = setTimeout(function () {
        modal.hidden = true;
        body.innerHTML = '';
      }, reduce ? 0 : 420);
    }

    tops.forEach(function (t) {
      t.addEventListener('click', function () { open(t.getAttribute('data-project'), t); });
    });

    $$('[data-close]', modal).forEach(function (el) {
      el.addEventListener('click', close);
    });

    doc.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      var items = $$(FOCUSABLE, panel).filter(function (el) { return el.offsetParent !== null; });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    var count = $('#project-count');
    if (count) count.textContent = String(tops.length).padStart(2, '0') + (tops.length === 1 ? ' projeto' : ' projetos');
  }

  /* =====================================================================
     EMBER · the contact button with a spark running around its edge
     ===================================================================== */
  function initEmber() {
    var btn = $('#ember'), canvas = btn && $('.ember-canvas', btn);
    if (!btn || !canvas) return;
    if (reduce) { canvas.remove(); return; }
    var ctx = canvas.getContext('2d');
    var CW = 0, CH = 0, ox = 0, oy = 0, bw = 0, bh = 0, r = 0, run = 0, per = 0;
    var CORE = '226,238,255', GLOW = '61,114,201';
    function size() {
      var b = btn.getBoundingClientRect();
      if (!b.width) return;
      bw = b.width; bh = b.height; r = bh / 2; run = Math.max(1, bw - 2 * r); per = 2 * run + 2 * Math.PI * r;
      CW = Math.round(bw + 180); CH = Math.round(bh + 180);
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(CW * dpr); canvas.height = Math.round(CH * dpr);
      canvas.style.width = CW + 'px'; canvas.style.height = CH + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ox = CW / 2; oy = CH / 2;
    }
    function along(d) {
      d = ((d % per) + per) % per;
      if (d < run) return { x: ox - run / 2 + d, y: oy - r };
      d -= run;
      if (d < Math.PI * r) { var a = -Math.PI / 2 + d / r; return { x: ox + run / 2 + r * Math.cos(a), y: oy + r * Math.sin(a) }; }
      d -= Math.PI * r;
      if (d < run) return { x: ox + run / 2 - d, y: oy + r };
      d -= run;
      var b = Math.PI / 2 + d / r;
      return { x: ox - run / 2 + r * Math.cos(b), y: oy + r * Math.sin(b) };
    }
    size();
    var pending = 0;
    window.addEventListener('resize', function () { if (!pending) pending = requestAnimationFrame(function () { pending = 0; size(); }); });

    var heat = { v: 0 }, trail = [], sparks = [], pos = 0, last = 0, inView = false;
    new IntersectionObserver(function (es) { inView = es[0].isIntersecting; }, { rootMargin: '20% 0px' }).observe(btn);
    function warm(to, dur) {
      if (window.gsap) window.gsap.to(heat, { v: to, duration: dur, ease: 'power2.out' });
      else heat.v = to;
    }
    btn.addEventListener('pointerenter', function () { warm(1, 0.5); });
    btn.addEventListener('pointerleave', function () { warm(0, 0.9); });

    onFrame(function (now) {
      if (!inView || doc.hidden || !per) { last = now; return; }
      if (!bw) size();
      var dt = Math.min(48, now - (last || now)); last = now;
      var h = heat.v;
      pos += per / 5200 * dt * (1 + h * 1.6);
      var p = along(pos), a = along(pos - 1.5), b = along(pos + 1.5);
      var tx = b.x - a.x, ty = b.y - a.y, len = Math.hypot(tx, ty) || 1;
      tx /= len; ty /= len;
      var nx = ty, ny = -tx;
      trail.push({ x: p.x, y: p.y, t: now });
      while (trail.length && now - trail[0].t > 400) trail.shift();
      var count = dt / 16 * (0.9 + h * 2.4);
      for (var i = 0; i < count; i++) {
        if (i > 0 && Math.random() > count - i) break;
        var along1 = 0.06 + Math.random() * 0.16, out = 0.015 + Math.random() * 0.075;
        sparks.push({ x: p.x, y: p.y, vx: tx * along1 + nx * out, vy: ty * along1 + ny * out, t: now, life: 420 + Math.random() * 620, size: 0.9 + Math.random() * 1.5 });
      }
      ctx.clearRect(0, 0, CW, CH);
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (var d = 0; d <= per; d += 6) { var q = along(d); if (d === 0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y); }
      ctx.closePath();
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(' + GLOW + ',' + (0.1 + h * 0.14).toFixed(3) + ')'; ctx.stroke();
      for (i = 1; i < trail.length; i++) {
        var A = trail[i - 1], B = trail[i], k = 1 - (now - B.t) / 400;
        if (k <= 0) continue;
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y);
        ctx.lineWidth = 2 + 10 * k * k; ctx.strokeStyle = 'rgba(' + GLOW + ',' + (0.16 * k * k * (1 + h)).toFixed(3) + ')'; ctx.stroke();
        ctx.lineWidth = 1 + 2.2 * k * k; ctx.strokeStyle = 'rgba(' + CORE + ',' + (0.5 * k * k * (1 + h * 0.5)).toFixed(3) + ')'; ctx.stroke();
      }
      for (i = sparks.length - 1; i >= 0; i--) {
        var s = sparks[i], age = now - s.t, kk = age / s.life;
        if (kk >= 1) { sparks.splice(i, 1); continue; }
        var drag = 1 - Math.pow(1 - Math.min(1, age / 900), 2);
        var sx = s.x + s.vx * age * (1 - drag * 0.55), sy = s.y + s.vy * age * (1 - drag * 0.55);
        var al = (1 - kk) * (1 - kk);
        ctx.fillStyle = 'rgba(' + CORE + ',' + (al * 0.85).toFixed(3) + ')';
        ctx.fillRect(sx - s.size / 2, sy - s.size / 2, s.size, s.size);
        ctx.fillStyle = 'rgba(' + GLOW + ',' + (al * 0.3).toFixed(3) + ')';
        ctx.fillRect(sx - s.size, sy - s.size, s.size * 2, s.size * 2);
      }
      var rad = (11 + h * 9) * (1 + 0.12 * Math.sin(now / 110));
      var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
      g.addColorStop(0, 'rgba(255,255,255,.95)');
      g.addColorStop(0.2, 'rgba(' + CORE + ',.8)');
      g.addColorStop(0.55, 'rgba(' + GLOW + ',.3)');
      g.addColorStop(1, 'rgba(' + GLOW + ',0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, Math.PI * 2); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    });
  }

  /* =====================================================================
     CURSOR · dot + trailing ring, inverted over whatever is below
     ===================================================================== */
  function initCursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) { doc.body.classList.add('cursor-touch'); return; }
    var dot = doc.createElement('div'), ring = doc.createElement('div');
    dot.className = 'cursor'; ring.className = 'cursor-ring';
    doc.body.append(dot, ring);
    var m = { x: window.innerWidth / 2, y: window.innerHeight / 2 }, f = { x: m.x, y: m.y };
    window.addEventListener('pointermove', function (e) {
      m.x = e.clientX; m.y = e.clientY; doc.body.classList.add('cursor-on');
    }, { passive: true });
    doc.addEventListener('pointerleave', function () { doc.body.classList.remove('cursor-on'); });
    onFrame(function () {
      f.x += (m.x - f.x) * 0.18; f.y += (m.y - f.y) * 0.18;
      dot.style.transform = 'translate3d(' + m.x + 'px,' + m.y + 'px,0)';
      ring.style.transform = 'translate3d(' + f.x + 'px,' + f.y + 'px,0)';
    });
    var hot = 'a,button,.project-top,input,textarea,[role="button"]';
    doc.addEventListener('pointerover', function (e) { if (e.target.closest && e.target.closest(hot)) ring.classList.add('is-near'); });
    doc.addEventListener('pointerout', function (e) { if (e.target.closest && e.target.closest(hot)) ring.classList.remove('is-near'); });
  }

  /* =====================================================================
     BOOT
     ===================================================================== */
  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
  initTexture();
  var scroll = initScroll();
  var menu = initMenu();
  var reveal = initReveal();
  var face = initFace();
  initProjects(scroll);
  initEmber();
  initCursor();
  scroll.stop();
  window.BH_SOUND = createSound();
  var reel = initReel();
  initIntro({
    sound: window.BH_SOUND,
    onBeforeEnter: function (withReel) {
      if (withReel && reel) reel.mount();
    },
    onEnter: function (withReel) {
      var toSite = function () {
        scroll.resume();
        menu.measure();
        if (face) face.measure();
        reveal.start();
      };
      if (withReel && reel) reel.play(!!(window.BH_SOUND && window.BH_SOUND.on), toSite);
      else toSite();
    }
  });
})();
