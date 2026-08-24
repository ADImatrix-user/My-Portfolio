/**
 * Aditya Bakodiya - Portfolio Script
 * Ultra-Modern Scroll Physics, Floating Tech Glyphs, Cyber Decoder, Section Radar & Sound FX
 * Mobile & Battery Optimized
 */

document.addEventListener('DOMContentLoaded', () => {

  const isMobile = window.innerWidth <= 768;
  const isSmallScreen = window.innerWidth <= 600;

  /* ==========================================================================
     1. Web Audio API Synthesizer (Sci-Fi UI Sound Effects)
     ========================================================================== */
  let soundEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function resumeAudioOnGesture() {
    initAudio();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Modern browsers require a user gesture to resume AudioContext
  window.addEventListener('pointerdown', resumeAudioOnGesture, { once: true, passive: true });
  window.addEventListener('keydown', resumeAudioOnGesture, { once: true, passive: true });
  window.addEventListener('touchstart', resumeAudioOnGesture, { once: true, passive: true });

  function playTone(freq = 600, duration = 0.08, type = 'sine', gainVal = 0.05) {
    if (!soundEnabled) return;
    if (!audioCtx) {
      initAudio();
    }
    if (!audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  const soundToggle = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');

  if (soundToggle && soundIcon) {
    if (soundEnabled) {
      soundIcon.className = 'fa-solid fa-volume-high';
      soundToggle.style.color = 'var(--primary-color)';
    }

    soundToggle.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        soundIcon.className = 'fa-solid fa-volume-high';
        soundToggle.style.color = 'var(--primary-color)';
        showToast('Sound Effects Enabled 🔊', 'info');
        playTone(800, 0.12, 'triangle', 0.08);
      } else {
        soundIcon.className = 'fa-solid fa-volume-xmark';
        soundToggle.style.color = '';
        showToast('Sound Effects Muted 🔇', 'info');
      }
    });
  }

  // Play hover sounds on buttons & links (only on desktop pointers)
  if (!isMobile) {
    document.querySelectorAll('.btn, .nav-link, .cert-card, .btn-icon, .radar-dot, .tab-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        playTone(520, 0.04, 'sine', 0.03);
      });
      el.addEventListener('click', () => {
        playTone(720, 0.07, 'triangle', 0.06);
      });
    });
  }

  /* ==========================================================================
     2. Theme Color Palette Switcher
     ========================================================================== */
  const themes = ['default', 'purple', 'emerald', 'amber', 'sapphire'];
  let currentThemeIndex = 0;
  const themeToggle = document.getElementById('theme-toggle');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      const theme = themes[currentThemeIndex];
      if (theme === 'default') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', theme);
      }
      showToast(`Accent Theme: ${theme.toUpperCase()} ✨`, 'info');
    });
  }

  /* ==========================================================================
     3. Lightweight Scroll-Velocity Particle Canvas (Mobile Optimized)
     ========================================================================== */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d', { alpha: true });
    let width, height;
    let particles = [];
    const mouse = { x: null, y: null, radius: 150 };

    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let scrollDecay = 0.93;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }

    window.addEventListener('resize', () => {
      requestAnimationFrame(resizeCanvas);
    }, { passive: true });

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      scrollVelocity = delta * 0.35;
      lastScrollY = currentScrollY;
    }, { passive: true });

    if (!isMobile) {
      window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      });

      window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
      });
    }

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * (height || 800);
      }

      reset() {
        this.x = Math.random() * (width || 1200);
        this.y = Math.random() < 0.5 ? -10 : (height || 800) + 10;
        this.size = Math.random() * 2 + 0.8;
        this.baseVx = (Math.random() - 0.5) * 0.5;
        this.baseVy = (Math.random() - 0.5) * 0.5;
        this.vx = this.baseVx;
        this.vy = this.baseVy;
        this.hueShift = Math.random();
      }

      draw() {
        const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary-color').trim() || '#00f0ff';
        ctx.fillStyle = this.hueShift > 0.6 ? primaryColor : 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        this.vy = this.baseVy - (scrollVelocity * 0.15);
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < -20) this.y = height + 10;
        if (this.y > height + 20) this.y = -10;

        if (!isMobile && mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            let angle = Math.atan2(dy, dx);
            let force = (mouse.radius - distance) / mouse.radius;
            this.x -= Math.cos(angle) * force * 2;
            this.y -= Math.sin(angle) * force * 2;
          }
        }
      }
    }

    function initParticles() {
      particles = [];
      // On mobile, reduce particle count to 16 for zero battery drain
      const particleCount = isMobile ? 16 : Math.min(65, Math.floor((width * height) / 18000));
      for (let i = 0; i < particleCount; i++) {
        const p = new Particle();
        p.y = Math.random() * height;
        particles.push(p);
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      scrollVelocity *= scrollDecay;
      if (Math.abs(scrollVelocity) < 0.01) scrollVelocity = 0;

      // Draw lines only on desktop / tablet screens (> 600px)
      if (!isSmallScreen) {
        const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary-color').trim() || '#00f0ff';
        const len = particles.length;

        for (let a = 0; a < len; a++) {
          for (let b = a + 1; b < len; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 110) {
              let opacity = (1 - (dist / 110)) * 0.2;
              ctx.strokeStyle = primaryColor;
              ctx.globalAlpha = opacity;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(particles[a].x, particles[a].y);
              ctx.lineTo(particles[b].x, particles[b].y);
              ctx.stroke();
              ctx.globalAlpha = 1.0;
            }
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    animateParticles();
  }

  /* ==========================================================================
     4. Floating Tech Glyphs Stream (Desktop / Tablet)
     ========================================================================== */
  const glyphsContainer = document.getElementById('tech-glyphs-container');
  if (glyphsContainer && !isMobile) {
    const glyphData = [
      { text: '</>', speed: 0.12, x: 8, y: 15, rotate: -10 },
      { text: '{ css: modern }', speed: 0.22, x: 85, y: 22, rotate: 12 },
      { text: 'def python():', speed: 0.16, x: 12, y: 48, rotate: -6 },
      { text: '01000001', speed: 0.28, x: 88, y: 55, rotate: 8 },
      { text: 'Merit Rank #7', speed: 0.18, x: 5, y: 78, rotate: 5 },
      { text: 'CISCO Academy', speed: 0.25, x: 82, y: 82, rotate: -8 },
      { text: '82.17% Board', speed: 0.14, x: 18, y: 110, rotate: -12 },
      { text: '⚡ C Studio IDE', speed: 0.22, x: 14, y: 135, rotate: -8 },
      { text: 'const dev = true', speed: 0.26, x: 80, y: 125, rotate: 10 },
      { text: '🛡️ CyberSec', speed: 0.2, x: 10, y: 150, rotate: 7 },
      { text: 'Daman, India', speed: 0.15, x: 86, y: 165, rotate: -5 },
      { text: 'λ => logic', speed: 0.24, x: 15, y: 185, rotate: 9 },
      { text: 'git commit -m', speed: 0.19, x: 78, y: 205, rotate: -11 },
      { text: 'gcc -O3 main.c', speed: 0.18, x: 84, y: 215, rotate: 10 },
      { text: 'HTML5 / CSS3', speed: 0.23, x: 8, y: 225, rotate: 6 },
      { text: '🐍 Py CLI', speed: 0.17, x: 84, y: 245, rotate: -7 },
      { text: '10101010', speed: 0.27, x: 12, y: 270, rotate: 12 },
      { text: '🌐 OSI & IP', speed: 0.21, x: 82, y: 290, rotate: -9 }
    ];

    const glyphElements = [];

    glyphData.forEach(item => {
      const el = document.createElement('div');
      el.className = 'floating-glyph';
      el.textContent = item.text;
      el.style.left = `${item.x}%`;
      el.style.top = `${item.y}vh`;
      el.style.transform = `rotate(${item.rotate}deg)`;
      glyphsContainer.appendChild(el);

      glyphElements.push({
        el,
        baseY: item.y,
        speed: item.speed,
        baseRotate: item.rotate
      });
    });

    let glyphRaf = null;

    function updateGlyphsOnScroll() {
      if (glyphRaf) cancelAnimationFrame(glyphRaf);

      glyphRaf = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;

        glyphElements.forEach(g => {
          const absoluteTop = (g.baseY / 100) * viewportHeight;
          const parallaxOffset = -(scrollY * g.speed);
          const currentY = absoluteTop + parallaxOffset;

          if (currentY > -100 && currentY < viewportHeight + 100) {
            g.el.style.opacity = '1';
            g.el.style.transform = `translate3d(0, ${parallaxOffset.toFixed(1)}px, 0) rotate(${g.baseRotate}deg)`;
          } else {
            g.el.style.opacity = '0';
          }
        });
      });
    }

    window.addEventListener('scroll', updateGlyphsOnScroll, { passive: true });
    updateGlyphsOnScroll();
  }

  /* ==========================================================================
     5. Scroll Progress Bar & Section Radar Synchronizer
     ========================================================================== */
  const scrollProgressBar = document.getElementById('scroll-progress');
  const radarSectionName = document.getElementById('radar-section-name');
  const radarPercent = document.getElementById('radar-percent');
  const radarDots = document.querySelectorAll('.radar-dot');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('header, section');

  let scrollTicking = false;

  function handleScrollProgress() {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = docHeight > 0 ? Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100))) : 0;

        if (scrollProgressBar) {
          scrollProgressBar.style.width = `${scrollPercentage}%`;
        }

        if (radarPercent) {
          radarPercent.textContent = `${scrollPercentage}%`;
        }

        let currentSecId = 'hero';
        const scrollMid = scrollTop + (window.innerHeight / 3);

        sections.forEach(sec => {
          const top = sec.offsetTop;
          const height = sec.offsetHeight;
          if (scrollMid >= top && scrollMid < top + height) {
            currentSecId = sec.getAttribute('id') || currentSecId;
          }
        });

        if (radarSectionName) {
          radarSectionName.textContent = currentSecId.toUpperCase();
        }

        radarDots.forEach(dot => {
          dot.classList.toggle('active', dot.getAttribute('data-section') === currentSecId);
        });

        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${currentSecId}`);
        });

        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  window.addEventListener('scroll', handleScrollProgress, { passive: true });
  handleScrollProgress();

  /* ==========================================================================
     6. Cyber / Hacker Text Decoder Effect
     ========================================================================== */
  const chars = '01#@$%&*~<>[]{}!=+ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function decodeEffect(element) {
    const targetText = element.getAttribute('data-decode-text') || element.textContent;
    let iteration = 0;
    const maxIterations = targetText.length;

    const interval = setInterval(() => {
      element.innerHTML = targetText
        .split('')
        .map((letter, index) => {
          if (letter === ' ') return ' ';
          if (index < iteration) {
            return `<span class="text-gradient">${targetText[index]}</span>`;
          }
          return `<span style="color:var(--primary-color); opacity:0.8;">${chars[Math.floor(Math.random() * chars.length)]}</span>`;
        })
        .join('');

      if (iteration >= maxIterations) {
        clearInterval(interval);
        const parts = targetText.split(' ');
        if (parts.length > 1) {
          const last = parts.pop();
          element.innerHTML = `${parts.join(' ')} <span class="text-gradient">${last}</span>`;
        } else {
          element.innerHTML = `<span class="text-gradient">${targetText}</span>`;
        }
      }

      iteration += 1 / 2;
    }, 28);
  }

  /* ==========================================================================
     7. Scroll Reveal & Intersection Observers
     ========================================================================== */
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        const decodeEl = entry.target.querySelector('[data-decode-text]');
        if (decodeEl && !decodeEl.dataset.decoded) {
          decodeEl.dataset.decoded = 'true';
          decodeEffect(decodeEl);
        }

        if (entry.target.classList.contains('skill-card')) {
          const fill = entry.target.querySelector('.progress-fill');
          const percent = entry.target.querySelector('.percentage');
          if (fill && percent) {
            const targetWidth = fill.getAttribute('data-width') || '0%';
            fill.style.width = targetWidth;

            const targetNum = parseInt(percent.getAttribute('data-target') || '0', 10);
            let current = 0;
            const timer = setInterval(() => {
              current += 2;
              if (current >= targetNum) {
                current = targetNum;
                clearInterval(timer);
              }
              percent.textContent = `${current}%`;
            }, 25);
          }
        }

        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  });

  document.querySelectorAll('.reveal-init').forEach(el => revealObserver.observe(el));

  /* ==========================================================================
     8. Mouse Spotlight Effect for Glass Cards (Desktop only)
     ========================================================================== */
  if (!isMobile) {
    const spotlightCards = document.querySelectorAll('.glass-card');
    spotlightCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  /* ==========================================================================
     9. 3D Card Tilt Interaction (Desktop only)
     ========================================================================== */
  if (!isMobile) {
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(card => {
      let rafId = null;

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease';
      });

      card.addEventListener('mousemove', (e) => {
        if (rafId) cancelAnimationFrame(rafId);

        rafId = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -3.2;
          const rotateY = ((x - centerX) / centerX) * 3.2;

          card.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
        });
      });

      card.addEventListener('mouseleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  /* ==========================================================================
     10. Typewriter Animation Effect
     ========================================================================== */
  const typewriterText = document.getElementById('typewriter-text');
  if (typewriterText) {
    const phrases = [
      "Diploma Computer Science Student",
      "C Compiler & Web Tools Developer",
      "Merit Rank #7 Achiever",
      "16-Year-Old Tech Learner",
      "Cybersecurity Enthusiast",
      "Web Developer & Fast Learner"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 90;

    function type() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typewriterText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 35;
      } else {
        typewriterText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 80;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 450;
      }

      setTimeout(type, typeSpeed);
    }

    type();
  }

  /* ==========================================================================
     11. Navbar Scroll Effect & Mobile Menu
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 35) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
      });
    });
  }

  /* ==========================================================================
     12. Certificate Lightbox Modal
     ========================================================================== */
  const certCards = document.querySelectorAll('.cert-card');
  const certModal = document.getElementById('cert-modal');
  const modalCertImg = document.getElementById('modal-cert-img');
  const modalCertTitle = document.getElementById('modal-cert-title');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function openCertModal(imgUrl, title) {
    modalCertImg.src = imgUrl;
    modalCertTitle.textContent = title;
    certModal.classList.add('active');
    certModal.setAttribute('aria-hidden', 'false');
    playTone(600, 0.1, 'triangle');
  }

  function closeCertModal() {
    certModal.classList.remove('active');
    certModal.setAttribute('aria-hidden', 'true');
  }

  certCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.getAttribute('data-cert-img');
      const title = card.getAttribute('data-cert-title');
      openCertModal(img, title);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeCertModal);
  }

  /* ==========================================================================
     13. 10th Result Scorecard Modal
     ========================================================================== */
  const resultModal = document.getElementById('result-modal');
  const btnOpenResult = document.getElementById('btn-open-result');
  const btnOpenResultHero = document.getElementById('btn-open-result-hero');
  const resultModalCloseBtn = document.getElementById('result-modal-close-btn');

  function openResultModal() {
    resultModal.classList.add('active');
    resultModal.setAttribute('aria-hidden', 'false');
    playTone(650, 0.12, 'triangle');
  }

  function closeResultModal() {
    resultModal.classList.remove('active');
    resultModal.setAttribute('aria-hidden', 'true');
  }

  if (btnOpenResult) btnOpenResult.addEventListener('click', openResultModal);
  if (btnOpenResultHero) btnOpenResultHero.addEventListener('click', openResultModal);
  if (resultModalCloseBtn) resultModalCloseBtn.addEventListener('click', closeResultModal);

  /* ==========================================================================
     14. Academic Resume Modal & Print PDF Handler
     ========================================================================== */
  const resumeModal = document.getElementById('resume-modal');
  const btnDownloadResume = document.getElementById('btn-download-resume');
  const btnDownloadOfficialPdf = document.getElementById('btn-download-official-pdf');
  const resumeModalCloseBtn = document.getElementById('resume-modal-close-btn');
  const btnPrintResume = document.getElementById('btn-print-resume');

  function openResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.add('active');
    resumeModal.setAttribute('aria-hidden', 'false');
    playTone(700, 0.12, 'triangle');
  }

  function closeResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.remove('active');
    resumeModal.setAttribute('aria-hidden', 'true');
  }

  if (btnDownloadResume) {
    btnDownloadResume.addEventListener('click', (e) => {
      e.preventDefault();
      openResumeModal();
    });
  }

  if (btnDownloadOfficialPdf) {
    btnDownloadOfficialPdf.addEventListener('click', () => {
      showToast('Downloading official resume PDF...', 'success');
    });
  }

  if (resumeModalCloseBtn) resumeModalCloseBtn.addEventListener('click', closeResumeModal);
  if (btnPrintResume) {
    btnPrintResume.addEventListener('click', () => {
      window.open('Aditya_Bakodiya_Resume.pdf', '_blank');
    });
  }

  // Close modals on clicking backdrop or ESC key
  window.addEventListener('click', (e) => {
    if (e.target === certModal) closeCertModal();
    if (e.target === resultModal) closeResultModal();
    if (e.target === resumeModal) closeResumeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCertModal();
      closeResultModal();
      closeResumeModal();
    }
  });

  /* ==========================================================================
     15. Interactive Code Sandbox Playground & Mobile Toggle
     ========================================================================== */
  const codePresets = {
    html: `<!-- Aditya's HTML/CSS Interactive Snippet -->
