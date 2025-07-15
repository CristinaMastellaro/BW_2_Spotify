const queryParams = new URLSearchParams(location.search);
console.log("queryParams", queryParams);
// const idAlbum = queryParams.split("/")[1];

// const endpoint = `https://striveschool-api.herokuapp.com/api/deezer/album/${idAlbum}`;

// fetch(endpoint)
fetch("https://striveschool-api.herokuapp.com/api/deezer/album/75621062")
  .then((res) => {
    console.log("Sto caricando");
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Non siamo riusciti a recuperare il json");
    }
  })
  .then((dataAlbum) => {
    console.log("dataAlbum", dataAlbum);
    // Inseriamo le varie cose

    // Cover dell'album
    document
      .getElementsByClassName("card-img-top")[0]
      .setAttribute("src", dataAlbum.cover_medium);

    // Informazioni dell'album
    // Titolo album
    document.getElementsByClassName("card-title")[0].innerText =
      dataAlbum.title;
    console.log(dataAlbum.artist.picture_small);
    // Immagine dell'artista
    document
      .querySelector("#artistImg")
      .setAttribute("src", dataAlbum.artist.picture_small);
    console.log(dataAlbum.artist.picture_small);
    // Nome dell'artista
    document.querySelector(
      "h6.card-text"
    ).innerHTML = `<a href="../../artist.html/id=${dataAlbum.artist.id}" class="text-decoration-none text-light">${dataAlbum.artist.name}</a>`;
    // Anno di rilascio dell'album
    document.getElementById("albumWithYear").innerText +=
      " " +
      //   dataAlbum["release_date"];
      dataAlbum["release_date"].split("-")[0];

    document.getElementById("year").innerText +=
      dataAlbum["release_date"].split("-")[0];
    // Info singole canzoni

    document.getElementById("nBrani").innerText =
      dataAlbum.nb_tracks + " brani,";
    document.getElementById("minutsBrani").innerText +=
      " " +
      parseInt(dataAlbum.duration / 60) +
      " min " +
      parseInt((dataAlbum.duration % 60) * 0.6) +
      " sec";

    // Questa parte è per il mobile
    dataAlbum.tracks.data.forEach((song) => {
      // Aggiungere o meno il disclaimer per canzoni esplicite
      let explicit = `<p class="text-secondary mb-0"> ${song.artist.name}</p>`;
      if (song.explicit_lyrics) {
        explicit = `<p class="text-secondary mb-0"><i class="fab fa-etsy"></i> ${song.artist.name}</p>`;
      }

      document.getElementById(
        "mobileSong"
      ).innerHTML += `<div class="infoSong d-flex justify-content-between align-items-center px-2 playlist-item">
          <div class="song d-flex flex-column ms-3 pt-1">
            <h5 class="text-light">${song.title}</h5>
            ${explicit}
          </div>
          <!--nome singolo e artista-->
          <div class="point"><i class="bi bi-three-dots-vertical text-secondary"></i></div>
        </div>`;
    });

    // Questa parte è per il desktop
    dataAlbum.tracks.data.forEach((song, i) => {
      let explicit = `<p class="text-secondary mb-0"> ${song.artist.name}</p>`;
      if (song.explicit_lyrics) {
        explicit = `<p class="text-secondary mb-0"><i class="fab fa-etsy"></i> ${song.artist.name}</p>`;
      }
      // class="col col-3 d-flex flex-row justify-content-between mb-1 text-secondary gap-2"
      document.getElementById("containerSongDesktop").innerHTML += `<div
                    class="playlist-item d-flex row mb-2 text-secondary gap-2 flex-nowrap" id="colSong"
                  >
                    <div class="d-flex gap-2 col col-6 px-0 align-items-center gap-3">
                      <div>${i + 1}</div>
                      <div><div class="song d-flex flex-column pt-1">
            <h5 class="text-light mb-0">${song.title}</h5>
            ${explicit}
          </div></div>
                    </div>
                    <div class="col col-3 px-0"># 13356325</div>
                    <div class="col col-3 px-0 d-flex justify-content-end pe-3">${parseInt(
                      song.duration / 60
                    )}:${parseInt((song.duration % 60) * 0.6)}</div>
                  </div>`;
      //   document.querySelector(
      //     "#colSong"
      //   ).innerHTML += `<div class="ps-0 ms-0 mb-2 d-flex align-items-center gap-3">
      //   <p>${i + 1}</p>
      //   <div class="song d-flex flex-column pt-1">
      //         <h5 class="text-light mb-0">${song.title}</h5>
      //         ${explicit}
      //       </div>
      //       </div>`;

      //   document.querySelector(
      //     "#colRiprod ul"
      //   ).innerHTML += `<li class="ps-0 ms-0">13356325</li>`;
      //   document.querySelector(
      //     "#colDownload ul"
      //   ).innerHTML += `<li class="ps-0 ms-0">${parseInt(
      //     song.duration / 60
      //   )}:${parseInt((song.duration % 60) * 0.6)}</li>`;
    });
  })
  .catch((err) => console.log("Errore!", err));
