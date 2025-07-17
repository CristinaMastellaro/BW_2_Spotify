// Javascript per playlist page

document.addEventListener("DOMContentLoaded", function () {
  // Carica la traccia salvata dal PlayerManager se disponibile
  if (window.playerManager) {
    window.playerManager.loadSavedTrack();
  }

  // Prendi il nome della playlist dalla query string
  const queryParams = new URLSearchParams(location.search);
  const playlistName = queryParams.get("name") || "Nome Playlist";

  // Popola titolo
  const titleEl = document.getElementById("playlist-title");
  if (titleEl) titleEl.innerText = playlistName;

  // Popola immagine copertina (mock)
  const coverEl = document.querySelector(".card-img-top");
  const coverContainer = document.querySelector(".playlist-cover-container");
  if (
    playlistName.toLowerCase() === "brani che ti piacciono" &&
    coverContainer
  ) {
    // Rimuovi eventuale immagine esistente
    if (coverEl) coverEl.remove();
    // Inserisci il cuore come in homepage
    const likedDiv = document.createElement("div");
    likedDiv.className = "spotify-liked-cover";
    likedDiv.style.marginTop = "1rem";
    likedDiv.innerHTML = '<i class="bi bi-heart-fill"></i>';
    coverContainer.appendChild(likedDiv);
  } else if (coverEl) {
    coverEl.setAttribute("src", "assets/imgs/main/image-1.jpg");
  }

  // Popola creatore (mock)
  const creatorEl = document.querySelector(".card-body h6.card-text");
  if (creatorEl) creatorEl.innerText = "Creatore Playlist";

  // --- INIZIO BLOCCO CANZONI DINAMICHE ---
  // Mappa nome playlist -> query di ricerca
  const playlistQueries = {
    "Pop Hits": "pop",
    "Rock Classico": "hiphop",
    "Rap Italiano": "rap",
    "Dance Party": "party",
    "Indie Vibes": "indie",
    Estate: "summer",
    "Love Songs": "love",
    "Brani che ti piacciono": "hits",
    // aggiungi altre playlist e query tematiche
  };
  // Scegli la query in base al nome playlist, fallback su pop hits
  const searchQuery =
    playlistQueries[playlistName] || playlistName || "pop hits";

  // Funzione per formattare la durata mm:ss
  function formatDuration(seconds) {
    if (!seconds && seconds !== 0) return "-";
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }

  // Funzione per formattare il numero di riproduzioni (rank)
  function formatPlays(rank) {
    if (!rank) return "-";
    if (rank > 1_000_000) return (rank / 1_000_000).toFixed(1) + "M";
    if (rank > 1_000) return (rank / 1_000).toFixed(1) + "K";
    return rank;
  }

  // Funzione per mescolare un array (Fisher-Yates)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Funzione per controllare se una traccia è già nei preferiti
  function isTrackLiked(trackId) {
    const liked = JSON.parse(localStorage.getItem("likedTracks") || "[]");
    return liked.some((t) => t.id === trackId);
  }

  // Funzione per aggiungere una traccia ai preferiti
  function addTrackToLiked(track) {
    let liked = JSON.parse(localStorage.getItem("likedTracks") || "[]");
    if (!liked.some((t) => t.id === track.id)) {
      liked.push(track);
      localStorage.setItem("likedTracks", JSON.stringify(liked));
    }
  }

  // Funzione per rimuovere una traccia dai preferiti
  function removeTrackFromLiked(trackId) {
    let liked = JSON.parse(localStorage.getItem("likedTracks") || "[]");
    liked = liked.filter((t) => t.id !== trackId);
    localStorage.setItem("likedTracks", JSON.stringify(liked));
  }

  // Funzione per renderizzare la lista delle tracce (usata sia per fetch che per liked)
  function renderTracks(tracks, container) {
    if (!isLiked) tracks = shuffleArray(tracks);
    // const tracksList = document.createElement("div");
    // tracksList.className = "playlist-tracks-list";
    // Determina se siamo su mobile o desktop
    // const isMobile = window.innerWidth < 992;
    // console.log("window.innerWidth", window.innerWidth);
    tracks.forEach((track, idx) => {
      const liked = isTrackLiked(track.id);
      const audioId = `audio-preview-${track.id}`;
      // Prendo id e nome artista
      const artistId = track.artist?.id;
      const artistName = track.artist?.name || track.artist || "-";
      console.log("ARTISTA TRACCIA:", track.artist); // DEBUG

      //   const mobileContainer = document.getElementById("mobileContainer");
      //   const desktopContainer = document.getElementById("desktopContainer");

      const containerSongsContainer = document.getElementById("containerSongs");

      const mobileContainer = document.createElement("div");
      mobileContainer.classList.add("d-lg-none");
      const desktopContainer = document.createElement("div");
      desktopContainer.classList.add("d-none", "d-lg-block");

      //   if (isMobile) {
      // MOBILE: visualizzazione a tabella ordinata
      // tracksList.innerHTML += `
      //         <div class="song-item d-flex flex-nowrap align-items-center py-2 border-bottom border-dark w-100" style="gap:0.7rem;">
      //             <div class="song-number text-secondary" style="width:24px;text-align:right;">${
      //               idx + 1
      //             }</div>
      //             <div class="song-cover" style="width:44px;"><img src="${
      //               track.album?.cover_medium || track.cover || ""
      //             }" alt="cover" style="width:40px;height:40px;border-radius:6px;object-fit:cover;"></div>
      //             <div class="song-details flex-grow-1 d-flex flex-column justify-content-center" style="min-width:0;">
      //                 <div class="song-title fw-semibold text-white text-truncate" style="font-size:1rem;">${
      //                   track.title || "-"
      //                 }</div>
      //                 <div class="song-artist text-secondary small text-truncate${
      //                   artistId ? " artist-link" : ""
      //                 }" ${
      //   artistId
      //     ? `data-artist-id=\"${artistId}\" style=\"font-size:0.93rem; cursor:pointer; text-decoration:underline;\"`
      //     : 'style="font-size:0.93rem;"'
      // }>${artistName}</div>
      //             </div>
      //             <div class="song-duration text-secondary ms-2" style="width:40px;text-align:right;font-size:0.97rem;">${formatDuration(
      //               track.duration
      //             )}</div>
      //             <div class="song-menu flex-shrink-0 ms-2">
      //                 <button class="btn btn-link p-0 text-secondary" tabindex="-1" aria-label="Menu brano">
      //                     <i class="bi bi-three-dots-vertical"></i>
      //                 </button>
      //             </div>
      //         </div>
      //         `;
      mobileContainer.innerHTML += `<div class="song-item d-flex align-items-center gap-3 py-2 border-bottom border-dark flex-nowrap ms-2">                  
                    <div class="song-details d-flex flex-column justify-content-center w-50">
                        <div class="song-title fw-semibold text-white">${
                          track.title || "-"
                        }</div>
                        <div class="song-artist text-secondary small${
                          artistId ? " artist-link" : ""
                        }" ${
        artistId
          ? `data-artist-id=\"${artistId}\" style=\"cursor:pointer; text-decoration:underline;\"`
          : ""
      }>${artistName}</div>
                    </div>
                    <div class="song-play-btn mx-2" style="width:120px;">
                        <button class="spotify-inline-play-btn" data-audio-id="${audioId}" title="Play preview">
                            <i class="bi bi-play-fill"></i>
                        </button>
                        <audio id="${audioId}" src="${
        track.preview || ""
      }"></audio>
                    </div>
                    
                    <div class="song-duration text-secondary" style="width:60px;text-align:right;">${formatDuration(
                      track.duration
                    )}</div>
                </div>
                `;
      //   } else {
      // DESKTOP: pulsante play in colonna dedicata, colonne riproduzioni e durata
      desktopContainer.innerHTML += `
                <div class="song-item d-flex align-items-center gap-3 py-2 border-bottom border-dark flex-nowrap">
                    <div class="song-number text-secondary" style="width:32px;">${
                      idx + 1
                    }</div>
                    <div class="song-cover"><img src="${
                      track.album?.cover_medium || track.cover || ""
                    }" alt="cover" style="width:48px;height:48px;border-radius:6px;object-fit:cover;"></div>
                    <div class="song-details flex-grow-1 w-50">
                        <div class="song-title fw-semibold text-white">${
                          track.title || "-"
                        }</div>
                        <div class="song-artist text-secondary small${
                          artistId ? " artist-link" : ""
                        }" ${
        artistId
          ? `data-artist-id=\"${artistId}\" style=\"cursor:pointer; text-decoration:underline;\"`
          : ""
      }>${artistName}</div>
                    </div>
                    <div class="song-play-btn mx-2" style="width:120px;">
                        <button class="spotify-inline-play-btn" data-audio-id="${audioId}" title="Play preview">
                            <i class="bi bi-play-fill"></i>
                        </button>
                        <audio id="${audioId}" src="${
        track.preview || ""
      }"></audio>
                    </div>
                    <div class="song-plays text-secondary" style="width:80px;text-align:right;">${formatPlays(
                      track.rank
                    )}</div>
                    <div class="song-duration text-secondary" style="width:60px;text-align:right;">${formatDuration(
                      track.duration
                    )}</div>
                </div>
                `;
      containerSongsContainer.appendChild(mobileContainer);
      containerSongsContainer.appendChild(desktopContainer);
      //   }
    });
    // Gestione play/pausa preview (ripristinata):
    let currentAudio = null;
    let currentBtn = null;
    container.querySelectorAll(".spotify-inline-play-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const audioId = this.getAttribute("data-audio-id");
        const audio = document.getElementById(audioId);

        if (!audio) return;

        // Trova la traccia associata
        const songItem = this.closest(".song-item");
        const track = {
          id: audioId,
          title: songItem?.querySelector(".song-title")?.innerText || "-",
          artist: {
            name: songItem?.querySelector(".song-artist")?.innerText || "-",
          },
          album: {
            cover_medium: songItem?.querySelector(".song-cover img")?.src || "",
          },
          preview: audio.src,
          duration: audio.duration || 30,
        };

        // Utilizza il PlayerManager globale
        if (window.playerManager) {
          // Se sto già riproducendo questa preview
          if (currentAudio && currentAudio !== audio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            if (currentBtn) {
              currentBtn.querySelector("i").className = "bi bi-play-fill";
            }
          }

          if (audio.paused) {
            // Riproduce la traccia usando il PlayerManager
            window.playerManager.playTrack(track, audio);
            this.querySelector("i").className = "bi bi-pause-fill";
            currentAudio = audio;
            currentBtn = this;
          } else {
            // Pausa la traccia
            window.playerManager.pauseTrack();
            audio.currentTime = 0;
            this.querySelector("i").className = "bi bi-play-fill";
            currentAudio = null;
            currentBtn = null;
          }
        }

        // Quando la preview finisce, torna l'icona play
        audio.onended = () => {
          this.querySelector("i").className = "bi bi-play-fill";
          currentAudio = null;
          currentBtn = null;
        };
      });
    });
    // Event listener per i cuori
    container.querySelectorAll(".like-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const trackId = this.getAttribute("data-track-id");
        const track = tracks.find((t) => t.id == trackId);
        if (!track) return;
        if (isTrackLiked(track.id)) {
          removeTrackFromLiked(track.id);
          this.querySelector("i").className = "bi bi-heart";
          this.querySelector("i").classList.remove("text-danger");
        } else {
          // Salva solo i dati essenziali per i preferiti
          addTrackToLiked({
            id: track.id,
            title: track.title,
            artist: track.artist?.name || "-",
            album: { cover_medium: track.album?.cover_medium || "" },
            preview: track.preview,
            rank: track.rank,
            duration: track.duration,
          });
          this.querySelector("i").className = "bi bi-heart-fill text-danger";
        }
      });
    });
    // Gestione click sugli artisti
    container.querySelectorAll(".artist-link").forEach((el) => {
      el.addEventListener("click", function (e) {
        const artistId = this.getAttribute("data-artist-id");
        if (artistId) {
          window.location.href = `artist.html?id=${artistId}`;
        }
      });
    });
  }

  // Funzione per caricare le canzoni della playlist
  function loadPlaylistTracks(query, fallback = true) {
    const container = document.getElementById("containerSongs");
    if (!container) return;
    // Svuota la lista precedente (ma lascia i controlli sopra)
    const oldList = container.querySelector(".playlist-tracks-list");
    if (oldList) oldList.remove();
    const oldHeader = container.querySelector(".playlist-tracks-header");
    if (oldHeader) oldHeader.remove();

    // Header colonne
    const header = document.createElement("div");
    header.className =
      "playlist-tracks-header d-none d-lg-flex align-items-center gap-3 py-2 border-bottom border-dark";
    header.innerHTML = `
            <div style="width:32px;">#</div>
            <div style="width:48px;"></div>
            <div class="flex-grow-1">Titolo</div>
            <div style="width:120px;text-align:center;"></div>
            <div style="width:80px;text-align:right;">Riproduzioni</div>
            <div style="width:60px;text-align:right;">Durata</div>
        `;
    container.appendChild(header);

    // Loader temporaneo
    const loader = document.createElement("div");
    loader.className = "playlist-tracks-list";
    loader.innerHTML =
      '<div class="text-center py-4">Caricamento canzoni...</div>';
    container.appendChild(loader);

    console.log("Query usata per la playlist:", query);
    fetch(
      `https://striveschool-api.herokuapp.com/api/deezer/search?q=${encodeURIComponent(
        query
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        loader.remove();
        let tracks = data.data;
        if (!tracks || tracks.length === 0) {
          if (fallback) {
            // Prova con una query di fallback generica
            loadPlaylistTracks("hits", false);
            return;
          }
          const empty = document.createElement("div");
          empty.className = "playlist-tracks-list";
          empty.innerHTML =
            '<div class="text-center py-4">Nessuna canzone trovata per questa playlist.</div>';
          container.appendChild(empty);
          return;
        }
        renderTracks(tracks, container);
        // Event listener per i cuori
        container.querySelectorAll(".like-btn").forEach((btn) => {
          btn.addEventListener("click", function () {
            const trackId = this.getAttribute("data-track-id");
            const track = tracks.find((t) => t.id == trackId);
            if (!track) return;
            if (isTrackLiked(track.id)) {
              removeTrackFromLiked(track.id);
              this.querySelector("i").className = "bi bi-heart";
              this.querySelector("i").classList.remove("text-danger");
            } else {
              // Salva solo i dati essenziali per i preferiti
              addTrackToLiked({
                id: track.id,
                title: track.title,
                artist: track.artist?.name || "-",
                album: { cover_medium: track.album?.cover_medium || "" },
                preview: track.preview,
                rank: track.rank,
                duration: track.duration,
              });
              this.querySelector("i").className =
                "bi bi-heart-fill text-danger";
            }
          });
        });
      })
      .catch((err) => {
        loader.remove();
        const errorDiv = document.createElement("div");
        errorDiv.className = "playlist-tracks-list";
        errorDiv.innerHTML =
          '<div class="text-center py-4 text-danger">Errore nel caricamento delle canzoni. Riprova più tardi.</div>';
        container.appendChild(errorDiv);
      });
  }

  // --- FINE BLOCCO CANZONI DINAMICHE ---

  // Se è la playlist dei brani che ti piacciono
  const isLiked = playlistName.toLowerCase() === "brani che ti piacciono";
  if (isLiked) {
    const container = document.getElementById("containerSongs");
    if (container) {
      // Svuota la lista precedente
      const oldList = container.querySelector(".playlist-tracks-list");
      if (oldList) oldList.remove();
      const oldHeader = container.querySelector(".playlist-tracks-header");
      if (oldHeader) oldHeader.remove();
      // Header colonne
      const header = document.createElement("div");
      header.className =
        "playlist-tracks-header d-none d-lg-flex align-items-center gap-3 py-2 border-bottom border-dark";
      header.innerHTML = `
                <div style="width:32px;">#</div>
                <div style="width:48px;"></div>
                <div class="flex-grow-1">Titolo</div>
                <div style="width:120px;">Play</div>
                <div style="width:40px;"><i class="bi bi-heart-fill text-danger"></i></div>
                <div style="width:80px;text-align:right;">Riproduzioni</div>
                <div style="width:60px;text-align:right;">Durata</div>
            `;
      container.appendChild(header);
      // Carica i brani piaciuti
      const likedTracks = JSON.parse(
        localStorage.getItem("likedTracks") || "[]"
      );
      if (likedTracks.length === 0) {
        const empty = document.createElement("div");
        empty.className = "playlist-tracks-list";
        empty.innerHTML =
          '<div class="text-center py-4">Non hai ancora messo il cuore a nessuna canzone.</div>';
        container.appendChild(empty);
      } else {
        renderTracks(likedTracks, container);
      }
    }
  } else {
    // Esegui caricamento playlist con la query associata al nome playlist
    loadPlaylistTracks(searchQuery);
  }

  // Gestione immagine copertina dinamica
  const imgParam = queryParams.get("img");
  if (imgParam && coverEl) {
    coverEl.setAttribute("src", imgParam);
  }

  // Gestione collage 4 immagini
  const img1 = queryParams.get("img1");
  const img2 = queryParams.get("img2");
  const img3 = queryParams.get("img3");
  const img4 = queryParams.get("img4");
  if (img1 && img2 && img3 && img4 && coverEl) {
    // Sostituisci l'immagine con un collage
    coverEl.outerHTML = `
        <div id="playlist-collage" style="width:200px;height:200px;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:2px;border-radius:16px;overflow:hidden;">
            <img src="${img1}" style="width:100%;height:100%;object-fit:cover;grid-column:1;grid-row:1;"/>
            <img src="${img2}" style="width:100%;height:100%;object-fit:cover;grid-column:2;grid-row:1;"/>
            <img src="${img3}" style="width:100%;height:100%;object-fit:cover;grid-column:1;grid-row:2;"/>
            <img src="${img4}" style="width:100%;height:100%;object-fit:cover;grid-column:2;grid-row:2;"/>
        </div>`;
  }

  // Gestione frecce di ritorno (mobile e desktop) - DEVE ESSERE PRIMA DEL BLOCCO isLiked
  // Mobile
  const backBtnMobile = document.querySelector(".btn.btn-link.text-white.p-0");
  if (backBtnMobile) {
    backBtnMobile.addEventListener("click", function (e) {
      e.preventDefault();
      if (isLiked) {
        window.location.href = "homepage.html";
        return;
      }
      const back = sessionStorage.getItem("playlistBack");
      if (back === "libreria") {
        sessionStorage.removeItem("playlistBack");
        window.location.href = "libreria.html";
      } else {
        window.location.href = "homepage.html";
      }
    });
  }
  // Desktop (freccia sinistra grande)
  document
    .querySelectorAll(".bi-arrow-left.fs-4.d-none.d-lg-block")
    .forEach(function (arrow) {
      arrow.parentElement.addEventListener("click", function (e) {
        e.preventDefault();
        if (isLiked) {
          window.location.href = "homepage.html";
          return;
        }
        const back = sessionStorage.getItem("playlistBack");
        if (back === "libreria") {
          sessionStorage.removeItem("playlistBack");
          window.location.href = "libreria.html";
        } else {
          window.location.href = "homepage.html";
        }
      });
    });
});

