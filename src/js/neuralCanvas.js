/* ==========================================================================
   CLIENTARA AI — INTERACTIVE NEURAL PARTICLE CANVAS
   High-performance cybernetic particle cosmos with mouse physics
   ========================================================================== */

export class NeuralCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = {
      x: null,
      y: null,
      radius: 180,
      isHovered: false
    };

    this.colors = [
      'rgba(0, 212, 255, ',    // Cyan
      'rgba(0, 102, 255, ',    // Electric Blue
      'rgba(139, 92, 246, ',   // Violet
      'rgba(52, 211, 153, '    // Mint
    ];

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.addEventListeners();
    this.animate();
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = this.canvas.parentElement.clientWidth;
    this.height = this.canvas.parentElement.clientHeight;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(this.dpr, this.dpr);
  }

  createParticles() {
    this.particles = [];
    // Adjust density based on screen size
    const count = Math.floor((this.width * this.height) / 12000);
    const particleCount = Math.min(Math.max(count, 50), 120);

    for (let i = 0; i < particleCount; i++) {
      const colorPrefix = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1.2,
        baseRadius: Math.random() * 2 + 1.2,
        colorPrefix: colorPrefix,
        alpha: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseVal: Math.random() * Math.PI * 2
      });
    }
  }

  addEventListeners() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });

    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.isHovered = true;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
      this.mouse.isHovered = false;
    });

    // Touch device support
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.touches[0].clientX - rect.left;
        this.mouse.y = e.touches[0].clientY - rect.top;
        this.mouse.isHovered = true;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.mouse.x = null;
      this.mouse.y = null;
      this.mouse.isHovered = false;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update & draw particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce on boundaries
      if (p.x < 0 || p.x > this.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.height) p.vy *= -1;

      // Subtle breathing pulse
      p.pulseVal += p.pulseSpeed;
      const currentRadius = p.baseRadius + Math.sin(p.pulseVal) * 0.6;

      // Mouse interaction
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          const angle = Math.atan2(dy, dx);
          // Gentle attraction with spring rebound
          p.x -= Math.cos(angle) * force * 1.8;
          p.y -= Math.sin(angle) * force * 1.8;
        }
      }

      // Draw particle dot with glow
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, Math.max(currentRadius, 0.5), 0, Math.PI * 2);
      this.ctx.fillStyle = `${p.colorPrefix}${p.alpha})`;
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = `${p.colorPrefix}0.8)`;
      this.ctx.fill();
      this.ctx.shadowBlur = 0; // Reset shadow

      // Connect near particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 135;

        if (dist < maxDist) {
          const lineAlpha = (1 - dist / maxDist) * 0.22;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(0, 212, 255, ${lineAlpha})`;
          this.ctx.lineWidth = 0.85;
          this.ctx.stroke();
        }
      }

      // Connect to mouse cursor
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius) {
          const lineAlpha = (1 - dist / this.mouse.radius) * 0.38;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = `rgba(0, 212, 255, ${lineAlpha})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}
