// Gestione click sulle playlist nella pagina search

document.addEventListener("DOMContentLoaded", function () {
  // Carica la traccia salvata dal PlayerManager se disponibile
  if (window.playerManager) {
    window.playerManager.loadSavedTrack();
  }
  // Gestione click sulle playlist nella sidebar
  document.querySelectorAll(".playlist-item").forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const name = item.textContent.trim();
      window.location.href = `playlist.html?name=${encodeURIComponent(name)}`;
    });
  });

  // Gestione click su 'Brani che ti piacciono' nella sidebar
  document.querySelectorAll(".fw-bold").forEach(function (el) {
    if (el.textContent.trim() === "Brani che ti piacciono") {
      el.closest("a")?.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href =
          "playlist.html?name=" +
          encodeURIComponent("Brani che ti piacciono") +
          "&liked=1";
      });
    }
  });
});

const form = document.getElementsByTagName("form")[0];
let endpoint = "https://striveschool-api.herokuapp.com/api/deezer/search?q=";
const sectionSfoglia = document.getElementsByClassName("browse-all-section")[0];
const sectionsearchResults = document.getElementById("searchResults");

const showResults = (endpointToUse) => {
  const braniSection = document.getElementById("brani");
  const artistiSection = document.getElementById("artisti");
  const albumSection = document.getElementById("album");

  fetch(endpointToUse)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Errore nella API request");
      }
    })
    .then((resultsSearch) => {
      console.log(resultsSearch);
      let maxLength;
      if (resultsSearch.data.length < 4) {
        maxLength = resultsSearch.data.length;
      } else {
        maxLength = 4;
      }

      const nameArtists = [];
      const nameAlbums = [];

      for (let i = 0; i < maxLength; i++) {
        let explicit = `<p class="text-secondary mb-0"> ${resultsSearch.data[i].artist.name}</p>`;
        if (resultsSearch.data[i].explicit_lyrics) {
          explicit = `<p class="text-secondary mb-0"><i class="fab fa-etsy"></i> ${resultsSearch.data[i].artist.name}</p>`;
        }

        let seconds = parseInt(resultsSearch.data[i].duration % 60).toString();
        if (seconds.length !== 2) {
          seconds = seconds.padStart(2, "0");
        }

        let numberRiproduction;
        if (!resultsSearch.data[i].rank) numberRiproduction = "-";
        if (resultsSearch.data[i].rank > 1_000_000)
          numberRiproduction =
            (resultsSearch.data[i].rank / 1_000_000).toFixed(1) + "M";
        if (resultsSearch.data[i].rank > 1_000)
          numberRiproduction =
            (resultsSearch.data[i].rank / 1_000).toFixed(1) + "K";

        braniSection.innerHTML += `<div
                    class="playlist-item d-flex row mb-2 text-secondary gap-2 flex-nowrap colSong align-items-center" 
                  >
                    <div class="d-flex gap-2 col col-6 px-0 align-items-center gap-3">
                      <div>${i + 1}</div>
                      <div><div class="song d-flex flex-column pt-1">
            <h5 class="text-light mb-0">${resultsSearch.data[i].title}</h5>
            ${explicit}
          </div></div>
                    </div>
                    <div class="col col-3 px-0 d-flex justify-content-end">${numberRiproduction}</div>
                    <div class="col col-3 px-0 d-flex justify-content-end pe-3">${parseInt(
                      resultsSearch.data[i].duration / 60
                    )}:${seconds}</div>
                  </div>`;

        if (i > 0) {
          if (!nameArtists.includes(resultsSearch.data[i].artist.name)) {
            artistiSection.innerHTML += `
              <div> <a class="text-decoration-none text-light" href="./artist.html?id=${resultsSearch.data[i].artist.id}">
                <img src="${resultsSearch.data[i].artist.picture_medium}" alt="" />
                <div>
                  <h5>${resultsSearch.data[i].artist.name}</h5>
                  <p>Artista</p>
                </div> </a>
              </div>
            `;
            nameArtists.push(resultsSearch.data[i].artist.name);
          } else {
            let k = i;
            while (
              k < resultsSearch.data.length + 1 &&
              nameArtists.includes(resultsSearch.data[k].artist.name)
            ) {
              k++;
            }
            if (k !== resultsSearch.data.length) {
              artistiSection.innerHTML += `
              <div><a class="text-decoration-none text-light" href="./artist.html?id=${resultsSearch.data[i].artist.id}">
                <img src="${resultsSearch.data[k].artist.picture_medium}" alt="" />
                <div>
                  <h5>${resultsSearch.data[k].artist.name}</h5>
                  <p>Artista</p>
                </div> </a>
              </div>
            `;
              nameArtists.push(resultsSearch.data[k].artist.name);
            } else {
              console.log("Non ci sono abbastanza artisti");
            }
          }

          if (!nameAlbums.includes(resultsSearch.data[i].album.title)) {
            albumSection.innerHTML += `
              <div> <a class="text-decoration-none text-light" href="./album.html?id=${resultsSearch.data[i].album.id}">
                <img src="${resultsSearch.data[i].album.cover_medium}" alt="Album cover" />
                <div>
                  <h5>${resultsSearch.data[i].album.title}</h5>
                  <p>${resultsSearch.data[i].artist.name}</p>
                </div> </a>
              </div>
            `;
            nameAlbums.push(resultsSearch.data[i].album.title);
          } else {
            let k = i;
            while (
              k < resultsSearch.data.length + 1 &&
              nameAlbums.includes(resultsSearch.data[k].album.title)
            ) {
              k++;
            }
            if (k !== resultsSearch.data.length) {
              albumSection.innerHTML += `
              <div> <a class="text-decoration-none text-light" href="./album.html?id=${resultsSearch.data[k].album.id}">
                <img src="${resultsSearch.data[k].album.cover_medium}" alt="" />
                <div>
                  <h5>${resultsSearch.data[k].album.title}</h5>
                  <p>${resultsSearch.data[k].artist.name}</p>
                </div> </a>
              </div>
            `;
              nameAlbums.push(resultsSearch.data[k].album.title);
            } else {
              console.log("Non ci sono abbastanza album");
            }
          }
        } else {
          artistiSection.innerHTML += `
              <div> <a class="text-decoration-none text-light" href="./artist.html?id=${resultsSearch.data[i].artist.id}">
                <img src="${resultsSearch.data[i].artist.picture_medium}" alt="Picture artist" class="mb-1" />
                <div>
                  <h5>${resultsSearch.data[i].artist.name}</h5>
                  <p>Artista</p>
                </div> </a>
              </div>
        `;
          nameArtists.push(resultsSearch.data[i].artist.name);

          albumSection.innerHTML += `
              <div> <a class="text-decoration-none text-light" href="./album.html?id=${resultsSearch.data[i].album.id}">
                <img src="${resultsSearch.data[i].album.cover_medium}" alt="Album cover" />
                <div>
                  <h5>${resultsSearch.data[i].album.title}</h5>
                  <p>${resultsSearch.data[i].artist.name}</p>
                </div> </a>
              </div>
            `;
          nameAlbums.push(resultsSearch.data[i].album.title);
        }
      }
    })
    .catch((err) =>
      console.log("Non siamo riusciti a caricare i risultati", err)
    );
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let queryParametersSearch = document.getElementById("search").value;
  let endpointToUse = endpoint + encodeURIComponent(queryParametersSearch);
  console.log("endpointToUse", endpointToUse);
  sectionSfoglia.style.display = "none";
  sectionsearchResults.classList.remove("d-none");
  document.getElementById("brani").innerHTML = `<h3>Brani</h3>`;
  document.getElementById("artisti").innerHTML = "";
  document.getElementById("album").innerHTML = "";
  showResults(endpointToUse);
});