// Per chiudere la side destra degli amici
const closeButton = document.getElementById("chiudi");
const friendSection = document.getElementById("friendSection");
const iconFriends = document.getElementById("iconFriends");
const mainContentSection = document.getElementsByClassName("main-content")[0];

mainContentSection.style.transition = "all 0.1s linear";

let isFriendSideOpen = true;
let isLeftSideOpen = true;

closeButton.addEventListener("click", () => {
  console.log("Chiudiamo questa sidebar destra");
  friendSection.style.width = "0px";
  friendSection.style.padding = "0px";
  iconFriends.classList.remove("d-none");
  mainContentSection.style.setProperty("margin-right", "0px", "important");
  isFriendSideOpen = false;
  if (isLeftSideOpen) {
    mainContentSection.style.width = "calc(100% - 320px)";
  } else {
    mainContentSection.style.width = "100%";
  }
});

// Per riaprire la side amici

iconFriends.addEventListener("click", () => {
  isFriendSideOpen = true;
  friendSection.style.width = "320px";
  friendSection.style.padding = "16px";
  iconFriends.classList.add("d-none");
  mainContentSection.style.marginRight = "320px";
  if (isLeftSideOpen) {
    mainContentSection.style.width = "calc(100% - 640px)";
  } else {
    mainContentSection.style.width = "calc(100% - 320px)";
  }
});

