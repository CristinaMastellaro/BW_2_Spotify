const API_BASE_URL =
  "https://striveschool-api.herokuapp.com/api/deezer/artist/412"

// Elementi DOM
const artistNameEl = document.querySelector(".artist-name");
const artistListenersEl = document.querySelector(".artist-info p");
const heroSection = document.querySelector(".hero-section");
const songListEl = document.querySelector(".song-list");

// Funzione per ottenere l'id dell'artista tramite URL
function getArtistIdFromUrl() {
  const UrlParams = new URLSearchParams(window.location.search);
  return UrlParams.get("id") || "6168800"; // Default: Pinguini Tattici Nucleari
}

// Funzione per caricare i dati dell'artista
async function loadArtistData(artistId) {
  try {
    // Fetch dati artista
    const res = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}`);
    if (!res.ok) throw new Error("Errore caricamento artista");
    const artist = await res.json();
    // Aggiorna titolo pagina
    document.title = `${artist.name} - Spotify`;
    // Aggiorna nome artista
    if (artistNameEl) artistNameEl.textContent = artist.name;
    // Aggiorna ascoltatori mensili
    if (artistListenersEl) artistListenersEl.textContent = `${artist.nb_fan.toLocaleString('it-IT')} ascoltatori mensili`;
    // Aggiorna immagine artista come background
    if (heroSection && artist.picture_xl) {
      heroSection.style.backgroundImage = `url('${artist.picture_xl}')`;
      heroSection.style.backgroundSize = "cover";
      heroSection.style.backgroundPosition = "center";
    }
    // Carica le canzoni più popolari
    loadArtistTopTracks(artistId);
  } catch (e) {
    if (artistNameEl) artistNameEl.textContent = "Errore artista";
    if (artistListenersEl) artistListenersEl.textContent = "";
  }
}

// Funzione per caricare le top 5 canzoni dell'artista
async function loadArtistTopTracks(artistId, fallbackName = null, triedGlobalSearch = false) {
  try {
    const res = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=5`);
    if (!res.ok) throw new Error("Errore top tracks");
    const data = await res.json();
    if (songListEl) songListEl.innerHTML = "";
    if (!data.data || data.data.length === 0) {
      // Fallback: cerca artista per nome se non già tentato
      if (fallbackName) {
        // Se già tentato fallback e non ancora provato la search globale, prova la search globale
        if (!triedGlobalSearch) {
          await loadArtistTracksByGlobalSearch(fallbackName || artistNameEl?.textContent);
          return;
        }
        // Già tentato tutto, mostra messaggio
        if (songListEl) songListEl.innerHTML = '<div class="text-warning">Nessuna canzone trovata per questo artista. Prova con un altro artista.</div>';
        return;
      }
      // Prova a cercare artista per nome
      const artistName = artistNameEl ? artistNameEl.textContent : null;
      if (artistName) {
        const searchRes = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/search/artist?q=${encodeURIComponent(artistName)}`);
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          if (searchData.data && searchData.data.length > 0) {
            const foundArtist = searchData.data[0];
            // Riprova con il nuovo id trovato
            await loadArtistTopTracks(foundArtist.id, artistName);
            return;
          }
        }
      }
      // Se non trova nulla, prova la search globale
      if (!triedGlobalSearch) {
        await loadArtistTracksByGlobalSearch(artistName);
        return;
      }
      if (songListEl) songListEl.innerHTML = '<div class="text-warning">Nessuna canzone trovata per questo artista. Prova con un altro artista.</div>';
      return;
    }
    data.data.forEach((track, idx) => {
      const songDiv = document.createElement("div");
      songDiv.className = "song-item d-flex align-items-center py-2";
      songDiv.innerHTML = `
        <div class="song-number me-3 text-center">${idx + 1}</div>
        <div class="song-cover me-3 bg-secondary d-flex align-items-center justify-content-center">
          <img src="${track.album.cover_small}" alt="cover" style="width:40px;height:40px;object-fit:cover;border-radius:6px;">
        </div>
        <div class="flex-grow-1">
          <div class="song-title">${track.title}</div>
        </div>
        <div class="song-plays me-3">
          <small class="text-secondary">${track.rank.toLocaleString('it-IT')}</small>
        </div>
        <div class="song-duration me-3">
          <small class="text-secondary">${Math.floor(track.duration/60)}:${(track.duration%60).toString().padStart(2,'0')}</small>
        </div>
        <button class="btn btn-link text-muted p-0">
          <i class="bi bi-three-dots"></i>
        </button>
      `;
      songListEl.appendChild(songDiv);
    });
  } catch (e) {
    // Fallback anche in caso di errore di rete
    if (!fallbackName) {
      const artistName = artistNameEl ? artistNameEl.textContent : null;
      if (artistName) {
        try {
          const searchRes = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/search/artist?q=${encodeURIComponent(artistName)}`);
          if (searchRes.ok) {
            const searchData = await searchRes.json();
            if (searchData.data && searchData.data.length > 0) {
              const foundArtist = searchData.data[0];
              await loadArtistTopTracks(foundArtist.id, artistName);
              return;
            }
          }
        } catch {}
      }
    }
    // Se non trova nulla, prova la search globale
    if (!triedGlobalSearch) {
      const artistName = artistNameEl ? artistNameEl.textContent : null;
      await loadArtistTracksByGlobalSearch(artistName);
      return;
    }
    if (songListEl) songListEl.innerHTML = '<div class="text-danger">Errore nel caricamento delle canzoni</div>';
  }
}

