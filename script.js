/**
 * Aditya Bakodiya - Portfolio Script
 * Interactive Canvas, Typewriter, Modals, 3D Card Tilt, Code Sandbox & Sound Effects
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Web Audio API Synthesizer (UI Sound Effects)
     ========================================================================== */
  let soundEnabled = false;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function playTone(freq = 600, duration = 0.08, type = 'sine') {
    if (!soundEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.log('Audio playback error:', e);
    }
  }

  const soundToggle = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        soundIcon.className = 'fa-solid fa-volume-high';
        soundToggle.style.color = 'var(--primary-color)';
        showToast('Sound Effects Enabled 🔊', 'info');
        playTone(800, 0.12, 'triangle');
      } else {
        soundIcon.className = 'fa-solid fa-volume-xmark';
        soundToggle.style.color = '';
        showToast('Sound Effects Muted 🔇', 'info');
      }
    });
  }

  // Play hover sounds on buttons & links
  document.querySelectorAll('.btn, .nav-link, .cert-card, .btn-icon').forEach(el => {
    el.addEventListener('mouseenter', () => {
      playTone(450, 0.05, 'sine');
    });
    el.addEventListener('click', () => {
      playTone(650, 0.08, 'triangle');
    });
  });

  /* ==========================================================================
     2. Theme Color Palette Switcher
     ========================================================================== */
  const themes = ['default', 'purple', 'emerald', 'amber'];
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
     3. Particle Canvas Constellation Background
     ========================================================================== */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const mouse = { x: null, y: null, radius: 150 };

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
      }

      draw() {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse attraction / repelling effect
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            let angle = Math.atan2(dy, dx);
            let force = (mouse.radius - distance) / mouse.radius;
            this.x -= Math.cos(angle) * force * 3;
            this.y -= Math.sin(angle) * force * 3;
          }
        }
      }
    }

    function initParticles() {
      particles = [];
      const particleCount = Math.floor((width * height) / 14000);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connect particles
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            let opacity = 1 - (dist / 110);
            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.15})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
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
     4. Typewriter Animation Effect
     ========================================================================== */
  const typewriterText = document.getElementById('typewriter-text');
  if (typewriterText) {
    const phrases = [
      " Diploma Computer Science Student",
      "16-Year-Old Tech Learner",
      "Future Software Engineer",
      "Cybersecurity Enthusiast",
      "Web Developer & Fast Learner"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typewriterText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
      } else {
        typewriterText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 90;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000; // Pause at full text
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    }

    type();
  }

  /* ==========================================================================
     5. Ultra-Soft & Smooth 3D Card Tilt Interaction
     ========================================================================== */
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    let rafId = null;

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.4s cubic-bezier(0.1, 0.8, 0.2, 1), border-color 0.3s ease, box-shadow 0.3s ease';
    });

    card.addEventListener('mousemove', (e) => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Soft, gentle max tilt angle (3deg max)
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;

        card.style.transition = 'transform 0.25s cubic-bezier(0.1, 0.8, 0.2, 1)';
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.012, 1.012, 1.012)`;
      });
    });

    card.addEventListener('mouseleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transition = 'transform 0.6s cubic-bezier(0.1, 0.8, 0.2, 1), border-color 0.3s ease, box-shadow 0.3s ease';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  /* ==========================================================================
     6. Navbar Scroll Effect & Mobile Menu
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy for navigation links
    const sections = document.querySelectorAll('section, header');
    let currentSection = '';

    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentSection = sec.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

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
     7. Certificate Lightbox Modal
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
     8. 10th Result Scorecard Modal
     ========================================================================== */
  const resultModal = document.getElementById('result-modal');
  const btnOpenResult = document.getElementById('btn-open-result');
  const btnOpenResultHero = document.getElementById('btn-open-result-hero');
  const resultModalCloseBtn = document.getElementById('result-modal-close-btn');

  function openResultModal() {
    resultModal.classList.add('active');
    resultModal.setAttribute('aria-hidden', 'false');
  }

  function closeResultModal() {
    resultModal.classList.remove('active');
    resultModal.setAttribute('aria-hidden', 'true');
  }

  if (btnOpenResult) btnOpenResult.addEventListener('click', openResultModal);
  if (btnOpenResultHero) btnOpenResultHero.addEventListener('click', openResultModal);
  if (resultModalCloseBtn) resultModalCloseBtn.addEventListener('click', closeResultModal);

  /* ==========================================================================
     8.1 Academic Resume Modal & Print PDF Handler
     ========================================================================== */
  const resumeModal = document.getElementById('resume-modal');
  const btnDownloadResume = document.getElementById('btn-download-resume');
  const resumeModalCloseBtn = document.getElementById('resume-modal-close-btn');
  const btnPrintResume = document.getElementById('btn-print-resume');

  function openResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.add('active');
    resumeModal.setAttribute('aria-hidden', 'false');
  }

  function closeResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.remove('active');
    resumeModal.setAttribute('aria-hidden', 'true');
  }

  if (btnDownloadResume) btnDownloadResume.addEventListener('click', openResumeModal);
  if (resumeModalCloseBtn) resumeModalCloseBtn.addEventListener('click', closeResumeModal);
  if (btnPrintResume) {
    btnPrintResume.addEventListener('click', () => {
      window.print();
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
     9. Interactive Code Sandbox Playground
     ========================================================================== */
  const codePresets = {
    html: `<!-- Aditya's HTML/CSS Interactive Snippet -->
