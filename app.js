/**
 * Application Interactivity & Personalization Engine for Diwali Celebrations
 * MOTION VAULT STUDIO (Tarun M S, Sow Karthik S, Vishnu Karthikeyaa J)
 */

document.addEventListener('DOMContentLoaded', () => {
  initToranGarland();
  initAudioHUD();
  initDiyas();
  initPersonalizationFromURL();
  initCardModal();
});

// Global state
const appState = {
  userName: 'Beloved Guest & Friend',
  vibe: 'wealth',
  litDiyas: new Set(),
  isSoundActive: false,
  isBgmActive: false
};

// Wish Quotes based on Selected Vibe
const WISH_QUOTES = {
  wealth: {
    quote: '"May Goddess Lakshmi bless your life with boundless wealth, radiant fortune, and divine abundance that multiples with each passing day!"',
    badge: '💰 Wealth & Prosperity'
  },
  success: {
    quote: '"May Lord Ganesha pave your way with glorious triumphs, fearless ambition, and groundbreaking milestones in all your creative endeavors!"',
    badge: '🚀 Success & Ambition'
  },
  peace: {
    quote: '"May the warm glow of holy diyas bring serene tranquility to your mind, robust good health to your loved ones, and harmony to your home."',
    badge: '🕊️ Peace & Good Health'
  },
  creativity: {
    quote: '"May the festival of lights spark infinite imagination, vibrant artistic motion, and limitless inventive magic in your creative journey!"',
    badge: '🎨 Creative Energy & Joy'
  }
};

/* --------------------------------------------------------------------------
   1. Animated Toran (Garland) Generator
   -------------------------------------------------------------------------- */
function initToranGarland() {
  const container = document.getElementById('toranElements');
  if (!container) return;
  const screenWidth = window.innerWidth;
  const count = Math.max(12, Math.floor(screenWidth / 45));

  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const item = document.createElement('div');
    item.className = 'toran-item';
    item.style.animationDelay = `${(i % 5) * 0.25}s`;

    const marigold = document.createElement('div');
    marigold.className = 'toran-marigold';

    const leaf = document.createElement('div');
    leaf.className = 'toran-leaf';

    item.appendChild(marigold);
    item.appendChild(leaf);
    container.appendChild(item);
  }
}
window.addEventListener('resize', () => initToranGarland());

/* --------------------------------------------------------------------------
   2. Audio & Fullscreen HUD Controls
   -------------------------------------------------------------------------- */
function initAudioHUD() {
  const soundBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  const bgmBtn = document.getElementById('bgmToggleBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const active = window.diwaliAudio ? window.diwaliAudio.toggleSound() : false;
      appState.isSoundActive = active;
      soundBtn.classList.toggle('active', active);
      soundBtn.querySelector('.hud-text').textContent = active ? 'Sound: ON' : 'Sound: OFF';
      soundIcon.textContent = active ? '🔊' : '🔇';

      if (active && window.diwaliAudio) {
        window.diwaliAudio.playBell(587.33);
      }
    });
  }

  if (bgmBtn) {
    bgmBtn.addEventListener('click', () => {
      const active = window.diwaliAudio ? window.diwaliAudio.toggleBgm() : false;
      appState.isBgmActive = active;
      bgmBtn.classList.toggle('active', active);
      bgmBtn.querySelector('.hud-text').textContent = active ? 'Music: ON' : 'Music: OFF';

      if (active && soundBtn) {
        soundBtn.classList.add('active');
        soundBtn.querySelector('.hud-text').textContent = 'Sound: ON';
        soundIcon.textContent = '🔊';
      }
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }
}

/* --------------------------------------------------------------------------
   3. Personalized Greeting System & URL Parameter Handling
   -------------------------------------------------------------------------- */
function initPersonalizationFromURL() {
  const params = new URLSearchParams(window.location.search);
  const nameParam = params.get('name');
  const vibeParam = params.get('vibe');

  if (vibeParam && WISH_QUOTES[vibeParam]) {
    appState.vibe = vibeParam;
    updateVibeChipsUI(vibeParam);
  }

  if (nameParam) {
    const cleanName = decodeURIComponent(nameParam.trim());
    if (cleanName) {
      appState.userName = cleanName;
      const inputEl = document.getElementById('userNameInput');
      if (inputEl) inputEl.value = cleanName;
    }
  }

  updateDisplayGreeting();
  setupVibeChips();
  setupShareButtons();
}

function setupVibeChips() {
  const chips = document.querySelectorAll('.mood-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      appState.vibe = chip.dataset.vibe;
      updateDisplayGreeting();
      if (window.diwaliAudio) window.diwaliAudio.playBell(440);
    });
  });
}

