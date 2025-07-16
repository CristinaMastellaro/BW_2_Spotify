// Utility per gestire il player globale
class PlayerManager {
    constructor() {
        this.currentTrack = null;
        this.currentAudio = null;
        this.isPlaying = false;
    }

    // Aggiorna il player con i dati della traccia
    updatePlayer(track) {
        this.currentTrack = track;
        
        // Aggiorna elementi desktop
        const playerImg = document.querySelector('.player-footer .track-image img');
        const playerTitle = document.querySelector('.player-footer .track-title');
        const playerArtist = document.querySelector('.player-footer .track-artist');
        
        if (playerImg) {
            playerImg.src = track.album?.cover_medium || track.cover || 'https://via.placeholder.com/48x48/333/fff?text=♪';
            playerImg.alt = track.title || 'Traccia in riproduzione';
        }
        
        if (playerTitle) {
            playerTitle.textContent = track.title || 'Traccia in riproduzione';
        }
        
        if (playerArtist) {
            playerArtist.textContent = track.artist?.name || track.artist || '-';
        }

        // Aggiorna elementi mobile
        const mobileTitle = document.querySelector('.mobilePlayer .now-playing-title, .custom-mobile-player .cmp-title');
        if (mobileTitle) {
            mobileTitle.textContent = track.title || 'Traccia in riproduzione';
        }
        
        // Aggiorna artista mobile
        const mobileArtist = document.querySelector('.custom-mobile-player .cmp-artist');
        if (mobileArtist) {
            mobileArtist.textContent = track.artist?.name || track.artist || '-';
        }
        
        // Aggiorna cover mobile - gestione speciale per homepage
        const mobileCover = document.querySelector('.custom-mobile-player .cmp-cover img');
        if (mobileCover) {
            mobileCover.src = track.album?.cover_medium || track.cover || 'https://via.placeholder.com/40x40/333/fff?text=♪';
        }
        
        // Aggiorna la cover mobile
        this.updateMobileCover(track);

        // Aggiorna il pulsante play del player footer
        this.updatePlayButtonIcon(this.isPlaying ? 'bi bi-pause-fill' : 'bi bi-play-fill');

        // Salva la traccia corrente nel localStorage per persistenza
        localStorage.setItem('currentTrack', JSON.stringify(track));
        localStorage.setItem('isPlaying', this.isPlaying.toString());
    }

    // Riproduce una traccia
    playTrack(track, audioElement = null) {
        // Ferma la traccia corrente se ce n'è una
        if (this.currentAudio && this.currentAudio !== audioElement) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
        }

        // Aggiorna il player
        this.updatePlayer(track);
        
        // Riproduce l'audio se fornito
        if (audioElement) {
            this.currentAudio = audioElement;
            audioElement.play();
            this.isPlaying = true;
            
            // Aggiorna l'icona del pulsante
            this.updatePlayButtonIcon('bi bi-pause-fill');
            
            // Salva lo stato di riproduzione
            localStorage.setItem('isPlaying', 'true');
        }

