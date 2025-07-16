const queryParams = new URLSearchParams(location.search);
console.log("queryParams", queryParams);
const idAlbum = queryParams.get("id");
console.log("idAlbum", idAlbum);

const endpoint = `https://striveschool-api.herokuapp.com/api/deezer/album/${idAlbum}`;

fetch(endpoint)
  // fetch("https://striveschool-api.herokuapp.com/api/deezer/album/75621062")
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
    dataAlbum.tracks.data.forEach((song, i) => {
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
      const infoSongClasses = document.getElementsByClassName("infoSong");
      console.log("infoSongClasses[i]", infoSongClasses[i]);
      infoSongClasses[i].addEventListener("click", () => {
        console.log("Hai premuto");
        let audio = new Audio(`${song.preview}`);
        audio.play();
      });
    });

    // Questa parte è per il desktop
    dataAlbum.tracks.data.forEach((song, i) => {
      let explicit = `<p class="text-secondary mb-0"> ${song.artist.name}</p>`;
      if (song.explicit_lyrics) {
        explicit = `<p class="text-secondary mb-0"><i class="fab fa-etsy"></i> ${song.artist.name}</p>`;
      }
      let seconds = parseInt((song.duration % 60) * 0.6).toString();
      if (seconds.length !== 2) {
        seconds += "0";
      }
      // class="col col-3 d-flex flex-row justify-content-between mb-1 text-secondary gap-2"
      const numeroCasuale = Math.floor(Math.random() * 10000000);

      //document.querySelector("#colRiprod ul").innerHTML += `
      //<li class="ps-0 ms-0">${numeroCasuale}</li>`;

      document.getElementById("containerSongDesktop").innerHTML += `<div
                    class="playlist-item d-flex row mb-2 text-secondary gap-2 flex-nowrap colSong"
                  >
                    <div class="d-flex gap-2 col col-6 px-0 align-items-center gap-3">
                      <div>${i + 1}</div>
                      <div><div class="song d-flex flex-column pt-1">
            <h5 class="text-light mb-0">${song.title}</h5>
            ${explicit}
          </div></div>
          
                    </div>
                    <div class="col col-3 px-0 d-flex justify-content-end">${numeroCasuale}</div>
                    <div class="col col-3 px-0 d-flex justify-content-end pe-3">${parseInt(
                      song.duration / 60
                    )}:${seconds}</div>
                    <audio>
  <source src="${song.preview}" type="audio/mpeg">
Your browser does not support the audio element.
</audio>
                    </div>`;

      const colSongClasses = document.getElementsByClassName("colSong");
      const audioTag = document.getElementsByTagName("audio");
      colSongClasses[i].addEventListener("click", () => {
        console.log("colSongClasses[i]", colSongClasses[i]);
        console.log("Hai premuto");
        audioTag[i].play();
      });
      //                     <audio autoplay>
      //   <source src="${song.preview}" type="audio/mpeg">
      // Your browser does not support the audio element.
      // </audio>

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
      //
    });
  })

  .catch((err) => console.log("Errore!", err));