function updateVibeChipsUI(selectedVibe) {
  const chips = document.querySelectorAll('.mood-chip');
  chips.forEach(chip => {
    chip.classList.toggle('active', chip.dataset.vibe === selectedVibe);
  });
}

function applyPersonalization() {
  const input = document.getElementById('userNameInput');
  if (input && input.value.trim()) {
    appState.userName = input.value.trim();
  } else {
    appState.userName = 'Beloved Guest & Friend';
  }

  updateDisplayGreeting();

  // Update URL without refreshing page
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set('name', encodeURIComponent(appState.userName));
  newUrl.searchParams.set('vibe', appState.vibe);
  window.history.replaceState({}, '', newUrl.toString());

  // Trigger celebration burst
  if (window.fireworks) {
    window.fireworks.blastConfetti();
    window.fireworks.launchRocket();
  }
  if (window.diwaliAudio) {
    window.diwaliAudio.playBell(659.25);
  }

  // Smooth scroll to display greeting
  const banner = document.getElementById('personalizedBanner');
  if (banner) {
    banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
window.applyPersonalization = applyPersonalization;

function updateDisplayGreeting() {
  const nameEl = document.getElementById('displayRecipientName');
  const quoteEl = document.getElementById('displayWishQuote');
  const certNameEl = document.getElementById('certUserName');

  if (nameEl) nameEl.textContent = appState.userName;
  if (certNameEl) certNameEl.textContent = appState.userName;

  const vibeData = WISH_QUOTES[appState.vibe] || WISH_QUOTES.wealth;
  if (quoteEl) quoteEl.textContent = vibeData.quote;
}

function setupShareButtons() {
  const copyBtn = document.getElementById('copyLinkBtn');
  const whatsappBtn = document.getElementById('whatsappShareBtn');
  const linkHint = document.getElementById('linkCopiedHint');

  const getShareUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('name', encodeURIComponent(appState.userName));
    url.searchParams.set('vibe', appState.vibe);
    return url.toString();
  };

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const shareUrl = getShareUrl();
      try {
        await navigator.clipboard.writeText(shareUrl);
        if (linkHint) {
          linkHint.classList.add('show');
          setTimeout(() => linkHint.classList.remove('show'), 3500);
        }
      } catch (e) {
        prompt('Copy your personalized Diwali greeting link:', shareUrl);
      }
    });
  }

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const shareUrl = getShareUrl();
      const message = `✨ *Happy Diwali from ${appState.userName}!* 🪔\n\nCelebrate with this interactive Diwali experience crafted by *MOTION VAULT STUDIO* (Tarun M S, Sow Karthik S & Vishnu Karthikeyaa J).\n\nOpen your personalized wish here:\n${shareUrl}`;
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    });
  }
}

/* --------------------------------------------------------------------------
   4. Interactive Diya Lighting Chamber
   -------------------------------------------------------------------------- */
function initDiyas() {
  const diyaItems = document.querySelectorAll('.diya-item');
  const counterText = document.getElementById('diyaCounterText');
  const lightAllBtn = document.getElementById('lightAllDiyasBtn');
  const grandBlessingBox = document.getElementById('grandBlessingBox');
  const burstBtn = document.getElementById('burstCelebrationBtn');

  const diyaNotes = [261.63, 293.66, 329.63, 392.00, 523.25];

  const lightDiya = (item, index, playSound = true) => {
    if (appState.litDiyas.has(index)) return;
    appState.litDiyas.add(index);
    item.classList.add('lit');

    if (playSound && window.diwaliAudio) {
      window.diwaliAudio.playBell(diyaNotes[index] || 523.25);
    }

    if (counterText) {
      counterText.textContent = `Diyas Lighted: ${appState.litDiyas.size} / 5`;
    }

    // When all 5 diyas are lit
    if (appState.litDiyas.size === 5) {
      if (grandBlessingBox) grandBlessingBox.classList.add('show');
      if (window.fireworks) {
        window.fireworks.blastConfetti();
        window.fireworks.launchRocket();
        setTimeout(() => window.fireworks.launchRocket(), 500);
      }
    }
  };

  diyaItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      lightDiya(item, index, true);
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        lightDiya(item, index, true);
      }
    });
  });

  if (lightAllBtn) {
    lightAllBtn.addEventListener('click', () => {
      diyaItems.forEach((item, index) => {
        setTimeout(() => {
          lightDiya(item, index, true);
        }, index * 250);
      });
    });
  }

  if (burstBtn) {
    burstBtn.addEventListener('click', () => {
      if (window.fireworks) {
        for (let i = 0; i < 5; i++) {
          setTimeout(() => window.fireworks.launchRocket(), i * 300);
        }
        window.fireworks.blastConfetti();
      }
    });
  }
}

