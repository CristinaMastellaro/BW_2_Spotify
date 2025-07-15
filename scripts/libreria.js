// Gestione click sulle playlist nella libreria

document.addEventListener('DOMContentLoaded', function () {
    console.log('Libreria.js caricato');
    
    document.querySelectorAll('.library-item').forEach(function(item, index) {
        // Prendi il tipo (Playlist/Album/Artista)
        const typeSpan = item.querySelector('.item-type');
        const title = item.querySelector('.item-title');
        
        console.log(`Elemento ${index}:`, {
            title: title?.textContent?.trim(),
            type: typeSpan?.textContent?.trim()
        });
        
        if (typeSpan && typeSpan.textContent.trim() === 'Playlist') {
            console.log(`Aggiungendo click listener per: ${title?.textContent?.trim()}`);
            item.style.cursor = 'pointer';
            item.addEventListener('click', function(e) {
                console.log('Click su playlist:', title?.textContent?.trim());
                e.preventDefault();
                e.stopPropagation();
                
                const imgEl = item.querySelector('.item-cover img');
                let imgParam = '';
                if (imgEl && imgEl.getAttribute('src')) {
                    imgParam = '&img=' + encodeURIComponent(imgEl.getAttribute('src'));
                }
                if (title) {
                    const name = title.textContent.trim();
                    console.log('Reindirizzamento a:', `playlist.html?name=${encodeURIComponent(name)}${imgParam}`);
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