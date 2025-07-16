// Javascript per playlist page

document.addEventListener('DOMContentLoaded', function () {
    // Prendi il nome della playlist dalla query string
    const queryParams = new URLSearchParams(location.search);
    const playlistName = queryParams.get('name') || 'Nome Playlist';

    // Popola titolo
    const titleEl = document.getElementById('playlist-title');
    if (titleEl) titleEl.innerText = playlistName;

    // Popola immagine copertina (mock)
    const coverEl = document.querySelector('.card-img-top');
    if (coverEl) coverEl.setAttribute('src', 'assets/imgs/main/image-1.jpg');

    // Popola creatore (mock)
    const creatorEl = document.querySelector('.card-body h6.card-text');
    if (creatorEl) creatorEl.innerText = 'Creatore Playlist';

    // --- INIZIO BLOCCO CANZONI DINAMICHE ---
    // Mappa nome playlist -> query di ricerca
    const playlistQueries = {
        'Pop Hits': 'pop',
        'Rock Classico': 'hiphop',
        'Rap Italiano': 'rap',
        'Dance Party': 'party',
        'Indie Vibes': 'indie',
        'Estate': 'summer',
        'Love Songs': 'love',
        'Brani che ti piacciono': 'hits',
        // aggiungi altre playlist e query tematiche
    };
    // Scegli la query in base al nome playlist, fallback su pop hits
    const searchQuery = playlistQueries[playlistName] || playlistName || 'pop hits';

    // Funzione per formattare la durata mm:ss
    function formatDuration(seconds) {
        if (!seconds && seconds !== 0) return '-';
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec.toString().padStart(2, '0')}`;
    }

    // Funzione per formattare il numero di riproduzioni (rank)
    function formatPlays(rank) {
        if (!rank) return '-';
        if (rank > 1_000_000) return (rank/1_000_000).toFixed(1) + 'M';
        if (rank > 1_000) return (rank/1_000).toFixed(1) + 'K';
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
        const liked = JSON.parse(localStorage.getItem('likedTracks') || '[]');
        return liked.some(t => t.id === trackId);
    }

    // Funzione per aggiungere una traccia ai preferiti
    function addTrackToLiked(track) {
        let liked = JSON.parse(localStorage.getItem('likedTracks') || '[]');
        if (!liked.some(t => t.id === track.id)) {
            liked.push(track);
            localStorage.setItem('likedTracks', JSON.stringify(liked));
        }
    }

    // Funzione per rimuovere una traccia dai preferiti
    function removeTrackFromLiked(trackId) {
        let liked = JSON.parse(localStorage.getItem('likedTracks') || '[]');
        liked = liked.filter(t => t.id !== trackId);
        localStorage.setItem('likedTracks', JSON.stringify(liked));
    }

    // Funzione per renderizzare la lista delle tracce (usata sia per fetch che per liked)
    function renderTracks(tracks, container) {
        if (!isLiked) tracks = shuffleArray(tracks);
        const tracksList = document.createElement('div');
        tracksList.className = 'playlist-tracks-list';
        // Determina se siamo su mobile o desktop
        const isMobile = window.innerWidth < 992;
        tracks.forEach((track, idx) => {
            const liked = isTrackLiked(track.id);
            const audioId = `audio-preview-${track.id}`;
            // Prendo id e nome artista
            const artistId = track.artist?.id;
            const artistName = track.artist?.name || track.artist || '-';
            console.log('ARTISTA TRACCIA:', track.artist); // DEBUG
            if (isMobile) {
                // MOBILE: visualizzazione a tabella ordinata
                tracksList.innerHTML += `
                <div class="song-item d-flex align-items-center py-2 border-bottom border-dark w-100" style="gap:0.7rem;">
                    <div class="song-number text-secondary" style="width:24px;text-align:right;">${idx + 1}</div>
                    <div class="song-cover" style="width:44px;"><img src="${track.album?.cover_medium || track.cover || ''}" alt="cover" style="width:40px;height:40px;border-radius:6px;object-fit:cover;"></div>
                    <div class="song-details flex-grow-1 d-flex flex-column justify-content-center" style="min-width:0;">
                        <div class="song-title fw-semibold text-white text-truncate" style="font-size:1rem;">${track.title || '-'}</div>
                        <div class="song-artist text-secondary small text-truncate${artistId ? ' artist-link' : ''}" ${artistId ? `data-artist-id=\"${artistId}\" style=\"font-size:0.93rem; cursor:pointer; text-decoration:underline;\"` : 'style="font-size:0.93rem;"'}>${artistName}</div>
                    </div>
                    <div class="song-duration text-secondary ms-2" style="width:40px;text-align:right;font-size:0.97rem;">${formatDuration(track.duration)}</div>
                    <div class="song-menu flex-shrink-0 ms-2">
                        <button class="btn btn-link p-0 text-secondary" tabindex="-1" aria-label="Menu brano">
                            <i class="bi bi-three-dots-vertical"></i>
                        </button>
                    </div>
                </div>
                `;
            } else {
                // DESKTOP: pulsante play in colonna dedicata, colonne riproduzioni e durata
                tracksList.innerHTML += `
                <div class="song-item d-flex align-items-center gap-3 py-2 border-bottom border-dark flex-nowrap">
                    <div class="song-number text-secondary" style="width:32px;">${idx + 1}</div>
                    <div class="song-cover"><img src="${track.album?.cover_medium || track.cover || ''}" alt="cover" style="width:48px;height:48px;border-radius:6px;object-fit:cover;"></div>
                    <div class="song-details flex-grow-1">
                        <div class="song-title fw-semibold text-white">${track.title || '-'}</div>
                        <div class="song-artist text-secondary small${artistId ? ' artist-link' : ''}" ${artistId ? `data-artist-id=\"${artistId}\" style=\"cursor:pointer; text-decoration:underline;\"` : ''}>${artistName}</div>
                    </div>
                    <div class="song-play-btn mx-2" style="width:120px;">
                        <button class="spotify-inline-play-btn" data-audio-id="${audioId}" title="Play preview">
                            <i class="bi bi-play-fill"></i>
                        </button>
                        <audio id="${audioId}" src="${track.preview || ''}"></audio>
                    </div>
                    <div class="song-plays text-secondary" style="width:80px;text-align:right;">${formatPlays(track.rank)}</div>
                    <div class="song-duration text-secondary" style="width:60px;text-align:right;">${formatDuration(track.duration)}</div>
                </div>
                `;
            }
        });
        container.appendChild(tracksList);
        // Gestione play/pausa preview (ripristinata):
        let currentAudio = null;
        let currentBtn = null;
        // --- PLAYER FOOTER ---
        // Selettori player footer
        const playerFooter = document.querySelector('footer.player-footer');
        const playerImg = playerFooter?.querySelector('.current-track img');
        const playerTitle = playerFooter?.querySelector('.track-title');
        const playerArtist = playerFooter?.querySelector('.track-artist');
        const playerPlayBtn = playerFooter?.querySelector('.player-controls .btn-success');
        const playerProgressBar = playerFooter?.querySelector('.progress-bar');
        const playerTimeCurrent = playerFooter?.querySelector('.progress-container span.text-muted');
        const playerTimeTotal = playerFooter?.querySelector('.progress-container span.text-secondary');
        let playerInterval = null;
        let playerAudio = null;
        // --- END PLAYER FOOTER ---
        container.querySelectorAll('.spotify-inline-play-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const audioId = this.getAttribute('data-audio-id');
                const audio = document.getElementById(audioId);
                // --- PLAYER FOOTER LOGIC ---
                // Trova la traccia associata
                const songItem = this.closest('.song-item');
                const coverImg = songItem?.querySelector('.song-cover img')?.src || '';
                const title = songItem?.querySelector('.song-title')?.innerText || '-';
                const artist = songItem?.querySelector('.song-artist')?.innerText || '-';
                // Aggiorna player footer
                if (playerImg) playerImg.src = coverImg;
                if (playerTitle) playerTitle.innerText = title;
                if (playerArtist) playerArtist.innerText = artist;
                if (playerTimeCurrent) playerTimeCurrent.innerText = '0:00';
                if (playerTimeTotal) playerTimeTotal.innerText = audio?.duration ? formatDuration(Math.floor(audio.duration)) : '0:30';
                if (playerProgressBar) playerProgressBar.style.width = '0%';
                // Gestione audio player footer
                if (playerAudio && playerAudio !== audio) {
                    playerAudio.pause();
                    playerAudio.currentTime = 0;
                }
                playerAudio = audio;
                // --- END PLAYER FOOTER LOGIC ---
                if (!audio) return;
                // Se sto già riproducendo questa preview
                if (currentAudio && currentAudio !== audio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                    if (currentBtn) {
                        currentBtn.querySelector('i').className = 'bi bi-play-fill';
                    }
                }
                if (audio.paused) {
                    audio.play();
                    this.querySelector('i').className = 'bi bi-pause-fill';
                    currentAudio = audio;
                    currentBtn = this;
                    // --- ANIMAZIONE BARRA PLAYER FOOTER ---
                    if (playerInterval) clearInterval(playerInterval);
                    playerInterval = setInterval(() => {
                        if (playerAudio && playerAudio.duration) {
                            const percent = (playerAudio.currentTime / playerAudio.duration) * 100;
                            if (playerProgressBar) playerProgressBar.style.width = percent + '%';
                            if (playerTimeCurrent) playerTimeCurrent.innerText = formatDuration(Math.floor(playerAudio.currentTime));
                            if (playerTimeTotal) playerTimeTotal.innerText = formatDuration(Math.floor(playerAudio.duration));
                        }
                    }, 100);
                    // Cambia bottone play footer
                    if (playerPlayBtn) playerPlayBtn.querySelector('i').className = 'bi bi-pause-fill';
                } else {
                    audio.pause();
                    audio.currentTime = 0;
                    this.querySelector('i').className = 'bi bi-play-fill';
                    // Reset barra player footer
                    if (playerProgressBar) playerProgressBar.style.width = '0%';
                    if (playerTimeCurrent) playerTimeCurrent.innerText = '0:00';
                    if (playerInterval) {
                        clearInterval(playerInterval);
                        playerInterval = null;
                    }
                    if (playerPlayBtn) playerPlayBtn.querySelector('i').className = 'bi bi-play-fill';
                    currentAudio = null;
                    currentBtn = null;
                }
                // Quando la preview finisce, torna l'icona play e resetta la barra
                audio.onended = () => {
                    this.querySelector('i').className = 'bi bi-play-fill';
                    if (playerProgressBar) playerProgressBar.style.width = '0%';
                    if (playerTimeCurrent) playerTimeCurrent.innerText = '0:00';
                    if (playerInterval) {
                        clearInterval(playerInterval);
                        playerInterval = null;
                    }
                    if (playerPlayBtn) playerPlayBtn.querySelector('i').className = 'bi bi-play-fill';
                    currentAudio = null;
                    currentBtn = null;
                };
            });
        });
        // Event listener per i cuori
        container.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const trackId = this.getAttribute('data-track-id');
                const track = tracks.find(t => t.id == trackId);
                if (!track) return;
                if (isTrackLiked(track.id)) {
                    removeTrackFromLiked(track.id);
                    this.querySelector('i').className = 'bi bi-heart';
                    this.querySelector('i').classList.remove('text-danger');
                } else {
                    // Salva solo i dati essenziali per i preferiti
                    addTrackToLiked({
                        id: track.id,
                        title: track.title,
                        artist: track.artist?.name || '-',
                        album: { cover_medium: track.album?.cover_medium || '' },
                        preview: track.preview,
                        rank: track.rank,
                        duration: track.duration
                    });
                    this.querySelector('i').className = 'bi bi-heart-fill text-danger';
                }
            });
        });
        // Gestione click sugli artisti
        container.querySelectorAll('.artist-link').forEach(el => {
            el.addEventListener('click', function(e) {
                const artistId = this.getAttribute('data-artist-id');
                if (artistId) {
                    window.location.href = `artist.html?id=${artistId}`;
                }
            });
        });
    }

    // Funzione per caricare le canzoni della playlist
    function loadPlaylistTracks(query, fallback = true) {
        const container = document.getElementById('containerSongs');
        if (!container) return;
        // Svuota la lista precedente (ma lascia i controlli sopra)
        const oldList = container.querySelector('.playlist-tracks-list');
        if (oldList) oldList.remove();
        const oldHeader = container.querySelector('.playlist-tracks-header');
        if (oldHeader) oldHeader.remove();

        // Header colonne
        const header = document.createElement('div');
        header.className = 'playlist-tracks-header d-none d-lg-flex align-items-center gap-3 py-2 border-bottom border-dark';
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
        const loader = document.createElement('div');
        loader.className = 'playlist-tracks-list';
        loader.innerHTML = '<div class="text-center py-4">Caricamento canzoni...</div>';
        container.appendChild(loader);

        console.log('Query usata per la playlist:', query);
        fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {
                loader.remove();
                let tracks = data.data;
                if (!tracks || tracks.length === 0) {
                    if (fallback) {
                        // Prova con una query di fallback generica
                        loadPlaylistTracks('hits', false);
                        return;
                    }
                    const empty = document.createElement('div');
                    empty.className = 'playlist-tracks-list';
                    empty.innerHTML = '<div class="text-center py-4">Nessuna canzone trovata per questa playlist.</div>';
                    container.appendChild(empty);
                    return;
                }
                renderTracks(tracks, container);
                // Event listener per i cuori
                container.querySelectorAll('.like-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const trackId = this.getAttribute('data-track-id');
                        const track = tracks.find(t => t.id == trackId);
                        if (!track) return;
                        if (isTrackLiked(track.id)) {
                            removeTrackFromLiked(track.id);
                            this.querySelector('i').className = 'bi bi-heart';
                            this.querySelector('i').classList.remove('text-danger');
                        } else {
                            // Salva solo i dati essenziali per i preferiti
                            addTrackToLiked({
                                id: track.id,
                                title: track.title,
                                artist: track.artist?.name || '-',
                                album: { cover_medium: track.album?.cover_medium || '' },
                                preview: track.preview,
                                rank: track.rank,
                                duration: track.duration
                            });
                            this.querySelector('i').className = 'bi bi-heart-fill text-danger';
                        }
                    });
                });
            })
            .catch(err => {
                loader.remove();
                const errorDiv = document.createElement('div');
                errorDiv.className = 'playlist-tracks-list';
                errorDiv.innerHTML = '<div class="text-center py-4 text-danger">Errore nel caricamento delle canzoni. Riprova più tardi.</div>';
                container.appendChild(errorDiv);
            });
    }

    // --- FINE BLOCCO CANZONI DINAMICHE ---

    // Se è la playlist dei brani che ti piacciono
    const isLiked = playlistName.toLowerCase() === 'brani che ti piacciono';
    if (isLiked) {
        const container = document.getElementById('containerSongs');
        if (container) {
            // Svuota la lista precedente
            const oldList = container.querySelector('.playlist-tracks-list');
            if (oldList) oldList.remove();
            const oldHeader = container.querySelector('.playlist-tracks-header');
            if (oldHeader) oldHeader.remove();
            // Header colonne
            const header = document.createElement('div');
            header.className = 'playlist-tracks-header d-none d-lg-flex align-items-center gap-3 py-2 border-bottom border-dark';
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
            const likedTracks = JSON.parse(localStorage.getItem('likedTracks') || '[]');
            if (likedTracks.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'playlist-tracks-list';
                empty.innerHTML = '<div class="text-center py-4">Non hai ancora messo il cuore a nessuna canzone.</div>';
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
    const imgParam = queryParams.get('img');
    if (imgParam && coverEl) {
        coverEl.setAttribute('src', imgParam);
    }

    // Gestione collage 4 immagini
    const img1 = queryParams.get('img1');
    const img2 = queryParams.get('img2');
    const img3 = queryParams.get('img3');
    const img4 = queryParams.get('img4');
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
    const backBtnMobile = document.querySelector('.btn.btn-link.text-white.p-0');
    if (backBtnMobile) {
        backBtnMobile.addEventListener('click', function(e) {
            e.preventDefault();
            if (isLiked) {
                window.location.href = 'homepage.html';
                return;
            }
            const back = sessionStorage.getItem('playlistBack');
            if (back === 'libreria') {
                sessionStorage.removeItem('playlistBack');
                window.location.href = 'libreria.html';
            } else {
                window.location.href = 'homepage.html';
            }
        });
    }
    // Desktop (freccia sinistra grande)
    document.querySelectorAll('.bi-arrow-left.fs-4.d-none.d-lg-block').forEach(function(arrow) {
        arrow.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            if (isLiked) {
                window.location.href = 'homepage.html';
                return;
            }
            const back = sessionStorage.getItem('playlistBack');
            if (back === 'libreria') {
                sessionStorage.removeItem('playlistBack');
                window.location.href = 'libreria.html';
            } else {
                window.location.href = 'homepage.html';
            }
        });
    });
});