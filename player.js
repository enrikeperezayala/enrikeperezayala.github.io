const modal = document.querySelector("#video-modal");
const player = document.querySelector("#video-modal-player");
const modalTitle = document.querySelector("#video-modal-title");
const youtubeLink = document.querySelector("#video-modal-youtube");
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
  youtubeLink.href = `https://www.youtube.com/watch?v=${videoId}`;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  modal.querySelector(".video-modal-close").focus();
}

function closeVideo() {
  modal.hidden = true;
  player.src = "about:blank";
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
