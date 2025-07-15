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

    // Popola lista canzoni (mock, struttura identica ad album.js)
    const songs = [
        { title: 'Canzone 1', artist: 'Artista 1', explicit: false },
        { title: 'Canzone 2', artist: 'Artista 2', explicit: true },
        { title: 'Canzone 3', artist: 'Artista 3', explicit: false },
    ];
    const container = document.getElementById('containerSongs');
    if (container) {
        container.innerHTML += songs.map(song => `
            <div class="infoSong d-flex justify-content-between px-2 d-block d-lg-none">
                <div class="song d-flex flex-column ms-3">
                    <h5 class="text-light">${song.title}</h5>
                    <p class="text-secondary">${song.explicit ? '<i class=\'fab fa-etsy\'></i>' : ''} ${song.artist}</p>
                </div>
                <div class="point"><i class="bi bi-three-dots-vertical text-secondary"></i></div>
            </div>
        `).join('');
    }

    // Gestione frecce di ritorno (mobile e desktop)
    // Mobile
    const backBtnMobile = document.querySelector('.btn.btn-link.text-white.p-0');
    if (backBtnMobile) {
        backBtnMobile.addEventListener('click', function(e) {
            e.preventDefault();
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