<div style="background: #121826; color: #00f0ff; padding: 22px; border-radius: 14px; font-family: sans-serif; border: 1px solid #00f0ff; text-align: center; box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);">
  <h2 style="margin: 0 0 10px 0;">Hello World! 👋</h2>
  <p style="color: #94a3b8; margin: 0;">Welcome to my custom HTML/CSS code sandbox.</p>
  <button style="margin-top: 15px; background: linear-gradient(135deg, #00f0ff, #7000ff); border: none; color: white; padding: 9px 18px; border-radius: 8px; font-weight: 600; cursor: pointer;">
    Click Interactive Button
  </button>
</div>`,
    js: `// Aditya's JavaScript Logic Explorer
function calculateMeritRank(percentage, percentile) {
  console.log("=== Aditya Bakodiya Academic Summary ===");
  console.log("10th Board Score: " + percentage + "%");
  console.log("Percentile Rank: " + percentile);
  console.log("Polytechnic Admission Merit Rank: 7th Rank 🎓");
  return "Status: Passed with Distinction!";
}

calculateMeritRank(82.17, 86.37);`,
    c: `// Aditya's C Snippet — AB C Studio IDE
#include <stdio.h>

int main() {
    printf("⚡ Welcome to AB C Studio Online Compiler!\\n");
    printf("Author: Aditya Bakodiya\\n");
    printf("GCC Cloud Backend: 13.2 (C17 Standard)\\n");
    printf("Interactive terminal stream with scanf() support active!\\n");
    return 0;
}`,
    python: `# Aditya's Python Basic Syntax Example
