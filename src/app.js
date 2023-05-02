import "./index.html";
import "./index.scss";

const dataMusic = [
  {
    id: "1",
    artist: "The weeknd",
    track: "Save your tears",
    poster: "./assets/cover1.jpg",
    mp3: "/assets/1.mp3",
  },
  {
    id: "2",
    artist: "Imagine Dragons",
    track: "Follow You",
    poster: "./assets/cover2.jpg",
    mp3: "/assets/2.mp3",
  },
  {
    id: "3",
    artist: "Tove Lo",
    track: "How Long",
    poster: "./assets/cover3.jpg",
    mp3: "/assets/3.mp3",
  },
  {
    id: "4",
    artist: "Tom Odell",
    track: "Another Love",
    poster: "./assets/cover4.jpg",
    mp3: "/assets/4.mp3",
  },
  {
    id: "5",
    artist: "Lana Del Rey",
    track: "Born To Die",
    poster: "./assets/cover5.jpg",
    mp3: "/assets/5.mp3",
  },
  {
    id: "6",
    artist: "Adele",
    track: "Hello",
    poster: "./assets/cover6.jpg",
    mp3: "/assets/1.mp3",
  },
  {
    id: "7",
    artist: "Tom Odell",
    track: "Can't Pretend",
    poster: "./assets/cover7.jpg",
    mp3: "/assets/2.mp3",
  },
  {
    id: "8",
    artist: "Lana Del Rey",
    track: "Young And Beautiful",
    poster: "./assets/cover8.jpg",
    mp3: "/assets/3.mp3",
  },
  {
    id: "9",
    artist: "Adele",
    track: "Someone Like You",
    poster: "./assets/cover9.jpg",
    mp3: "/assets/4.mp3",
  },
  {
    id: "10",
    artist: "Imagine Dragons",
    track: "Natural",
    poster: "./assets/cover10.jpg",
    mp3: "/assets/5.mp3",
  },
  {
    id: "11",
    artist: "Drake",
    track: "Laugh Now Cry Later",
    poster: "./assets/cover11.jpg",
    mp3: "/assets/1.mp3",
  },
  {
    id: "12",
    artist: "Madonna",
    track: "Frozen",
    poster: "./assets/cover12.jpg",
    mp3: "/assets/2.mp3",
  },
];

const favoriteList = JSON.parse(localStorage.getItem("favorites")) ?? [];

const audio = new Audio();

const playerEl = document.querySelector(".player");
const catalogEl = document.querySelector(".catalog__list");
const playBtn = document.querySelector(".player__btn--play");
const stopBtn = document.querySelector(".player__btn--stop");
const prevBtn = document.querySelector(".player__btn--prev");
const nextBtn = document.querySelector(".player__btn--next");
const likeBtn = document.querySelector(".player__btn--like");
const unmuteBtn = document.querySelector(".player__btn--next");
const catalogBtn = document.querySelector(".catalog__btn-all");
const favoriteBtn = document.querySelector(".header__favorites-icon");
const playerPassedTimeEl = document.querySelector(".player__time--passed");
const playerDurationTimeEl = document.querySelector(".player__time--total");
const playerProgressEl = document.querySelector(".player__progress-range");
// чтобы была динамическая подгрузка треков
const trackCards = document.getElementsByClassName("track");

const playAudio = (e) => {
  e.preventDefault();
  const activeTrack = e.currentTarget;

  if (activeTrack.classList.contains("track--active")) {
    pauseAudio();
    return;
  }

  let currentTrackInd = 0;
  const id = activeTrack.dataset.id;
  const track = dataMusic.find((item, index) => {
    currentTrackInd = index;
    return item.id === id;
  });

  const index = favoriteList.indexOf(id);
  if (index !== -1) {
    likeBtn.classList.add("player__btn--like-fill");
  } else {
    likeBtn.classList.remove("player__btn--like-fill");
  }

  audio.src = track.mp3;
  audio.play();

  activeTrack.classList.remove("track--pause");
  playerEl.classList.add("player--active");
  playBtn.classList.add("player__btn--pause");

  const prevTrack =
    currentTrackInd === 0 ? dataMusic.length - 1 : currentTrackInd - 1;
  const nextTrack =
    currentTrackInd + 1 === dataMusic.length ? 0 : currentTrackInd + 1;
  prevBtn.dataset.id = dataMusic[prevTrack].id;
  nextBtn.dataset.id = dataMusic[nextTrack].id;
  likeBtn.dataset.id = id;

  for (let card of trackCards) {
    if (card.dataset.id === id) {
      card.classList.add("track--active");
    } else {
      card.classList.remove("track--active");
    }
  }
};