/* --------------------------------------------------------------------------
   5. Cracker Presets Sandbox
   -------------------------------------------------------------------------- */
function triggerPreset(type) {
  if (!window.fireworks) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  switch (type) {
    case 'sparkler':
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          window.fireworks.createSparklerParticles(
            w / 2 + (Math.random() - 0.5) * 200,
            h * 0.45 + (Math.random() - 0.5) * 150
          );
        }, i * 60);
      }
      if (window.diwaliAudio) window.diwaliAudio.playSparkle();
      break;

    case 'anar':
      window.fireworks.startAnar(w / 2, h - 30);
      break;

    case 'chakri':
      window.fireworks.startChakri(w / 2, h * 0.6);
      break;

    case 'rocket':
      window.fireworks.launchRocket(w * 0.3, h * 0.25);
      setTimeout(() => window.fireworks.launchRocket(w * 0.7, h * 0.22), 350);
      setTimeout(() => window.fireworks.launchRocket(w * 0.5, h * 0.18), 700);
      break;

    case 'lantern':
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          window.fireworks.releaseLantern(w * 0.25 + i * (w * 0.25));
        }, i * 400);
      }
      break;

    case 'confetti':
      window.fireworks.blastConfetti(w / 2, h * 0.35);
      break;

    default:
      window.fireworks.launchRocket();
  }
}
window.triggerPreset = triggerPreset;

/* --------------------------------------------------------------------------
   6. Safe Celebrations Pledge
   -------------------------------------------------------------------------- */
