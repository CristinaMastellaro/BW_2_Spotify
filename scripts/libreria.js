// Gestione click sulle playlist nella libreria

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.library-item').forEach(function(item) {
        // Prendi il tipo (Playlist/Album/Artista)
        const typeSpan = item.querySelector('.item-type');
        if (typeSpan && typeSpan.textContent.trim() === 'Playlist') {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function() {
                const title = item.querySelector('.item-title');
                if (title) {
                    const name = title.textContent.trim();
                    sessionStorage.setItem('playlistBack', 'libreria');
                    window.location.href = `playlist.html?name=${encodeURIComponent(name)}`;
                }
            });
        }
    });
}); 