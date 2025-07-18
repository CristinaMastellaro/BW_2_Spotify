// Gestione click sulle playlist nella homepage

document.addEventListener("DOMContentLoaded", function () {
  // Carica la traccia salvata dal PlayerManager se disponibile
  if (window.playerManager) {
    window.playerManager.loadSavedTrack();
  }

  // Sidebar: playlist testuali
  document.querySelectorAll(".playlist-item").forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      // Prendo il nome dalla scritta interna
      const name = item.textContent.trim();
      window.location.href = `playlist.html?name=${encodeURIComponent(name)}`;
    });
  });

  // Card centrali: playlist grafiche
  document.querySelectorAll(".spotify-playlist-item").forEach(function (card) {
    card.addEventListener("click", function (e) {
      // Previeni il click se è su un elemento figlio che ha già un event listener
      if (e.target.closest("a") || e.target.closest("button")) {
        return;
      }

      const title = card.querySelector(".spotify-title");
      let img = "";
      let imgParams = "";

      // Se ci sono 4 immagini, passale tutte
      const imgs = card.querySelectorAll(".spotify-mini-cover");
      if (imgs.length === 4) {
        imgParams = Array.from(imgs)
          .map(
            (el, i) =>
              `img${i + 1}=${encodeURIComponent(el.getAttribute("src"))}`
          )
          .join("&");
      } else {
        // fallback: prendi la prima immagine
        const imgEl = card.querySelector(
          ".spotify-mini-cover, .spotify-single-img, .spotify-liked-cover i, .spotify-liked-cover"
        );
        if (imgEl && imgEl.tagName === "IMG") {
          img = imgEl.getAttribute("src");
        } else if (imgEl && imgEl.classList.contains("spotify-liked-cover")) {
          img = "assets/imgs/main/image-17.jpg";
        }
      }

      if (title) {
        const name = title.textContent.trim();

        // Gestione speciale per "Brani che ti piacciono"
        if (name === "Brani che ti piacciono") {
          window.location.href =
            "playlist.html?name=" + encodeURIComponent(name) + "&liked=1";
          return;
        }

        let url = `playlist.html?name=${encodeURIComponent(name)}`;
        if (imgParams) {
          url += `&${imgParams}`;
        } else if (img) {
          url += `&img=${encodeURIComponent(img)}`;
        }
        window.location.href = url;
      }
    });
  });

  // Card grandi in basso: playlist in evidenza
  document
    .querySelectorAll(".spotify-featured-playlist")
    .forEach(function (card) {
      card.addEventListener("click", function (e) {
        // Previeni il click se è su un elemento figlio che ha già un event listener
        if (e.target.closest("button") || e.target.closest("i")) {
          return;
        }

        const title = card.querySelector(".spotify-featured-title");
        let img = "";
        let imgParams = "";
        const imgs = card.querySelectorAll(".spotify-large-cover");
        if (imgs.length === 4) {
          imgParams = Array.from(imgs)
            .map(
              (el, i) =>
                `img${i + 1}=${encodeURIComponent(el.getAttribute("src"))}`
            )
            .join("&");
        } else if (imgs.length > 0) {
          img = imgs[0].getAttribute("src");
        }
        if (title) {
          const name = title.textContent.trim();
          let url = `playlist.html?name=${encodeURIComponent(name)}`;
          if (imgParams) {
            url += `&${imgParams}`;
          } else if (img) {
            url += `&img=${encodeURIComponent(img)}`;
          }
          window.location.href = url;
        }
      });
    });

  // Gestione click su 'Brani che ti piacciono' nella sidebar
  document.querySelectorAll(".fw-bold").forEach(function (el) {
    if (el.textContent.trim() === "Brani che ti piacciono") {
      const parentLink = el.closest("a");
      if (parentLink) {
        parentLink.addEventListener("click", function (e) {
          e.preventDefault();
          window.location.href =
            "playlist.html?name=" +
            encodeURIComponent("Brani che ti piacciono") +
            "&liked=1";
        });
      }
    }
  });

  // Per chiudere la side destra degli amici
  const closeButton = document.getElementById("chiudi");
  const friendSection = document.getElementById("friendSection");
  const iconFriends = document.getElementById("iconFriends");
  const mainContentSection = document.getElementsByClassName("main-content")[0];

  if (mainContentSection) {
    mainContentSection.style.transition = "all 0.1s linear";
  }

  let isFriendSideOpen = true;
  let isLeftSideOpen = true;

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      console.log("Chiudiamo questa sidebar destra");
      if (friendSection) {
        friendSection.style.width = "0px";
        friendSection.style.padding = "0px";
      }
      if (iconFriends) {
        iconFriends.classList.remove("d-none");
      }
      if (mainContentSection) {
        mainContentSection.style.setProperty(
          "margin-right",
          "0px",
          "important"
        );
        isFriendSideOpen = false;
        if (isLeftSideOpen) {
          mainContentSection.style.width = "calc(100% - 320px)";
        } else {
          mainContentSection.style.width = "100%";
        }
      }
    });

    // Card centrali: playlist grafiche
    document
      .querySelectorAll(".spotify-playlist-item")
      .forEach(function (card) {
        card.addEventListener("click", function () {
          const title = card.querySelector(".spotify-title");
          let img = "";
          let imgParams = "";
          // Se ci sono 4 immagini, passale tutte
          const imgs = card.querySelectorAll(".spotify-mini-cover");
          if (imgs.length === 4) {
            imgParams = Array.from(imgs)
              .map(
                (el, i) =>
                  `img${i + 1}=${encodeURIComponent(el.getAttribute("src"))}`
              )
              .join("&");
          } else {
            // fallback: prendi la prima immagine
            const imgEl = card.querySelector(
              ".spotify-mini-cover, .spotify-single-img, .spotify-liked-cover i, .spotify-liked-cover"
            );
            if (imgEl && imgEl.tagName === "IMG") {
              img = imgEl.getAttribute("src");
            } else if (
              imgEl &&
              imgEl.classList.contains("spotify-liked-cover")
            ) {
              img = "assets/imgs/main/image-17.jpg";
            }
          }
          if (title) {
            const name = title.textContent.trim();
            let url = `playlist.html?name=${encodeURIComponent(name)}`;
            if (imgParams) {
              url += `&${imgParams}`;
            } else if (img) {
              url += `&img=${encodeURIComponent(img)}`;
            }
            window.location.href = url;
          }
        });
      });

    // Card grandi in basso: playlist in evidenza
    document
      .querySelectorAll(".spotify-featured-playlist")
      .forEach(function (card) {
        card.addEventListener("click", function () {
          const title = card.querySelector(".spotify-featured-title");
          let img = "";
          let imgParams = "";
          const imgs = card.querySelectorAll(".spotify-large-cover");
          if (imgs.length === 4) {
            imgParams = Array.from(imgs)
              .map(
                (el, i) =>
                  `img${i + 1}=${encodeURIComponent(el.getAttribute("src"))}`
              )
              .join("&");
          } else if (imgs.length > 0) {
            img = imgs[0].getAttribute("src");
          }
          if (title) {
            const name = title.textContent.trim();
            let url = `playlist.html?name=${encodeURIComponent(name)}`;
            if (imgParams) {
              url += `&${imgParams}`;
            } else if (img) {
              url += `&img=${encodeURIComponent(img)}`;
            }
            window.location.href = url;
          }
        });
      });

    // Gestione click su 'Brani che ti piacciono' (sidebar e card centrale)
    document
      .querySelectorAll(".fw-bold, .spotify-title")
      .forEach(function (el) {
        if (el.textContent.trim() === "Brani che ti piacciono") {
          el.closest("a, .spotify-playlist-item")?.addEventListener(
            "click",
            function (e) {
              e.preventDefault?.();
              window.location.href =
                "playlist.html?name=" +
                encodeURIComponent("Brani che ti piacciono") +
                "&liked=1";
            }
          );
        }
      });
  }
});
const cuore = document.getElementsByClassName("cuore");
console.log(cuore[0].verde);
cuore[0].addEventListener("click", () => {
  if (!cuore[0].classList.contains("verde")) {
    cuore[0].classList.add("verde");
    const spazioAlert = document.getElementById("alert");
    const divAlert = document.createElement("div");
    divAlert.textContent = "Brano Aggiunto ai Preferiti!";
    divAlert.style.position = "absolute";
    divAlert.style.left = "180px";
    spazioAlert.appendChild(divAlert);
    setTimeout(() => {
      spazioAlert.remove();
    }, 2000);
  } else {
    cuore[0].classList.remove("verde");

    // Sidebar: playlist testuali
    document.querySelectorAll(".playlist-item").forEach(function (item) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        // Prendo il nome dalla scritta interna
        const name = item.textContent.trim();
        window.location.href = `playlist.html?name=${encodeURIComponent(name)}`;
      });
    });

    // Card centrali: playlist grafiche
    document
      .querySelectorAll(".spotify-playlist-item")
      .forEach(function (card) {
        card.addEventListener("click", function (e) {
          // Previeni il click se è su un elemento figlio che ha già un event listener
          if (e.target.closest("a") || e.target.closest("button")) {
            return;
          }

          const title = card.querySelector(".spotify-title");
          let img = "";
          let imgParams = "";

          // Se ci sono 4 immagini, passale tutte
          const imgs = card.querySelectorAll(".spotify-mini-cover");
          if (imgs.length === 4) {
            imgParams = Array.from(imgs)
              .map(
                (el, i) =>
                  `img${i + 1}=${encodeURIComponent(el.getAttribute("src"))}`
              )
              .join("&");
          } else {
            // fallback: prendi la prima immagine
            const imgEl = card.querySelector(
              ".spotify-mini-cover, .spotify-single-img, .spotify-liked-cover i, .spotify-liked-cover"
            );
            if (imgEl && imgEl.tagName === "IMG") {
              img = imgEl.getAttribute("src");
            } else if (
              imgEl &&
              imgEl.classList.contains("spotify-liked-cover")
            ) {
              img = "assets/imgs/main/image-17.jpg";
            }
          }

          if (title) {
            const name = title.textContent.trim();

            // Gestione speciale per "Brani che ti piacciono"
            if (name === "Brani che ti piacciono") {
              window.location.href =
                "playlist.html?name=" + encodeURIComponent(name) + "&liked=1";
              return;
            }

            let url = `playlist.html?name=${encodeURIComponent(name)}`;
            if (imgParams) {
              url += `&${imgParams}`;
            } else if (img) {
              url += `&img=${encodeURIComponent(img)}`;
            }
            window.location.href = url;
          }
        });
      });

    // Card grandi in basso: playlist in evidenza
    document
      .querySelectorAll(".spotify-featured-playlist")
      .forEach(function (card) {
        card.addEventListener("click", function (e) {
          // Previeni il click se è su un elemento figlio che ha già un event listener
          if (e.target.closest("button") || e.target.closest("i")) {
            return;
          }

          const title = card.querySelector(".spotify-featured-title");
          let img = "";
          let imgParams = "";
          const imgs = card.querySelectorAll(".spotify-large-cover");
          if (imgs.length === 4) {
            imgParams = Array.from(imgs)
              .map(
                (el, i) =>
                  `img${i + 1}=${encodeURIComponent(el.getAttribute("src"))}`
              )
              .join("&");
          } else if (imgs.length > 0) {
            img = imgs[0].getAttribute("src");
          }
          if (title) {
            const name = title.textContent.trim();
            let url = `playlist.html?name=${encodeURIComponent(name)}`;
            if (imgParams) {
              url += `&${imgParams}`;
            } else if (img) {
              url += `&img=${encodeURIComponent(img)}`;
            }
            window.location.href = url;
          }
        });
      });

    // Gestione click su 'Brani che ti piacciono' nella sidebar
    document.querySelectorAll(".fw-bold").forEach(function (el) {
      if (el.textContent.trim() === "Brani che ti piacciono") {
        const parentLink = el.closest("a");
        if (parentLink) {
          parentLink.addEventListener("click", function (e) {
            e.preventDefault();
            window.location.href =
              "playlist.html?name=" +
              encodeURIComponent("Brani che ti piacciono") +
              "&liked=1";
          });
        }
      }
    });

    // Per chiudere la side destra degli amici
    const closeButton = document.getElementById("chiudi");
    const friendSection = document.getElementById("friendSection");
    const iconFriends = document.getElementById("iconFriends");
    const mainContentSection =
      document.getElementsByClassName("main-content")[0];

    if (mainContentSection) {
      mainContentSection.style.transition = "all 0.1s linear";
    }

    let isFriendSideOpen = true;
    let isLeftSideOpen = true;

    if (closeButton) {
      closeButton.addEventListener("click", () => {
        console.log("Chiudiamo questa sidebar destra");
        if (friendSection) {
          friendSection.style.width = "0px";
          friendSection.style.padding = "0px";
        }
        if (iconFriends) {
          iconFriends.classList.remove("d-none");
        }
        if (mainContentSection) {
          mainContentSection.style.setProperty(
            "margin-right",
            "0px",
            "important"
          );
          isFriendSideOpen = false;
          if (isLeftSideOpen) {
            mainContentSection.style.width = "calc(100% - 320px)";
          } else {
            mainContentSection.style.width = "100%";
          }
        }
      });
    }

    // Per riaprire la side amici
    if (iconFriends) {
      iconFriends.addEventListener("click", () => {
        isFriendSideOpen = true;
        if (friendSection) {
          friendSection.style.width = "320px";
          friendSection.style.padding = "16px";
        }
        if (iconFriends) {
          iconFriends.classList.add("d-none");
        }
        if (mainContentSection) {
          mainContentSection.style.marginRight = "320px";
          if (isLeftSideOpen) {
            mainContentSection.style.width = "calc(100% - 640px)";
          } else {
            mainContentSection.style.width = "calc(100% - 320px)";
          }
        }
      });
    }

    // Per chiudere la side sinistra
    const closeLeftSide = document.getElementById("closeLeftSide");
    const openLeftSide = document.getElementById("openLeftSide");
    const navSection = document.getElementById("navSection");

    if (openLeftSide) {
      openLeftSide.style.transition = "all 0.1s linear";
    }

    if (closeLeftSide) {
      closeLeftSide.addEventListener("click", () => {
        console.log("Chiudiamo questa sidebar sinistra");
        if (navSection) {
          navSection.style.setProperty("display", "none", "important");
          navSection.style.padding = "0px";
        }
        if (openLeftSide) {
          openLeftSide.classList.remove("d-none");
        }
        if (mainContentSection) {
          mainContentSection.style.setProperty(
            "margin-left",
            "0px",
            "important"
          );
          isLeftSideOpen = false;
          if (isFriendSideOpen) {
            mainContentSection.style.width = "calc(100% - 320px)";
          } else {
            mainContentSection.style.width = "100%";
          }
        }
      });
    }

    // Per riaprire la side sinistra
    if (openLeftSide) {
      openLeftSide.addEventListener("click", () => {
        console.log("Apriamo questa side sinistra");
        isLeftSideOpen = true;
        if (navSection) {
          navSection.style.setProperty("display", "flex", "important");
          navSection.style.padding = "16px";
        }
        if (openLeftSide) {
          openLeftSide.classList.add("d-none");
        }
        if (mainContentSection) {
          mainContentSection.style.marginLeft = "320px";
          if (isFriendSideOpen) {
            mainContentSection.style.width = "calc(100% - 640px)";
          } else {
            mainContentSection.style.width = "calc(100% - 320px)";
          }
        }
      });
    }
  }
});