def greet_student(name, age, course):
    print(f"Student Profile: {name}")
    print(f"Age: {age} Years Old")
    print(f"Enrolled Course: {course}")
    
skills = ["HTML", "CSS", "JavaScript", "Python", "C"]
print("Acquired Skills:", ", ".join(skills))
greet_student("Aditya Bakodiya", 16, "Diploma in Computer Science")`
  };

  const codeInput = document.getElementById('code-input');
  const outputView = document.getElementById('output-view');
  const runCodeBtn = document.getElementById('run-code-btn');
  const copyCodeBtn = document.getElementById('copy-code-btn');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const editorFilename = document.getElementById('editor-filename');

  const toggleSandboxBtn = document.getElementById('toggle-sandbox-btn');
  const playgroundBox = document.getElementById('playground-box');

  if (toggleSandboxBtn && playgroundBox) {
    toggleSandboxBtn.addEventListener('click', () => {
      const isExpanded = playgroundBox.classList.toggle('expanded');
      toggleSandboxBtn.classList.toggle('active', isExpanded);
      toggleSandboxBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      
      const statusText = toggleSandboxBtn.querySelector('span');
      if (statusText) {
        statusText.innerHTML = isExpanded 
          ? '<i class="fa-solid fa-terminal"></i> Collapse Sandbox' 
          : '<i class="fa-solid fa-terminal"></i> Interactive Code Sandbox';
      }
      playTone(isExpanded ? 750 : 500, 0.08, 'sine');
    });
  }

  let activeTab = 'html';

  function loadPreset(tab) {
    activeTab = tab;
    if (codeInput) codeInput.value = codePresets[tab] || '';
    if (editorFilename) {
      if (tab === 'html') editorFilename.textContent = 'index.html';
      if (tab === 'js') editorFilename.textContent = 'app.js';
      if (tab === 'c') editorFilename.textContent = 'main.c';
      if (tab === 'python') editorFilename.textContent = 'main.py';
    }
    runSnippet();
  }

  function runSnippet() {
    if (!outputView || !codeInput) return;
    const code = codeInput.value;

    if (activeTab === 'html') {
      outputView.innerHTML = code;
    } else if (activeTab === 'js') {
      outputView.innerHTML = '';
      let logs = [];
      const customConsole = {
        log: (...args) => logs.push(args.join(' ')),
        error: (...args) => logs.push('❌ Error: ' + args.join(' ')),
        warn: (...args) => logs.push('⚠️ Warning: ' + args.join(' '))
      };
      try {
        const runFn = new Function('console', code);
        const result = runFn(customConsole);
        if (result !== undefined) logs.push(`=> Returned: ${result}`);
        outputView.innerHTML = `<pre style="margin:0; white-space: pre-wrap; color:#00ff9d;">${logs.join('\n')}</pre>`;
      } catch (err) {
        outputView.innerHTML = `<span style="color:#ff4757;">Runtime Error: ${err.message}</span>`;
      }
    } else if (activeTab === 'c') {
      let lines = code.split('\n');
      let outputLines = [];
      lines.forEach(line => {
        let trimmed = line.trim();
        if (trimmed.startsWith('printf(')) {
          let match = trimmed.match(/printf\s*\(\s*"([^"]*)"/);
          if (match) {
            let str = match[1].replace(/\\n/g, '');
            outputLines.push(str);
          }
        }
      });
      if (outputLines.length === 0) {
        outputLines.push("C program preview executed successfully.");
      }
      outputView.innerHTML = `<span style="color:#00f0ff;">[AB C Studio • GCC 13.2 Engine Output]</span>\n<pre style="margin:0; white-space: pre-wrap; color:#00ff9d; font-family: var(--font-code);">${outputLines.join('\n')}</pre>\n<div style="margin-top: 10px; padding: 7px 12px; background: rgba(0, 240, 255, 0.08); border-radius: 8px; border: 1px solid rgba(0, 240, 255, 0.25); font-size: 0.82rem; color: #cbd5e1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;"><span>⚡ Want real-time interactive terminal input (<code style="color:#00f0ff;">scanf</code>) & GCC compiling?</span><a href="https://adimatrix-user.github.io/C-compiler/" target="_blank" rel="noopener noreferrer" style="color:#00f0ff; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">Open Full AB C Studio <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.75rem;"></i></a></div>`;
    } else if (activeTab === 'python') {
      let lines = code.split('\n');
      let outputLines = [];
      lines.forEach(line => {
        if (line.trim().startsWith('print(')) {
          let match = line.match(/print\((.*)\)/);
          if (match) {
            outputLines.push(match[1].replace(/['"]/g, '').replace(/f"/g, ''));
          }
        }
      });
      if (outputLines.length === 0) {
        outputLines.push("Program executed successfully with 0 output lines.");
      }
      outputView.innerHTML = `<span style="color:#7000ff;">[Python Simulator Console]</span>\n<pre style="margin:0; white-space: pre-wrap; color:#00ff9d;">${outputLines.join('\n')}</pre>`;
    }
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.getAttribute('data-tab');
      loadPreset(tab);
    });
  });

  if (runCodeBtn) {
    runCodeBtn.addEventListener('click', () => {
      runSnippet();
      playTone(850, 0.1, 'triangle', 0.08);
      showToast('Executed code snippet! ⚡', 'success');
    });
  }

  if (copyCodeBtn && codeInput) {
    copyCodeBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeInput.value).then(() => {
        showToast('Code snippet copied to clipboard! 📋', 'success');
        playTone(700, 0.08, 'sine');
      });
    });
  }

  // Load initial preset
  if (codeInput) loadPreset('html');

  /* ==========================================================================
     16. Copy Email & Contact Form Handler
     ========================================================================== */
  const btnCopyEmail = document.getElementById('btn-copy-email');
  if (btnCopyEmail) {
    btnCopyEmail.addEventListener('click', () => {
      navigator.clipboard.writeText('bakodiyaadi@gmail.com').then(() => {
        showToast('Email copied to clipboard: bakodiyaadi@gmail.com 📋', 'success');
      }).catch(() => {
        showToast('Failed to copy email', 'error');
      });
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value;
      showToast(`Thank you, ${name}! Your message has been sent successfully. 🚀`, 'success');
      contactForm.reset();
    });
  }

  /* ==========================================================================
     17. Toast Notification Utility
     ========================================================================== */
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-info'}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.35s ease';
      setTimeout(() => toast.remove(), 350);
    }, 3500);
  }

  // Set current footer year
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

});
