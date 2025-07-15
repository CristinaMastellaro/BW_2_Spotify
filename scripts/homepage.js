// Gestione click sulle playlist nella homepage

document.addEventListener('DOMContentLoaded', function () {
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
            // Prendo il nome dalla card
            const title = card.querySelector('.spotify-title');
            if (title) {
                const name = title.textContent.trim();
                window.location.href = `playlist.html?name=${encodeURIComponent(name)}`;
            }
        });
    });

    // Card grandi in basso: playlist in evidenza
    document.querySelectorAll('.spotify-featured-playlist').forEach(function(card) {
        card.addEventListener('click', function() {
            const title = card.querySelector('.spotify-featured-title');
            if (title) {
                const name = title.textContent.trim();
                window.location.href = `playlist.html?name=${encodeURIComponent(name)}`;
            }
        });
    });
});