// Per chiudere la side sinistra
const closeLeftSide = document.getElementById("closeLeftSide");
const openLeftSide = document.getElementById("openLeftSide");
const navSection = document.getElementById("navSection");

openLeftSide.style.transition = "all 0.1s linear";

closeLeftSide.addEventListener("click", () => {
  console.log("Chiudiamo questa sidebar sinistra");
  navSection.style.setProperty("display", "none", "important");
  navSection.style.padding = "0px";
  openLeftSide.classList.remove("d-none");
  mainContentSection.style.setProperty("margin-left", "0px", "important");
  isLeftSideOpen = false;
  if (isFriendSideOpen) {
    mainContentSection.style.width = "calc(100% - 320px)";
  } else {
    mainContentSection.style.width = "100%";
  }
});

// Per riaprire la side sinistra

openLeftSide.addEventListener("click", () => {
  console.log("Apriamo questa side sinistra");
  isLeftSideOpen = true;
  navSection.style.setProperty("display", "flex", "important");
  navSection.style.padding = "16px";
  openLeftSide.classList.add("d-none");
  mainContentSection.style.marginLeft = "320px";
  if (isFriendSideOpen) {
    mainContentSection.style.width = "calc(100% - 640px)";
  } else {
    mainContentSection.style.width = "calc(100% - 320px)";
  }
});
