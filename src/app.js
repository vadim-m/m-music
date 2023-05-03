import "./index.html";
import "./index.scss";

const API_URL = "http://localhost:3024";

let dataMusic = [];
let playList = [];

const favoriteList = JSON.parse(localStorage.getItem("favorites")) ?? [];

const audio = new Audio();

const playerEl = document.querySelector(".player");
const catalogEl = document.querySelector(".catalog__list");
const playBtn = document.querySelector(".player__btn--play");
const stopBtn = document.querySelector(".player__btn--stop");
const prevBtn = document.querySelector(".player__btn--prev");
const nextBtn = document.querySelector(".player__btn--next");
const likeBtn = document.querySelector(".player__btn--like");
const muteBtn = document.querySelector(".player__btn--unmute");
const catalogBtn = document.querySelector(".catalog__btn-all");
const favoriteBtn = document.querySelector(".header__favorites-icon");
const headerLogo = document.querySelector(".header__logo");
const searchForm = document.querySelector(".search");
const playerPassedTimeEl = document.querySelector(".player__time--passed");
const playerDurationTimeEl = document.querySelector(".player__time--total");
const playerVolumeEl = document.querySelector(".player__volume-range");
const playerProgressEl = document.querySelector(".player__progress-range");
const playerTitle = document.querySelector(".player__track-title");
const playerArtist = document.querySelector(".player__track-artist");

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
  const track = playList.find((item, index) => {
    currentTrackInd = index;
    return item.id === id;
  });

  const index = favoriteList.indexOf(id);
  if (index !== -1) {
    likeBtn.classList.add("player__btn--like-fill");
  } else {
    likeBtn.classList.remove("player__btn--like-fill");
  }

  playerTitle.textContent = track.track;
  playerArtist.textContent = track.artist;

  audio.src = `${API_URL}/${track.mp3}`;
  audio.play();

  activeTrack.classList.remove("track--pause");
  playerEl.classList.add("player--active");
  playBtn.classList.add("player__btn--pause");
  playerEl.dataset.id = id;

  const prevTrack =
    currentTrackInd === 0 ? playList.length - 1 : currentTrackInd - 1;
  const nextTrack =
    currentTrackInd + 1 === playList.length ? 0 : currentTrackInd + 1;
  prevBtn.dataset.id = playList[prevTrack].id;
  nextBtn.dataset.id = playList[nextTrack].id;
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
};

const createCard = (el) => {
  const card = document.createElement("a");
  card.href = "#";
  card.className = "catalog__track track";
  if (playerEl.dataset.id === el.id) {
    card.classList.add("track--active");
    if (audio.paused) {
      card.classList.add("track--pause");
    }
  }
  card.dataset.id = el.id;
  card.innerHTML = `
    <div class="track__cover-wrap">
      <img class="track__cover" src="${API_URL}/${el.poster}" alt="${el.artist} ${el.track}">
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
  playList = [...dataList];
  catalogEl.textContent = "";
  const listCard = dataList.map((item) => createCard(item));

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

const volumeControl = () => {
  const volume = playerVolumeEl.value;
  audio.volume = volume / 100;
  localStorage.setItem("volume", volume / 100);
};

const volumeMuteControl = () => {
  if (audio.volume) {
    localStorage.setItem("volume", audio.volume);
    audio.volume = 0;
    playerVolumeEl.value = 0;
    muteBtn.classList.remove("player__btn--unmute");
    muteBtn.classList.add("player__btn--mute");
  } else {
    audio.volume = localStorage.getItem("volume");
    playerVolumeEl.value = localStorage.getItem("volume") * 100;
    muteBtn.classList.add("player__btn--unmute");
    muteBtn.classList.remove("player__btn--mute");
  }
};

const showFavorites = () => {
  const data = dataMusic.filter((item) => favoriteList.includes(item.id));
  renderCatalog(data);
  addHandlerOnTracks();
  checkCardsCount();
};

const showInitialList = () => {
  searchForm.search.value = "";
  renderCatalog(dataMusic);
  addHandlerOnTracks();
  checkCardsCount();
};

const setInitialVolume = () => {
  audio.volume = localStorage.getItem("volume") ?? 1;
  playerVolumeEl.value = localStorage.getItem("volume") * 100;
};

const searchTrack = async (e) => {
  e.preventDefault();
  playList = await getFoundTracks();

  renderCatalog(playList);
  checkCardsCount();
  addHandlerOnTracks();
};

const getTracksFromAPI = async () => {
  const res = await fetch(`${API_URL}/api/music`);

  return await res.json();
};

const getFoundTracks = async () => {
  const res = await fetch(
    `${API_URL}/api/music?search=${searchForm.search.value}`
  );

  return await res.json();
};

const init = async () => {
  dataMusic = await getTracksFromAPI();

  renderCatalog(dataMusic);
  addHandlerOnTracks();
  checkCardsCount();
  setInitialVolume();

  playBtn.addEventListener("click", pauseAudio);
  stopBtn.addEventListener("click", stopAudio);
  prevBtn.addEventListener("click", playAudio);
  nextBtn.addEventListener("click", playAudio);
  likeBtn.addEventListener("click", addTrackToFavorites);
  catalogBtn.addEventListener("click", showAllTracks);
  favoriteBtn.addEventListener("click", showFavorites);
  headerLogo.addEventListener("click", showInitialList);
  audio.addEventListener("timeupdate", updatePlaybackTime);
  audio.addEventListener("ended", playNextSong);
  playerProgressEl.addEventListener("input", updateProgress);
  playerVolumeEl.addEventListener("input", volumeControl);
  muteBtn.addEventListener("click", volumeMuteControl);
  searchForm.addEventListener("submit", searchTrack);
};

init();
