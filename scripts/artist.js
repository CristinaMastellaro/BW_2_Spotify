const API_BASE_URL =
  "https://striveschool-api.herokuapp.com/api/deezer/artist/412"

// Elementi DOM
const NomeArtista = document.querySelector(".Nome-Artista")
const InfoArtista = document.querySelector(".Info-Artista p")
const TrackList = document.querySelector(".Track-List")
const FavSongsInfo = document.querySelector(".Fav-Songs-Info")

// Funzione per ottenere l'id dell'artista tramite URL
function idArtistUrl() {
  const UrlParams = new URLSearchParams(window.location.search)
  return UrlParams.get("id") || "6168800" //Pinguini Tattici Nucleari ID
}

// Funzione per ottenere i dati dell'artista dall'API
async function getPlaylistByName(endpoint) {
  try {
    const response = await fetch("${API_BASE_URL}/${endpoint}")
    if (!response.ok) {
      throw new error("HTTP ERROR STATUS:${response.status}")
    }
    return await response.json()
  } catch (error) {
    console.error("ERRORE DELLA CHIAMATA API:", error)
    throw error
  }
}

// Funzione per caricare i dati dell'arttista
async function LoadArtistData(artistid) {
  try {
    // Mostra stato di caricamento
    NomeArtista.textContent = "Caricamento..."
    getPlaylistByName.textContent = "Caricamento dati artista..."
    // Carica i dati dell'artista
    const ArtistData = await getPlaylistByName(`artist/${artistid}`)
    // Aggiorna il titolo della pagina
    document.title = "${ArtistData.name}- Spotify"
    // Aggiorna informazioni dell'artista
    NomeArtista.textContent = ArtistData.name
    // Ascoltatori
    const FanCount = new Intl.NumberFormat("it-IT").format(ArtistData.nb_fan)
    getPlaylistByName.textContent = `${FanCount} Ascoltatori Mensili`
    // Aggiorna immagine dell'artista
    if (ArtistData.picture_x1) {
      heroSection.style.backgroundImage = `url(${ArtistData.picture_x1})`
      heroSection.style.backgroundSize = "cover"
      heroSection.style.backgroundPosition = "center"
    }
    // Brani che piacciono all'utente (aggiorna)
    likeSongsInfo.textContent = "Brani di ${ArtistData.name}"
    // funzione che carica brani popolari dell'artista
    await LoadArtistTopTracks(artistid)
  } catch (error) {
    console.error("Errore durante il caricamento dei dati dell'artista", error)
    NomeArtista.textContent = "Impossibile caricare i dati dell'artista."
    InfoArtista.textContent =
      "Impossibile caricare le informazioni dell'artista."
    showErrorMessage()
  }
}

// Funzione per caricare i brani più popolari dell'artista
async function LoadArtistTopTracks(artistid) {
  try {
    const TracksData = await fetchFromAPI("Artist/${artistid}/top?limit=10")

    if (TracksData.data && TracksData.data.length > 0) {
      displayTopTracks(TracksData.data)
    } else {
      showNotTracksMessage()
    }
  } catch (error) {
    console.error("Errore caricamento dei brani:", error)
    showErrorMessage()
  }
}

// Funzione per creare l'elemento brano
function CreateTrackElement(track, position) {
  const TrackDiv = document.createElement("div")
  TrackDiv.className = "song-item d-flex align-items-center py-2"
  TrackDiv.style.cursor = "pointer"
}

// API
document.addEventListener("DOMContentLoaded", function () {
  fetch("https://striveschool-api.herokuapp.com/api/deezer/artist")
    .then((response) => response.json())
    .then((data) => {
      // Gestisci i dati ricevuti dalla risposta
      console.log(data)
    })
    .catch((error) => {
      console.error("Errore nella chiamata API:", error)
    })
})
