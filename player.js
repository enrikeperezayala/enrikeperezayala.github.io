const modal = document.querySelector("#video-modal");
const player = document.querySelector("#video-modal-player");
const modalTitle = document.querySelector("#video-modal-title");
const externalLink = document.querySelector("#video-modal-external");
const closeButtons = document.querySelectorAll("[data-close-video]");
const videoTriggers = document.querySelectorAll("[data-youtube-id]");

let lastTrigger = null;

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
  if (event.key === "Escape" && !modal.hidden) {
    closeVideo();
  }
});
