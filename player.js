const root = document.documentElement;

function startHeroIntro() {
  if (!root.classList.contains("intro-enabled")) return;

  if (window.__heroIntroFallback) {
    window.clearTimeout(window.__heroIntroFallback);
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.classList.add("intro-play");
    });
  });

  window.setTimeout(() => {
    root.classList.remove("intro-enabled", "intro-play");
  }, 4300);
}

function bootHeroIntroWhenTypographyIsReady() {
  const fontStylesheet = document.querySelector("#portfolio-fonts");
  let started = false;

  const startOnce = () => {
    if (started) return;
    started = true;

    const start = () => startHeroIntro();

    if (!document.fonts || typeof document.fonts.load !== "function") {
      start();
      return;
    }

    // Espera brevemente a las tres familias visibles en la portada para evitar
    // que la tipografía cambie a mitad de la secuencia. El límite mantiene
    // la apertura ágil incluso con una conexión lenta.
    const heroFonts = Promise.all([
      document.fonts.load('600 64px "Manrope"', "ENRIQUE PÉREZ AYALA"),
      document.fonts.load('400 32px "Instrument Serif"', "Trabajo entre disciplinas"),
      document.fonts.load('400 10px "IBM Plex Mono"', "EPA OBSERVAR")
    ]);

    Promise.race([
      heroFonts,
      new Promise((resolve) => window.setTimeout(resolve, 900))
    ]).then(start, start);
  };

  if (!fontStylesheet || fontStylesheet.dataset.ready === "true") {
    startOnce();
    return;
  }

  fontStylesheet.addEventListener("load", startOnce, { once: true });
  window.setTimeout(startOnce, 1200);
}

bootHeroIntroWhenTypographyIsReady();


const reelFacade = document.querySelector("[data-reel-id]");

if (reelFacade) {
  let reelLoaded = false;

  const loadReel = () => {
    if (reelLoaded) return;
    reelLoaded = true;

    const videoId = reelFacade.dataset.reelId;
    const iframe = document.createElement("iframe");

    // playsinline mejora la reproducción inline en iOS y es inocuo en Android/desktop.
    // El resto de atributos usan APIs estándar compatibles con navegadores modernos.
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&controls=1&rel=0`;
    iframe.title = "Reel audiovisual de Enrique Pérez Ayala";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;

    reelFacade.replaceWith(iframe);
  };

  reelFacade.addEventListener("click", loadReel, { once: true });
}

const modal = document.querySelector("#video-modal");
const player = document.querySelector("#video-modal-player");
const modalTitle = document.querySelector("#video-modal-title");
const externalLink = document.querySelector("#video-modal-external");
const closeButtons = document.querySelectorAll("[data-close-video]");
const videoTriggers = document.querySelectorAll("[data-youtube-id]");

let lastTrigger = null;

function getModalFocusableElements() {
  return Array.from(
    modal.querySelectorAll(
      'button:not([disabled]), a[href], iframe, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => !element.hasAttribute("hidden"));
}

function openVideo(trigger) {
  const videoId = trigger.dataset.youtubeId;
  const title = trigger.dataset.videoTitle || "Pieza audiovisual";

  lastTrigger = trigger;
  modalTitle.textContent = title;
  player.title = `Reproductor de ${title}`;
  player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  const externalUrl = trigger.dataset.externalUrl || `https://www.youtube.com/watch?v=${videoId}`;
  const externalLabel = trigger.dataset.externalLabel || "Ver en YouTube ↗";
  const isVertical = trigger.dataset.videoOrientation === "vertical";

  externalLink.href = externalUrl;
  externalLink.textContent = externalLabel;
  modal.classList.toggle("video-modal--vertical", isVertical);
  modal.hidden = false;
  document.body.classList.add("modal-open");
  modal.querySelector(".video-modal-close").focus();
}

function closeVideo() {
  modal.hidden = true;
  player.src = "about:blank";
  modal.classList.remove("video-modal--vertical");
  document.body.classList.remove("modal-open");

  if (lastTrigger) {
    lastTrigger.focus();
  }
}

videoTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => openVideo(trigger));
});

closeButtons.forEach((button) => {
  button.addEventListener("click", closeVideo);
});

document.addEventListener("keydown", (event) => {
  if (modal.hidden) return;

  if (event.key === "Escape") {
    closeVideo();
    return;
  }

  if (event.key === "Tab") {
    const focusable = getModalFocusableElements();
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});


const instagramEmbedTriggers = document.querySelectorAll("[data-instagram-embed]");

instagramEmbedTriggers.forEach((trigger) => {
  let loaded = false;

  const loadInstagramEmbed = () => {
    if (loaded) return;
    loaded = true;

    const src = trigger.dataset.instagramEmbed;
    const title = trigger.dataset.videoTitle || "Publicación de Instagram";
    const iframe = document.createElement("iframe");

    iframe.src = src;
    iframe.title = `${title}, reproducción integrada`;
    iframe.loading = "lazy";
    iframe.allow = "autoplay; encrypted-media; picture-in-picture";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";

    trigger.replaceWith(iframe);
  };

  trigger.addEventListener("click", loadInstagramEmbed, { once: true });
});