<div style="background: #121826; color: #00f0ff; padding: 20px; border-radius: 12px; font-family: sans-serif; border: 1px solid #00f0ff; text-align: center;">
  <h2 style="margin: 0 0 10px 0;">Hello World! 👋</h2>
  <p style="color: #94a3b8; margin: 0;">Welcome to my custom HTML/CSS code container.</p>
  <button style="margin-top: 15px; background: linear-gradient(135deg, #00f0ff, #7000ff); border: none; color: white; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
    Click Me!
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
    python: `# Aditya's Python Basic Syntax Example
def greet_student(name, age, course):
    print(f"Student Profile: {name}")
    print(f"Age: {age} Years Old")
    print(f"Enrolled Course: {course}")
    
skills = ["HTML", "CSS", "JavaScript", "Python"]
print("Acquired Skills:", ", ".join(skills))
greet_student("Aditya Bakodiya", 16, "Diploma in Computer Science")`
  };

  const codeInput = document.getElementById('code-input');
  const outputView = document.getElementById('output-view');
  const runCodeBtn = document.getElementById('run-code-btn');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const editorFilename = document.getElementById('editor-filename');

  let activeTab = 'html';

  function loadPreset(tab) {
    activeTab = tab;
    if (codeInput) codeInput.value = codePresets[tab];
    if (editorFilename) {
      if (tab === 'html') editorFilename.textContent = 'index.html';
      if (tab === 'js') editorFilename.textContent = 'app.js';
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
        outputView.innerHTML = `<pre style="margin:0; white-space: pre-wrap;">${logs.join('\n')}</pre>`;
      } catch (err) {
        outputView.innerHTML = `<span style="color:#ff4757;">Runtime Error: ${err.message}</span>`;
      }
    } else if (activeTab === 'python') {
      // Simple Python simulator for basic print statements and syntax display
      outputView.innerHTML = `<span style="color:#7000ff;">[Python Simulator Console]</span>\n`;
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
      outputView.innerHTML = `<pre style="margin:0; white-space: pre-wrap; color:#00ff9d;">${outputLines.join('\n')}</pre>`;
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
      showToast('Executed code snippet! ⚡', 'success');
    });
  }

  // Load initial preset
  if (codeInput) loadPreset('html');

  /* ==========================================================================
     10. Copy Email & Contact Form Handler
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
     11. Toast Notification Utility
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
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Set current footer year
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

});
