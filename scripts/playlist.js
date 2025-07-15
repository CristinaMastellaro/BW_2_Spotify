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

    // Se è la playlist dei brani che ti piacciono
    const isLiked = queryParams.get('liked') === '1';
    if (isLiked) {
        if (titleEl) titleEl.innerText = 'Brani che ti piacciono';
        if (coverEl) {
            // Mostra un cuore grande come copertina
            coverEl.style.background = 'linear-gradient(135deg, #450af5, #c4efd9)';
            coverEl.style.display = 'flex';
            coverEl.style.alignItems = 'center';
            coverEl.style.justifyContent = 'center';
            coverEl.style.borderRadius = '16px';
            coverEl.style.width = '200px';
            coverEl.style.height = '200px';
            coverEl.src = '';
            coverEl.alt = 'Cuore';
            coverEl.outerHTML = `<div id="liked-cover" style="width:200px;height:200px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#450af5,#c4efd9);border-radius:16px;"><i class='bi bi-heart-fill' style='font-size:5rem;color:white;'></i></div>`;
        }
        if (creatorEl) creatorEl.innerText = 'La tua raccolta di brani preferiti';
        if (container) {
            container.innerHTML += [
                { title: 'Preferita 1', artist: 'Artista X', explicit: false },
                { title: 'Preferita 2', artist: 'Artista Y', explicit: true },
                { title: 'Preferita 3', artist: 'Artista Z', explicit: false },
            ].map(song => `
                <div class="infoSong d-flex justify-content-between px-2 d-block d-lg-none">
                    <div class="song d-flex flex-column ms-3">
                        <h5 class="text-light">${song.title}</h5>
                        <p class="text-secondary">${song.explicit ? '<i class=\'fab fa-etsy\'></i>' : ''} ${song.artist}</p>
                    </div>
                    <div class="point"><i class="bi bi-three-dots-vertical text-secondary"></i></div>
                </div>
            `).join('');
        }
        return;
    }
});