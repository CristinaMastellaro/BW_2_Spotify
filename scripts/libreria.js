// Gestione click sulle playlist nella libreria

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.library-item').forEach(function(item) {
        // Prendi il tipo (Playlist/Album/Artista)
        const typeSpan = item.querySelector('.item-type');
        if (typeSpan && typeSpan.textContent.trim() === 'Playlist') {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function() {
                const title = item.querySelector('.item-title');
                const imgEl = item.querySelector('.item-cover img');
                let imgParam = '';
                if (imgEl && imgEl.getAttribute('src')) {
                    imgParam = '&img=' + encodeURIComponent(imgEl.getAttribute('src'));
                }
                if (title) {
                    const name = title.textContent.trim();
                    sessionStorage.setItem('playlistBack', 'libreria');
                    window.location.href = `playlist.html?name=${encodeURIComponent(name)}${imgParam}`;
                }
            });
        }
    });

    // Gestione click su 'Brani che ti piacciono' nella libreria
    document.querySelectorAll('.item-title').forEach(function(el) {
        if (el.textContent.trim() === 'Brani che ti piacciono') {
            el.closest('.library-item')?.addEventListener('click', function(e) {
                e.preventDefault?.();
                sessionStorage.setItem('playlistBack', 'libreria');
                window.location.href = 'playlist.html?name=' + encodeURIComponent('Brani che ti piacciono') + '&liked=1';
            });
        }
    });
}); 