const pauseAudio = () => {
  let activeTrack = document.querySelector(".track--active");

  if (audio.paused) {
    audio.play();
    playBtn.classList.add("player__btn--pause");
    activeTrack.classList.remove("track--pause");
  } else {
    audio.pause();
    playBtn.classList.remove("player__btn--pause");
    activeTrack.classList.add("track--pause");
  }
};

const stopAudio = () => {
  audio.pause();
  audio.currentTime = 0;
  playBtn.classList.remove("player__btn--pause");
  playerEl.classList.remove("player--active");

  document.querySelector(".track--active").classList.remove("track--active");
};

const playNextSong = () => {
  // костыль просто для примера использования dispatch
  nextBtn.dispatchEvent(new Event("click", { bubbles: true }));
};

const addHandlerOnTracks = () => {
  for (let card of trackCards) {
    card.addEventListener("click", playAudio);
  }
};

const showAllTracks = () => {
  [...trackCards].forEach((card) => (card.style.display = ""));
  catalogBtn.remove();
};

const createCard = (el) => {
  const card = document.createElement("a");
  card.href = "#";
  card.className = "catalog__track track";
  card.dataset.id = el.id;
  card.innerHTML = `
    <div class="track__cover-wrap">
      <img class="track__cover" src="${el.poster}" alt="${el.artist} ${el.track}">
    </div>
    <div class="track__info">
      <h4 class="track__title">${el.track}</h4>
      <p class="track__artist">${el.artist}</p>
    </div>
  `;

  const listItem = document.createElement("li");
  listItem.className = "catalog__item";
  listItem.append(card);

  return listItem;
};

const renderCatalog = (dataList) => {
  const data = [...dataList];
  catalogEl.textContent = "";
  const listCard = data.map((item) => createCard(item));

  catalogEl.append(...listCard);
};

const checkCardsCount = (i = 1) => {
  const cardHeight = trackCards[0].clientHeight;
  const catalogHeight = catalogEl.clientHeight;

  if (catalogHeight > cardHeight * 3) {
    trackCards[trackCards.length - i].style.display = "none";
    checkCardsCount(i + 1);
  }
};

const updatePlaybackTime = () => {
  const duration = audio.duration;
  const currentTime = audio.currentTime;
  const progress = (currentTime / duration) * 1000;
  playerProgressEl.value = progress ? progress : 0;

  const minPassed = Math.floor(currentTime / 60) || "0";
  const secPassed = Math.floor(currentTime % 60) || "0";

  const minDuration = Math.floor(duration / 60) || "0";
  const secDuration = Math.floor(duration % 60) || "0";

  playerPassedTimeEl.textContent = `
    ${minPassed}:${secPassed < 10 ? "0" + secPassed : secPassed}
  `;
  playerDurationTimeEl.textContent = `
  ${minDuration}:${secDuration < 10 ? "0" + secDuration : secDuration}
  `;
};

const updateProgress = () => {
  const progress = playerProgressEl.value;
  audio.currentTime = (progress / 1000) * audio.duration;
};

const addTrackToFavorites = () => {
  const index = favoriteList.indexOf(likeBtn.dataset.id);
  if (index === -1) {
    favoriteList.push(likeBtn.dataset.id);
    likeBtn.classList.add("player__btn--like-fill");
  } else {
    favoriteList.splice(index, 1);
    likeBtn.classList.remove("player__btn--like-fill");
  }

  localStorage.setItem("favorites", JSON.stringify(favoriteList));
};

const init = () => {
  renderCatalog(dataMusic);
  addHandlerOnTracks();
  checkCardsCount();

  playBtn.addEventListener("click", pauseAudio);
  stopBtn.addEventListener("click", stopAudio);
  catalogBtn.addEventListener("click", showAllTracks);
  prevBtn.addEventListener("click", playAudio);
  nextBtn.addEventListener("click", playAudio);
  audio.addEventListener("timeupdate", updatePlaybackTime);
  audio.addEventListener("ended", playNextSong);
  playerProgressEl.addEventListener("input", updateProgress);

  likeBtn.addEventListener("click", addTrackToFavorites);

  favoriteBtn.addEventListener("click", () => {
    //
  });
};

init();
