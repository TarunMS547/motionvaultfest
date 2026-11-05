/**
 * Fireworks & Particle Simulation Engine for Diwali Celebrations
 * Features: Sky Rockets, Anar (Flowerpot), Chakri (Spinner), Sparkler trails,
 * Akashdeep Lanterns, and Rangoli Confetti.
 */

class FireworksEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.rockets = [];
    this.lanterns = [];
    this.activeEmitters = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.ambientTimer = 0;

    // Palette of rich festive colors
    this.colors = [
      '#ffd700', // Gold
      '#ff9900', // Marigold orange
      '#ff0055', // Deep crimson pink
      '#00e5ff', // Peacock cyan
      '#00e676', // Emerald green
      '#ff3d00', // Vermilion
      '#e040fb', // Royal violet
      '#ffffff'  // Sparkling white
    ];

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.setupPointerInteractions();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  setupPointerInteractions() {
    let isPointerDown = false;
    let lastSparkleTime = 0;

    const handlePointerMove = (e) => {
      if (!isPointerDown) return;
      const now = performance.now();
      if (now - lastSparkleTime > 35) {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        if (clientX !== undefined && clientY !== undefined) {
          this.createSparklerParticles(clientX, clientY);
          if (window.diwaliAudio) window.diwaliAudio.playSparkle();
          lastSparkleTime = now;
        }
      }
    };

    window.addEventListener('mousedown', (e) => {
      // Don't intercept clicks inside interactive buttons or inputs
      if (e.target.closest('button, input, select, textarea, a, .diya-item, .arcade-card')) return;
      isPointerDown = true;
      this.createSparklerParticles(e.clientX, e.clientY);
      this.launchRocket(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', () => { isPointerDown = false; });
    window.addEventListener('mousemove', handlePointerMove);

    window.addEventListener('touchstart', (e) => {
      if (e.target.closest('button, input, select, textarea, a, .diya-item, .arcade-card')) return;
      isPointerDown = true;
      const touch = e.touches[0];
      this.createSparklerParticles(touch.clientX, touch.clientY);
      this.launchRocket(touch.clientX, touch.clientY);
    }, { passive: true });

    window.addEventListener('touchend', () => { isPointerDown = false; });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
  }

  // 1. Launch Rocket towards target (tx, ty)
  launchRocket(tx = Math.random() * (this.width * 0.7) + (this.width * 0.15), ty = Math.random() * (this.height * 0.4) + 60) {
    const sx = Math.random() * (this.width * 0.6) + this.width * 0.2;
    const sy = this.height + 10;
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];

    if (window.diwaliAudio) window.diwaliAudio.playRocketLaunch();

    this.rockets.push({
      x: sx,
      y: sy,
      tx: tx,
      ty: ty,
      vx: (tx - sx) / 38,
      vy: (ty - sy) / 38,
      color: color,
      life: 38,
      age: 0
    });
  }

  // 2. Explode Rocket into festive burst
  explode(x, y, baseColor) {
    if (window.diwaliAudio) window.diwaliAudio.playExplosion(1.0);
    const particleCount = 80 + Math.floor(Math.random() * 40);
    const burstColors = [baseColor, '#ffd700', '#ffffff'];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 1.5;
      const color = burstColors[Math.floor(Math.random() * burstColors.length)];

      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.012,
        size: Math.random() * 3 + 2,
        color: color,
        gravity: 0.06,
        friction: 0.97,
        sparkle: Math.random() > 0.4
      });
    }
  }

  // 3. Golden Sparkler Particles (drawn with finger/mouse)
  createSparklerParticles(x, y) {
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: Math.random() * 0.05 + 0.04,
        size: Math.random() * 2.5 + 1.5,
        color: Math.random() > 0.3 ? '#ffd700' : '#ffffff',
        gravity: 0.08,
        friction: 0.95,
        sparkle: true
      });
    }
  }

  // 4. Anar (Flowerpot Fountain) Emitter
  startAnar(x = this.width / 2, y = this.height - 40) {
    if (window.diwaliAudio) {
      window.diwaliAudio.playChakriSound();
    }
    const emitter = {
      type: 'anar',
      x: x,
      y: y,
      duration: 160,
      age: 0,
      update: () => {
        emitter.age++;
        const currentPower = Math.min(emitter.age / 20, 1) * Math.max(0, (emitter.duration - emitter.age) / 30);
        const count = Math.floor(10 * currentPower);

        for (let i = 0; i < count; i++) {
          const spread = (Math.random() - 0.5) * 2.8;
          const speed = -(Math.random() * 9 + 6);
          const color = Math.random() > 0.5 ? '#ffd700' : (Math.random() > 0.5 ? '#ff3300' : '#00e5ff');

          this.particles.push({
            x: emitter.x + (Math.random() - 0.5) * 14,
            y: emitter.y,
            vx: spread,
            vy: speed,
            alpha: 1,
            decay: Math.random() * 0.02 + 0.015,
            size: Math.random() * 3 + 2,
            color: color,
            gravity: 0.16,
            friction: 0.98,
            sparkle: true
          });
        }
        return emitter.age < emitter.duration;
      }
    };
    this.activeEmitters.push(emitter);
  }

  // 5. Chakri (Ground Spinner)
  startChakri(x = this.width / 2, y = this.height / 2 + 100) {
    if (window.diwaliAudio) window.diwaliAudio.playChakriSound();
    let angle = 0;
    const emitter = {
      type: 'chakri',
      x: x,
      y: y,
      duration: 180,
      age: 0,
      update: () => {
        emitter.age++;
        angle += 0.35;
        const radius = 25;
        const colors = ['#ffd700', '#ff0055', '#00e676', '#ff9900'];

        for (let i = 0; i < 4; i++) {
          const a = angle + (i * Math.PI / 2);
          const px = emitter.x + Math.cos(a) * radius;
          const py = emitter.y + Math.sin(a) * radius;
          const speed = 4.5 + Math.random() * 2;

          this.particles.push({
            x: px,
            y: py,
            vx: Math.cos(a + 1.2) * speed,
            vy: Math.sin(a + 1.2) * speed,
            alpha: 1,
            decay: 0.035,
            size: Math.random() * 2.8 + 1.8,
            color: colors[i],
            gravity: 0.04,
            friction: 0.96,
            sparkle: true
          });
        }
        return emitter.age < emitter.duration;
      }
    };
    this.activeEmitters.push(emitter);
  }

  // 6. Akashdeep (Sky Lantern)
  releaseLantern(x = Math.random() * (this.width * 0.7) + (this.width * 0.15)) {
    this.lanterns.push({
      x: x,
      y: this.height + 40,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(Math.random() * 1.2 + 0.8),
      size: Math.random() * 16 + 24,
      swayAngle: Math.random() * Math.PI,
      glowColor: Math.random() > 0.5 ? '#ff9900' : '#ff0055',
      alpha: 1
    });
  }

  // 7. Confetti / Petal Shower
  blastConfetti(x = this.width / 2, y = this.height * 0.3) {
    if (window.diwaliAudio) window.diwaliAudio.playExplosion(0.6);
    const count = 90;
    const colors = ['#ffd700', '#ff3366', '#ff9900', '#00e5ff', '#76ff03', '#ffffff'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        alpha: 1,
        decay: Math.random() * 0.01 + 0.008,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        gravity: 0.07,
        friction: 0.96,
        isConfetti: true,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.2
      });
    }
  }

  // Main animation frame loop
  animate(currentTime) {
    const dt = (currentTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = currentTime;

    // Fade trail effect for rich motion blur
    this.ctx.fillStyle = 'rgba(11, 2, 29, 0.22)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Subtle background ambient fireworks periodically
    this.ambientTimer += dt;
    if (this.ambientTimer > 4.5) {
      this.ambientTimer = 0;
      if (Math.random() > 0.4) {
        this.launchRocket();
      }
    }

    // 1. Update & Render Active Emitters (Anar / Chakri)
    this.activeEmitters = this.activeEmitters.filter(emitter => emitter.update());

    // 2. Update & Render Rockets
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      r.x += r.vx;
      r.y += r.vy;
      r.age++;

      // Rocket flame / sparks trail
      this.particles.push({
        x: r.x,
        y: r.y,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2 + 1,
        alpha: 0.9,
        decay: 0.05,
        size: 2.5,
        color: '#ff9900',
        gravity: 0.02,
        friction: 0.98,
        sparkle: false
      });

      // Rocket head draw
      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowColor = r.color;
      this.ctx.shadowBlur = 10;
      this.ctx.fill();

      if (r.age >= r.life) {
        this.explode(r.x, r.y, r.color);
        this.rockets.splice(i, 1);
      }
    }

    // 3. Update & Render Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);

      if (p.isConfetti) {
        p.rotation += p.rotationSpeed;
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = p.sparkle && Math.random() > 0.5 ? '#ffffff' : p.color;
        this.ctx.shadowColor = p.color;
        this.ctx.shadowBlur = p.sparkle ? 8 : 4;
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    // 4. Update & Render Sky Lanterns
    for (let i = this.lanterns.length - 1; i >= 0; i--) {
      const l = this.lanterns[i];
      l.swayAngle += 0.03;
      l.x += l.vx + Math.sin(l.swayAngle) * 0.4;
      l.y += l.vy;

      if (l.y < -60) {
        this.lanterns.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0.3, Math.min(1, l.y / (this.height * 0.4)));

      // Lantern outer glow
      const grad = this.ctx.createRadialGradient(l.x, l.y, 2, l.x, l.y, l.size * 1.4);
      grad.addColorStop(0, 'rgba(255, 230, 120, 0.95)');
      grad.addColorStop(0.4, l.glowColor);
      grad.addColorStop(1, 'transparent');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(l.x, l.y, l.size * 1.2, 0, Math.PI * 2);
      this.ctx.fill();

      // Lantern Body Shape
      this.ctx.fillStyle = 'rgba(255, 170, 0, 0.75)';
      this.ctx.strokeStyle = '#ffd700';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      const hw = l.size * 0.55;
      const hh = l.size * 0.8;
      this.ctx.roundRect(l.x - hw, l.y - hh, hw * 2, hh * 2, 6);
      this.ctx.fill();
      this.ctx.stroke();

      // Flame core
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(l.x, l.y + hh * 0.6, 3, 0, Math.PI * 2);
      this.ctx.shadowColor = '#ffd700';
      this.ctx.shadowBlur = 10;
      this.ctx.fill();

      this.ctx.restore();
    }

    requestAnimationFrame(this.animate);
  }
}

// Global Fireworks Instance
window.addEventListener('DOMContentLoaded', () => {
  window.fireworks = new FireworksEngine('fireworks-canvas');
});

