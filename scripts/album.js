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
    document.querySelector("h6.card-text").innerText += dataAlbum.artist.name;
    // Anno di rilascio dell'album
    document.querySelector("p.card-text").innerText +=
      " " +
      //   dataAlbum["release_date"];
      dataAlbum["release_date"].split("-")[0];

    // Info singole canzoni
    dataAlbum.tracks.data.forEach((song) => {
      // Aggiungere o meno il disclaimer per canzoni esplicite
      let explicit = `<p class="text-secondary"> ${song.artist.name}</p>`;
      if (song.explicit_lyrics) {
        explicit = `<p class="text-secondary"><i class="fab fa-etsy"></i> ${song.artist.name}</p>`;
      }

      document.getElementById(
        "containerSongs"
      ).innerHTML += `<div class="infoSong d-flex justify-content-between px-2 d-block d-lg-none">
          <div class="song d-flex flex-column ms-3">

            <h5 class="text-light">${song.title}</h5>
            ${explicit}
          </div>
          <!--nome singolo e artista-->
          <div class="point"><i class="bi bi-three-dots-vertical text-secondary"></i></div>
        </div>`;
    });
  })
  .catch((err) => console.log("Errore!", err));
