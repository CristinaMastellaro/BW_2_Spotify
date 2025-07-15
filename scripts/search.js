// Gestione click sulle playlist nella pagina search

document.addEventListener('DOMContentLoaded', function () {
    // Gestione click sulle playlist nella sidebar
    document.querySelectorAll('.playlist-item').forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const name = item.textContent.trim();
            window.location.href = `playlist.html?name=${encodeURIComponent(name)}`;
        });
    });

    // Gestione click su 'Brani che ti piacciono' nella sidebar
    document.querySelectorAll('.fw-bold').forEach(function(el) {
        if (el.textContent.trim() === 'Brani che ti piacciono') {
            el.closest('a')?.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'playlist.html?name=' + encodeURIComponent('Brani che ti piacciono') + '&liked=1';
            });
        }
    });
}); 