// Sample playlist
const playlist = [
    { title: "Song 1", artist: "Artist 1", audioSrc: "path/to/song1.mp3", coverArt: "path/to/cover1.jpg" },
    { title: "Song 2", artist: "Artist 2", audioSrc: "path/to/song2.mp3", coverArt: "path/to/cover2.jpg" },
    { title: "Song 3", artist: "Artist 3", audioSrc: "path/to/song3.mp3", coverArt: "path/to/cover3.jpg" },
];

let currentSongIndex = 0;
let isPlaying = false;
let isShuffled = false;
let isRepeating = false;

const audio = new Audio();
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const volumeSlider = document.getElementById("volumeSlider");
const progress = document.getElementById("progress");
const currentTimeSpan = document.getElementById("currentTime");
const totalTimeSpan = document.getElementById("totalTime");
const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");
const albumArt = document.getElementById("albumArt");
const playlistItems = document.getElementById("playlistItems");

function loadSong(index) {
    const song = playlist[index];
    audio.src = song.audioSrc;
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    albumArt.src = song.coverArt;
    updatePlaylistUI();
}

function updatePlaylistUI() {
    playlistItems.innerHTML = "";
    playlist.forEach((song, index) => {
        const li = document.createElement("li");
        li.textContent = `${song.title} - ${song.artist}`;
        li.addEventListener("click", () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        });
        if (index === currentSongIndex) {
            li.classList.add("active");
        }
        playlistItems.appendChild(li);
    });
}

function playSong() {
    isPlaying = true;
    audio.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

function pauseSong() {
    isPlaying = false;
    audio.pause();
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = playlist.length - 1;
    }
    loadSong(currentSongIndex);
    playSong();
}

function nextSong() {
    currentSongIndex++;
    if (currentSongIndex >= playlist.length) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    playSong();
}

function shufflePlaylist() {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle("active");
    if (isShuffled) {
        for (let i = playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
        }
    } else {
        // Restore original order (you may need to keep a copy of the original playlist)
    }
    updatePlaylistUI();
}

function toggleRepeat() {
    isRepeating = !isRepeating;
    repeatBtn.classList.toggle("active");
}

playPauseBtn.addEventListener("click", () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
shuffleBtn.addEventListener("click", shufflePlaylist);
repeatBtn.addEventListener("click", toggleRepeat);

volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
});

audio.addEventListener("timeupdate", () => {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${progressPercent}%`;
    
    const currentMinutes = Math.floor(audio.currentTime / 60);
    const currentSeconds = Math.floor(audio.currentTime % 60);
    currentTimeSpan.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, "0")}`;
});

audio.addEventListener("loadedmetadata", () => {
    const totalMinutes = Math.floor(audio.duration / 60);
    const totalSeconds = Math.floor(audio.duration % 60);
    totalTimeSpan.textContent = `${totalMinutes}:${totalSeconds.toString().padStart(2, "0")}`;
});

audio.addEventListener("ended", () => {
    if (isRepeating) {
        playSong();
    } else {
        nextSong();
    }
});

// Initialize the player
loadSong(currentSongIndex);
updatePlaylistUI();