// Cerca tutte le canzoni tramite search globale e filtra per artista
async function loadArtistTracksByGlobalSearch(artistName) {
  if (!artistName) return;
  try {
    const res = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${encodeURIComponent(artistName)}`);
    if (!res.ok) throw new Error('Errore search globale');
    const data = await res.json();
    if (!data.data || data.data.length === 0) {
      if (songListEl) songListEl.innerHTML = '<div class="text-warning">Nessuna canzone trovata per questo artista. Prova con un altro artista.</div>';
      return;
    }
    // Filtra per artista esatto (id o nome)
    const artistId = getArtistIdFromUrl();
    const filtered = data.data.filter(track => {
      // Match per id o per nome esatto (case insensitive)
      return (track.artist && (track.artist.id == artistId || track.artist.name.toLowerCase() === artistName.toLowerCase()));
    });
    const tracksToShow = filtered.length > 0 ? filtered.slice(0, 5) : data.data.slice(0, 5);
    if (songListEl) songListEl.innerHTML = "";
    tracksToShow.forEach((track, idx) => {
      const songDiv = document.createElement("div");
      songDiv.className = "song-item d-flex align-items-center py-2";
      songDiv.innerHTML = `
        <div class="song-number me-3 text-center">${idx + 1}</div>
        <div class="song-cover me-3 bg-secondary d-flex align-items-center justify-content-center">
          <img src="${track.album.cover_small}" alt="cover" style="width:40px;height:40px;object-fit:cover;border-radius:6px;">
        </div>
        <div class="flex-grow-1">
          <div class="song-title">${track.title}</div>
        </div>
        <div class="song-plays me-3">
          <small class="text-secondary">${track.rank ? track.rank.toLocaleString('it-IT') : '-'}</small>
        </div>
        <div class="song-duration me-3">
          <small class="text-secondary">${track.duration ? Math.floor(track.duration/60) + ':' + (track.duration%60).toString().padStart(2,'0') : '-'}</small>
        </div>
        <button class="btn btn-link text-muted p-0">
          <i class="bi bi-three-dots"></i>
        </button>
      `;
      songListEl.appendChild(songDiv);
    });
  } catch (e) {
    if (songListEl) songListEl.innerHTML = '<div class="text-danger">Errore nel caricamento delle canzoni</div>';
  }
}

// API
// Caricamento dati all'avvio
window.addEventListener("DOMContentLoaded", () => {
  const artistId = getArtistIdFromUrl();
  loadArtistData(artistId);
});
