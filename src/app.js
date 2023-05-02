import "./index.html";
import "./index.scss";

const audio = new Audio();

// чтобы была динамическая подгрузка треков
const trackCards = document.getElementsByClassName("track");
const playerEl = document.querySelector(".player");
const playBtn = document.querySelector(".player__btn--play");
const stopBtn = document.querySelector(".player__btn--stop");

const playAudio = (e) => {
  const activeTrack = e.currentTarget;
  //! DELETE after connect to API
  const url = `./assets/${activeTrack.dataset.track}`;
  audio.src = url;
  audio.play();

  playerEl.classList.add("player--active");
  playBtn.classList.add("player__btn--pause");

  for (let card of trackCards) {
    card.classList.remove("track--active");
  }
  activeTrack.classList.add("track--active");
};

const pauseAudio = () => {
  if (audio.paused) {
    audio.play();
    playBtn.classList.add("player__btn--pause");
  } else {
    audio.pause();
    playBtn.classList.remove("player__btn--pause");
  }
};

const stopAudio = () => {
  audio.pause();
  audio.currentTime = 0;
  playBtn.classList.remove("player__btn--pause");
  playerEl.classList.remove("player--active");

  for (let card of trackCards) {
    card.classList.remove("track--active");
  }
};

for (let card of trackCards) {
  card.addEventListener("click", playAudio);
}

playBtn.addEventListener("click", pauseAudio);
stopBtn.addEventListener("click", stopAudio);
