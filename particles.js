/**
 * Potencial Lar e Construção
 * Premium 3D Particle / Geometry Hero Background
 * Construction-themed floating geometries with connections
 */

(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: -9999, y: -9999, radius: 180 };
  let animationId;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  // ============================================
  // Configuration
  // ============================================
  const CONFIG = {
    particleCount: 70,
    particleCountMobile: 35,
    maxConnectionDist: 160,
    mouseInfluence: 0.02,
    baseSpeed: 0.3,
    colors: [
      'rgba(249, 115, 22, 0.7)',   // orange-500
      'rgba(251, 146, 60, 0.5)',   // orange-400
      'rgba(253, 186, 116, 0.4)', // orange-300
      'rgba(234, 179, 8, 0.5)',    // yellow-500
      'rgba(250, 204, 21, 0.4)',   // yellow-400
      'rgba(255, 255, 255, 0.15)', // white subtle
      'rgba(249, 115, 22, 0.3)',   // orange dim
    ],
    connectionColor: 'rgba(249, 115, 22, ',
    glowColor: 'rgba(249, 115, 22, 0.08)',
    shapes: ['hexagon', 'triangle', 'square', 'diamond', 'circle', 'cross'],
  };

  // ============================================
  // Resize Canvas
  // ============================================
  function resize() {
    const hero = canvas.parentElement;
    width = hero.offsetWidth;
    height = hero.offsetHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ============================================
  // Particle Class
  // ============================================
  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.z = Math.random() * 3 + 0.5; // depth layer (0.5 to 3.5)
    this.size = (Math.random() * 12 + 6) / this.z;
    this.baseSize = this.size;
    this.vx = (Math.random() - 0.5) * CONFIG.baseSpeed;
    this.vy = (Math.random() - 0.5) * CONFIG.baseSpeed;
    this.vz = (Math.random() - 0.5) * 0.005;
    this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
    this.shape = CONFIG.shapes[Math.floor(Math.random() * CONFIG.shapes.length)];
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.opacity = (Math.random() * 0.5 + 0.3) / this.z;
    this.baseOpacity = this.opacity;
    this.pulseOffset = Math.random() * Math.PI * 2;
    this.pulseSpeed = Math.random() * 0.02 + 0.005;
  };

  Particle.prototype.update = function (time) {
    // Movement
    this.x += this.vx / this.z;
    this.y += this.vy / this.z;
    this.z += this.vz;

    // Rotation
    this.rotation += this.rotationSpeed / this.z;

    // Pulse effect
    var pulse = Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.3 + 1;
    this.size = this.baseSize * pulse;
    this.opacity = this.baseOpacity * (0.7 + pulse * 0.3);

    // Depth bounds
    if (this.z < 0.5 || this.z > 3.5) {
      this.vz *= -1;
    }

    // Mouse interaction
    var dx = this.x - mouse.x;
    var dy = this.y - mouse.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < mouse.radius) {
      var force = (1 - dist / mouse.radius) * CONFIG.mouseInfluence;
      this.x += dx * force * 3;
      this.y += dy * force * 3;
      this.opacity = Math.min(1, this.opacity + force * 5);
      this.size = this.baseSize * (1 + force * 8);
    }

    // Wrap around edges
    if (this.x < -50) this.x = width + 50;
    if (this.x > width + 50) this.x = -50;
    if (this.y < -50) this.y = height + 50;
    if (this.y > height + 50) this.y = -50;
  };

  Particle.prototype.draw = function () {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;

    var s = this.size;

    switch (this.shape) {
      case 'hexagon':
        drawHexagon(ctx, s);
        break;
      case 'triangle':
        drawTriangle(ctx, s);
        break;
      case 'square':
        drawSquare(ctx, s);
        break;
      case 'diamond':
        drawDiamond(ctx, s);
        break;
      case 'circle':
        drawCircle(ctx, s);
        break;
      case 'cross':
        drawCross(ctx, s);
        break;
    }

    // Fill with glow
    ctx.fillStyle = this.color;
    ctx.fill();

    // Stroke outline
    ctx.strokeStyle = this.color.replace(/[\d.]+\)$/, (this.opacity * 0.6).toFixed(2) + ')');
    ctx.lineWidth = 0.8 / this.z;
    ctx.stroke();

    ctx.restore();
  };

  // ============================================
  // Shape Drawing Functions
  // ============================================
  function drawHexagon(ctx, s) {
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      var angle = (Math.PI / 3) * i - Math.PI / 6;
      var method = i === 0 ? 'moveTo' : 'lineTo';
      ctx[method](Math.cos(angle) * s, Math.sin(angle) * s);
    }
    ctx.closePath();
  }

  function drawTriangle(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(-s * 0.866, s * 0.5);
    ctx.lineTo(s * 0.866, s * 0.5);
    ctx.closePath();
  }

  function drawSquare(ctx, s) {
    ctx.beginPath();
    ctx.rect(-s * 0.7, -s * 0.7, s * 1.4, s * 1.4);
    ctx.closePath();
  }

  function drawDiamond(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s * 0.6, 0);
    ctx.lineTo(0, s);
    ctx.lineTo(-s * 0.6, 0);
    ctx.closePath();
  }

  function drawCircle(ctx, s) {
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.7, 0, Math.PI * 2);
    ctx.closePath();
  }

  function drawCross(ctx, s) {
    var w = s * 0.25;
    ctx.beginPath();
    ctx.moveTo(-w, -s * 0.7);
    ctx.lineTo(w, -s * 0.7);
    ctx.lineTo(w, -w);
    ctx.lineTo(s * 0.7, -w);
    ctx.lineTo(s * 0.7, w);
    ctx.lineTo(w, w);
    ctx.lineTo(w, s * 0.7);
    ctx.lineTo(-w, s * 0.7);
    ctx.lineTo(-w, w);
    ctx.lineTo(-s * 0.7, w);
    ctx.lineTo(-s * 0.7, -w);
    ctx.lineTo(-w, -w);
    ctx.closePath();
  }

  // ============================================
  // Draw Connections Between Particles
  // ============================================
  function drawConnections() {
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var p1 = particles[i];
        var p2 = particles[j];

        // Only connect particles in similar depth layers
        if (Math.abs(p1.z - p2.z) > 1.5) continue;

        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var maxDist = CONFIG.maxConnectionDist / ((p1.z + p2.z) / 2);

        if (dist < maxDist) {
          var opacity = (1 - dist / maxDist) * 0.2;
          opacity = opacity / ((p1.z + p2.z) / 3);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = CONFIG.connectionColor + opacity.toFixed(3) + ')';
          ctx.lineWidth = (1 - dist / maxDist) * 1.2 / ((p1.z + p2.z) / 2);
          ctx.stroke();
        }
      }
    }
  }

  // ============================================
  // Draw ambient glow spots
  // ============================================
  function drawAmbientGlow(time) {
    // Large floating glow orbs
    var glows = [
      { x: width * 0.15, y: height * 0.3, r: 250, speed: 0.0003 },
      { x: width * 0.75, y: height * 0.6, r: 300, speed: 0.0005 },
      { x: width * 0.5, y: height * 0.15, r: 200, speed: 0.0004 },
    ];

    glows.forEach(function (g) {
      var offsetX = Math.sin(time * g.speed) * 60;
      var offsetY = Math.cos(time * g.speed * 0.7) * 40;

      var gradient = ctx.createRadialGradient(
        g.x + offsetX, g.y + offsetY, 0,
        g.x + offsetX, g.y + offsetY, g.r
      );
      gradient.addColorStop(0, 'rgba(249, 115, 22, 0.06)');
      gradient.addColorStop(0.5, 'rgba(249, 115, 22, 0.02)');
      gradient.addColorStop(1, 'rgba(249, 115, 22, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    });
  }

  // ============================================
  // Draw grid lines (subtle construction grid)
  // ============================================
  function drawGrid(time) {
    ctx.save();
    ctx.globalAlpha = 0.03;
    ctx.strokeStyle = 'rgba(249, 115, 22, 1)';
    ctx.lineWidth = 0.5;

    var gridSize = 80;
    var offsetX = (time * 0.01) % gridSize;
    var offsetY = (time * 0.008) % gridSize;

    // Vertical lines
    for (var x = -gridSize + offsetX; x < width + gridSize; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (var y = -gridSize + offsetY; y < height + gridSize; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.restore();
  }

  // ============================================
  // Animation Loop
  // ============================================
  function animate(time) {
    ctx.clearRect(0, 0, width, height);

    // Background grid (very subtle)
    drawGrid(time);

    // Ambient glow
    drawAmbientGlow(time);

    // Update & draw particles
    particles.forEach(function (p) {
      p.update(time);
    });

    // Draw connections first (behind particles)
    drawConnections();

    // Draw particles sorted by depth (far to near)
    particles.sort(function (a, b) { return b.z - a.z; });
    particles.forEach(function (p) {
      p.draw();
    });

    animationId = requestAnimationFrame(animate);
  }

  // ============================================
  // Initialize
  // ============================================
  function init() {
    resize();

    var count = width < 768
      ? CONFIG.particleCountMobile
      : CONFIG.particleCount;

    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    if (animationId) cancelAnimationFrame(animationId);
    animate(0);
  }

  // ============================================
  // Event Listeners
  // ============================================
  var resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      init();
    }, 250);
  });

  // Mouse tracking (only in hero area)
  var heroSection = canvas.parentElement;

  heroSection.addEventListener('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  heroSection.addEventListener('mouseleave', function () {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Touch support
  heroSection.addEventListener('touchmove', function (e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.touches[0].clientX - rect.left;
    mouse.y = e.touches[0].clientY - rect.top;
  }, { passive: true });

  heroSection.addEventListener('touchend', function () {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Reduce animation when tab is not visible
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (animationId) cancelAnimationFrame(animationId);
    } else {
      animate(performance.now());
    }
  });

  // Start
  init();

})();