function takeSafetyPledge() {
  const cert = document.getElementById('pledgeCertificate');
  const certName = document.getElementById('certUserName');
  const certDate = document.getElementById('certDate');

  if (cert) {
    cert.classList.remove('hidden');
    if (certName) certName.textContent = appState.userName;
    if (certDate) {
      const today = new Date();
      certDate.textContent = today.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }

    if (window.fireworks) {
      window.fireworks.blastConfetti();
    }
    if (window.diwaliAudio) {
      window.diwaliAudio.playBell(523.25);
    }

    cert.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
window.takeSafetyPledge = takeSafetyPledge;

/* --------------------------------------------------------------------------
   7. Downloadable Greeting Card Canvas Generator
   -------------------------------------------------------------------------- */
function initCardModal() {
  const modal = document.getElementById('cardModal');
  const openBtn = document.getElementById('openCardModalBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const downloadBtn = document.getElementById('downloadCardBtn');
  const modalWhatsappBtn = document.getElementById('modalWhatsappBtn');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      renderGreetingCardCanvas();
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const canvas = document.getElementById('greetingCardCanvas');
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = `Diwali_Wish_${appState.userName.replace(/\s+/g, '_')}_MotionVault.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

  if (modalWhatsappBtn) {
    modalWhatsappBtn.addEventListener('click', () => {
      const shareUrl = window.location.href;
      const msg = `✨ Look at this beautiful Diwali greeting card for ${appState.userName} crafted by MOTION VAULT STUDIO (Tarun M S, Sow Karthik S & Vishnu Karthikeyaa J)! Light up yours: ${shareUrl}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }
}

function renderGreetingCardCanvas() {
  const canvas = document.getElementById('greetingCardCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;  // 800
  const H = canvas.height; // 1000

  // 1. Background Gradient
  const bgGrad = ctx.createRadialGradient(W / 2, H * 0.4, 80, W / 2, H / 2, 600);
  bgGrad.addColorStop(0, '#380a5e');
  bgGrad.addColorStop(0.55, '#190333');
  bgGrad.addColorStop(1, '#080114');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Ornate Golden Borders
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, W - 60, H - 60);

  ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(42, 42, W - 84, H - 84);

  // Corner Ornaments
  const corners = [
    [30, 30], [W - 30, 30], [30, H - 30], [W - 30, H - 30]
  ];
  corners.forEach(([cx, cy]) => {
    ctx.save();
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // 3. Central Glowing Mandala Pattern
  ctx.save();
  ctx.translate(W / 2, 280);
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.25)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 16; i++) {
    ctx.rotate((Math.PI * 2) / 16);
    ctx.beginPath();
    ctx.arc(0, 50, 45, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // 4. Studio Presentation Header
  ctx.fillStyle = '#ffb300';
  ctx.font = '700 18px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MOTION VAULT STUDIO PRESENTS', W / 2, 95);

  ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
  ctx.beginPath();
  ctx.moveTo(W / 2 - 140, 110);
  ctx.lineTo(W / 2 + 140, 110);
  ctx.stroke();

  // 5. Main Diwali Title
  ctx.fillStyle = '#ffd700';
  ctx.font = '900 52px "Cinzel Decorative", serif';
  ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
  ctx.shadowBlur = 20;
  ctx.fillText('HAPPY DIWALI', W / 2, 185);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#ff9900';
  ctx.font = '700 22px "Rozha One", serif';
  ctx.fillText('Shubh Deepavali 2026', W / 2, 225);

  // 6. Draw Radiant Golden Diya Illustration in Center
  drawCanvasDiya(ctx, W / 2, 360);

  // 7. Personalized Recipient Block
  ctx.fillStyle = '#ffd8a8';
  ctx.font = '600 18px Outfit, sans-serif';
  ctx.fillText('SPECIALLY CRAFTED FOR', W / 2, 455);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 38px "Rozha One", serif';
  ctx.shadowColor = '#ff3366';
  ctx.shadowBlur = 12;
  ctx.fillText(appState.userName, W / 2, 505);
  ctx.shadowBlur = 0;

  // 8. Wish Quote
  const quote = WISH_QUOTES[appState.vibe] ? WISH_QUOTES[appState.vibe].quote : WISH_QUOTES.wealth.quote;
  ctx.fillStyle = '#d0bde6';
  ctx.font = 'italic 18px Outfit, sans-serif';
  wrapCanvasText(ctx, quote, W / 2, 570, 620, 28);

  // 9. Safe & Green Celebrations Note
  ctx.fillStyle = 'rgba(0, 230, 118, 0.95)';
  ctx.font = '700 16px Outfit, sans-serif';
  ctx.fillText('🌿 Celebrate with Joy, Safety & Kindness to Animals 🐾', W / 2, 705);

  // 10. Founders Sign-off Section
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
  ctx.beginPath();
  ctx.moveTo(100, 755);
  ctx.lineTo(W - 100, 755);
  ctx.stroke();

  ctx.fillStyle = '#ffd700';
  ctx.font = '800 24px "Cinzel Decorative", serif';
  ctx.fillText('MOTION VAULT STUDIO', W / 2, 800);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 17px Outfit, sans-serif';
  ctx.fillText('TARUN M S   •   SOW KARTHIK S   •   VISHNU KARTHIKEYAA J', W / 2, 840);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '14px Outfit, sans-serif';
  ctx.fillText('May your year ahead be filled with brilliant stories and radiant success.', W / 2, 875);
}

function drawCanvasDiya(ctx, x, y) {
  ctx.save();
  // Diya Clay Bowl
  ctx.fillStyle = '#b7410e';
  ctx.beginPath();
  ctx.arc(x, y, 55, 0, Math.PI, false);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Diya Rim
  ctx.fillStyle = '#ff7b25';
  ctx.beginPath();
  ctx.ellipse(x, y, 55, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Holy Flame
  const flameGrad = ctx.createLinearGradient(x, y - 65, x, y - 5);
  flameGrad.addColorStop(0, '#ffffff');
  flameGrad.addColorStop(0.3, '#ffd700');
  flameGrad.addColorStop(0.7, '#ff3d00');
  flameGrad.addColorStop(1, '#d50000');

  ctx.fillStyle = flameGrad;
  ctx.shadowColor = '#ffd700';
  ctx.shadowBlur = 25;
  ctx.beginPath();
  ctx.moveTo(x - 14, y - 10);
  ctx.quadraticCurveTo(x - 22, y - 45, x, y - 72);
  ctx.quadraticCurveTo(x + 22, y - 45, x + 14, y - 10);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}

