// Gestione click sulle playlist nella libreria

document.addEventListener("DOMContentLoaded", function () {
  // Carica la traccia salvata dal PlayerManager se disponibile
  if (window.playerManager) {
    window.playerManager.loadSavedTrack();
  }

  console.log("Libreria.js caricato");

  document.querySelectorAll(".library-item").forEach(function (item, index) {
    // Prendi il tipo (Playlist/Album/Artista)
    const typeSpan = item.querySelector(".item-type");
    const title = item.querySelector(".item-title");

    console.log(`Elemento ${index}:`, {
      title: title?.textContent?.trim(),
      type: typeSpan?.textContent?.trim(),
    });

    if (typeSpan && typeSpan.textContent.trim() === "Playlist") {
      console.log(
        `Aggiungendo click listener per: ${title?.textContent?.trim()}`
      );
      item.style.cursor = "pointer";
      item.addEventListener("click", function (e) {
        console.log("Click su playlist:", title?.textContent?.trim());
        e.preventDefault();
        e.stopPropagation();

        const imgEl = item.querySelector(".item-cover img");
        let imgParam = "";
        if (imgEl && imgEl.getAttribute("src")) {
          imgParam = "&img=" + encodeURIComponent(imgEl.getAttribute("src"));
        }
        if (title) {
          const name = title.textContent.trim();
          console.log(
            "Reindirizzamento a:",
            `playlist.html?name=${encodeURIComponent(name)}${imgParam}`
          );
          sessionStorage.setItem("playlistBack", "libreria");
          window.location.href = `playlist.html?name=${encodeURIComponent(
            name
          )}${imgParam}`;
        }
      });
    }
  });

  // Gestione click su 'Brani che ti piacciono' nella libreria
  document.querySelectorAll(".item-title").forEach(function (el) {
    if (el.textContent.trim() === "Brani che ti piacciono") {
      el.closest(".library-item")?.addEventListener("click", function (e) {
        e.preventDefault?.();
        sessionStorage.setItem("playlistBack", "libreria");
        window.location.href =
          "playlist.html?name=" +
          encodeURIComponent("Brani che ti piacciono") +
          "&liked=1";
      });
    }
  });
});

// Per chiudere la side destra degli amici
const closeButton = document.getElementById("chiudi");
const friendSection = document.getElementById("friendSection");
const iconFriends = document.getElementById("iconFriends");
const mainContentSection = document.getElementsByClassName("main-content")[0];

mainContentSection.style.transition = "all 0.1s linear";

let isFriendSideOpen = true;
let isLeftSideOpen = true;

closeButton.addEventListener("click", () => {
  console.log("Chiudiamo questa sidebar destra");
  friendSection.style.width = "0px";
  friendSection.style.padding = "0px";
  iconFriends.classList.remove("d-none");
  mainContentSection.style.setProperty("margin-right", "0px", "important");
  isFriendSideOpen = false;
  if (isLeftSideOpen) {
    mainContentSection.style.width = "calc(100% - 320px)";
  } else {
    mainContentSection.style.width = "100%";
  }
});

// Per riaprire la side amici

iconFriends.addEventListener("click", () => {
  isFriendSideOpen = true;
  friendSection.style.width = "320px";
  friendSection.style.padding = "16px";
  iconFriends.classList.add("d-none");
  mainContentSection.style.marginRight = "320px";
  if (isLeftSideOpen) {
    mainContentSection.style.width = "calc(100% - 640px)";
  } else {
    mainContentSection.style.width = "calc(100% - 320px)";
  }
});

// Per chiudere la side sinistra
const closeLeftSide = document.getElementById("closeLeftSide");
const openLeftSide = document.getElementById("openLeftSide");
const navSection = document.getElementById("navSection");

openLeftSide.style.transition = "all 0.1s linear";

closeLeftSide.addEventListener("click", () => {
  console.log("Chiudiamo questa sidebar sinistra");
  navSection.style.setProperty("display", "none", "important");
  navSection.style.padding = "0px";
  openLeftSide.classList.remove("d-none");
  mainContentSection.style.setProperty("margin-left", "0px", "important");
  isLeftSideOpen = false;
  if (isFriendSideOpen) {
    mainContentSection.style.width = "calc(100% - 320px)";
  } else {
    mainContentSection.style.width = "100%";
  }
});

// Per riaprire la side sinistra

openLeftSide.addEventListener("click", () => {
  console.log("Apriamo questa side sinistra");
  isLeftSideOpen = true;
  navSection.style.setProperty("display", "flex", "important");
  navSection.style.padding = "16px";
  openLeftSide.classList.add("d-none");
  mainContentSection.style.marginLeft = "320px";
  if (isFriendSideOpen) {
    mainContentSection.style.width = "calc(100% - 640px)";
  } else {
    mainContentSection.style.width = "calc(100% - 320px)";
  }
});
