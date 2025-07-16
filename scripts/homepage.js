// Gestione click sulle playlist nella homepage

document.addEventListener('DOMContentLoaded', function () {
  // Carica la traccia salvata dal PlayerManager se disponibile
  if (window.playerManager) {
    window.playerManager.loadSavedTrack();
  }
    // Sidebar: playlist testuali
    document.querySelectorAll('.playlist-item').forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            // Prendo il nome dalla scritta interna
            const name = item.textContent.trim();
            window.location.href = `playlist.html?name=${encodeURIComponent(name)}`;
        });
    });

    // Card centrali: playlist grafiche
    document.querySelectorAll('.spotify-playlist-item').forEach(function(card) {
        card.addEventListener('click', function() {
            const title = card.querySelector('.spotify-title');
            let img = '';
            let imgParams = '';
            // Se ci sono 4 immagini, passale tutte
            const imgs = card.querySelectorAll('.spotify-mini-cover');
            if (imgs.length === 4) {
                imgParams = Array.from(imgs).map((el, i) => `img${i+1}=${encodeURIComponent(el.getAttribute('src'))}`).join('&');
            } else {
                // fallback: prendi la prima immagine
                const imgEl = card.querySelector('.spotify-mini-cover, .spotify-single-img, .spotify-liked-cover i, .spotify-liked-cover');
                if (imgEl && imgEl.tagName === 'IMG') {
                    img = imgEl.getAttribute('src');
                } else if (imgEl && imgEl.classList.contains('spotify-liked-cover')) {
                    img = 'assets/imgs/main/image-17.jpg';
                }
            }
            if (title) {
                const name = title.textContent.trim();
                let url = `playlist.html?name=${encodeURIComponent(name)}`;
                if (imgParams) {
                    url += `&${imgParams}`;
                } else if (img) {
                    url += `&img=${encodeURIComponent(img)}`;
                }
                window.location.href = url;
            }
        });
    });

    // Card grandi in basso: playlist in evidenza
    document.querySelectorAll('.spotify-featured-playlist').forEach(function(card) {
        card.addEventListener('click', function() {
            const title = card.querySelector('.spotify-featured-title');
            let img = '';
            let imgParams = '';
            const imgs = card.querySelectorAll('.spotify-large-cover');
            if (imgs.length === 4) {
                imgParams = Array.from(imgs).map((el, i) => `img${i+1}=${encodeURIComponent(el.getAttribute('src'))}`).join('&');
            } else if (imgs.length > 0) {
                img = imgs[0].getAttribute('src');
            }
            if (title) {
                const name = title.textContent.trim();
                let url = `playlist.html?name=${encodeURIComponent(name)}`;
                if (imgParams) {
                    url += `&${imgParams}`;
                } else if (img) {
                    url += `&img=${encodeURIComponent(img)}`;
                }
                window.location.href = url;
            }
        });
    });

    // Gestione click su 'Brani che ti piacciono' (sidebar e card centrale)
    document.querySelectorAll('.fw-bold, .spotify-title').forEach(function(el) {
        if (el.textContent.trim() === 'Brani che ti piacciono') {
            el.closest('a, .spotify-playlist-item')?.addEventListener('click', function(e) {
                e.preventDefault?.();
                window.location.href = 'playlist.html?name=' + encodeURIComponent('Brani che ti piacciono') + '&liked=1';
            });
        }
    });
});