        // Aggiorna la barra di progresso
        this.updateProgressBar();
    }

    // Pausa la riproduzione
    pauseTrack() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.isPlaying = false;
            
            // Aggiorna il pulsante play
            this.updatePlayButtonIcon('bi bi-play-fill');
            
            // Salva lo stato di pausa
            localStorage.setItem('isPlaying', 'false');
        }
    }

    // Aggiorna la barra di progresso
    updateProgressBar() {
        if (!this.currentAudio) return;

        const progressBar = document.querySelector('.player-footer .progress-bar');
        const timeCurrent = document.querySelector('.player-footer .progress-container span.text-muted');
        const timeTotal = document.querySelector('.player-footer .progress-container span.text-secondary');

        if (progressBar && timeCurrent && timeTotal) {
            // Aggiorna la durata totale
            if (this.currentAudio.duration) {
                timeTotal.textContent = this.formatTime(this.currentAudio.duration);
            }

            // Aggiorna il progresso
            const updateProgress = () => {
                if (this.currentAudio.duration) {
                    const percent = (this.currentAudio.currentTime / this.currentAudio.duration) * 100;
                    progressBar.style.width = percent + '%';
                    timeCurrent.textContent = this.formatTime(this.currentAudio.currentTime);
                }
            };

            // Aggiorna ogni 100ms
            this.currentAudio.addEventListener('timeupdate', updateProgress);
            
            // Gestisce la fine della traccia
            this.currentAudio.addEventListener('ended', () => {
                this.isPlaying = false;
                localStorage.setItem('isPlaying', 'false');
                this.updatePlayButtonIcon('bi bi-play-fill');
                if (progressBar) {
                    progressBar.style.width = '0%';
                }
                if (timeCurrent) {
                    timeCurrent.textContent = '0:00';
                }
            });
        }
    }

    // Formatta il tempo in mm:ss
    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec.toString().padStart(2, '0')}`;
    }

    // Carica la traccia salvata dal localStorage
    loadSavedTrack() {
        const savedTrack = localStorage.getItem('currentTrack');
        if (savedTrack) {
            try {
                const track = JSON.parse(savedTrack);
                this.currentTrack = track;
                this.updatePlayer(track);
                
                // Se c'è un audio salvato, ripristina lo stato di riproduzione
                const isPlaying = localStorage.getItem('isPlaying') === 'true';
                if (isPlaying && track.preview) {
                    // Ricrea l'audio element e riproduce se era in riproduzione
                    const audio = new Audio(track.preview);
                    audio.addEventListener('canplay', () => {
                        this.currentAudio = audio;
                        this.isPlaying = true;
                        this.updatePlayButtonIcon('bi bi-pause-fill');
                        this.updateProgressBar();
                        audio.play();
                    });
                }
                
                // Aggiorna sempre l'immagine mobile se presente
                this.updateMobileCover(track);
            } catch (e) {
                console.log('Errore nel caricamento della traccia salvata:', e);
                this.resetMobileCover();
            }
        } else {
            // Se non c'è una traccia salvata, resetta la cover mobile
            this.resetMobileCover();
        }
    }

    // Gestisce il click sul pulsante play/pause del player footer
    handlePlayerPlayPause() {
        // Gestione pulsante desktop
        const playerPlayBtn = document.querySelector('.player-footer .btn-success');
        if (playerPlayBtn) {
            playerPlayBtn.addEventListener('click', () => {
                this.togglePlayPause();
            });
        }
        
        // Gestione pulsante mobile
        const mobilePlayBtn = document.querySelector('.mobilePlayer .btn-link:last-child, .custom-mobile-player .btn-link:last-child');
        if (mobilePlayBtn) {
            mobilePlayBtn.addEventListener('click', () => {
                this.togglePlayPause();
            });
        }
    }
    
    // Funzione per gestire play/pause
    togglePlayPause() {
        if (this.isPlaying) {
            this.pauseTrack();
        } else if (this.currentAudio) {
            this.currentAudio.play();
            this.isPlaying = true;
            localStorage.setItem('isPlaying', 'true');
            this.updatePlayButtonIcon('bi bi-pause-fill');
        } else if (this.currentTrack && this.currentTrack.preview) {
            // Se non c'è audio ma c'è una traccia salvata, ricrea l'audio
            const audio = new Audio(this.currentTrack.preview);
            audio.addEventListener('canplay', () => {
                this.currentAudio = audio;
                this.isPlaying = true;
                localStorage.setItem('isPlaying', 'true');
                this.updatePlayButtonIcon('bi bi-pause-fill');
                this.updateProgressBar();
            });
            audio.play();
        }
    }
    
    // Aggiorna l'icona del pulsante play su tutti i player
    updatePlayButtonIcon(iconClass) {
        // Desktop player
        const playerPlayBtn = document.querySelector('.player-footer .btn-success i');
        if (playerPlayBtn) {
            playerPlayBtn.className = iconClass;
        }
        
        // Mobile player
        const mobilePlayBtn = document.querySelector('.mobilePlayer .btn-link:last-child i, .custom-mobile-player .btn-link:last-child i');
        if (mobilePlayBtn) {
            mobilePlayBtn.className = iconClass;
        }
    }
    
    // Aggiorna la cover mobile per tutte le pagine
    updateMobileCover(track) {
        const coverUrl = track.album?.cover_medium || track.cover || 'https://via.placeholder.com/40x40/333/fff?text=♪';
        
        // Gestione per homepage mobile (sostituisce l'icona con un'immagine)
        const homepageMobileCover = document.querySelector('.mobilePlayer .now-playing-cover');
        if (homepageMobileCover) {
            // Se c'è già un'immagine, aggiorna il src
            let coverImg = homepageMobileCover.querySelector('img');
            if (coverImg) {
                coverImg.src = coverUrl;
            } else {
                // Se non c'è un'immagine, rimuovi l'icona e aggiungi l'immagine
                homepageMobileCover.innerHTML = '';
                coverImg = document.createElement('img');
                coverImg.src = coverUrl;
                coverImg.alt = track.title || 'Cover';
                coverImg.style.width = '40px';
                coverImg.style.height = '40px';
                coverImg.style.objectFit = 'cover';
                coverImg.style.borderRadius = '6px';
                homepageMobileCover.appendChild(coverImg);
            }
        }
        
        // Gestione per altre pagine mobile (aggiorna l'immagine esistente)
        const mobileCover = document.querySelector('.custom-mobile-player .cmp-cover img');
        if (mobileCover) {
            mobileCover.src = coverUrl;
        }
    }

    // Inizializza il player
    init() {
        this.loadSavedTrack();
        this.handlePlayerPlayPause();
    }
    
    // Resetta la cover mobile all'icona di default
    resetMobileCover() {
        const homepageMobileCover = document.querySelector('.mobilePlayer .now-playing-cover');
        if (homepageMobileCover && !homepageMobileCover.querySelector('i')) {
            // Se non c'è già l'icona, aggiungila
            homepageMobileCover.innerHTML = '<i class="bi bi-music-note text-muted"></i>';
        }
    }
}

// Istanza globale del player manager
window.playerManager = new PlayerManager();

// Inizializza quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
    window.playerManager.init();
}); 