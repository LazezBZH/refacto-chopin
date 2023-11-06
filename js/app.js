const url = [
  "https://twitter.com/ChopinInstitute",
  "https://fr.wikipedia.org/wiki/Fr%C3%A9d%C3%A9ric_Chopin",
  "https://www.canalacademies.com/emissions/les-series/chopin-vu-par-chopin",
  "https://www.youtube.com/watch?v=Of5I0TpUze4&ab_channel=TimelessClassicalMusic",
];

const musics = [];
//  audio déplacées dans assets/audio; fichiers audio compressés pour les performances (si c'est grave mes plus plates excuses mais d'après moi pour un site pas besoin de la même qualité que pour passer sur le super matos que mon voisin fabrique)
musics[0] = new Audio("../assets/audio/etude_op_10_no3.mp3");
musics[1] = new Audio("../assets/audio/valse_op_18.mp3");
musics[2] = new Audio("../assets/audio/valse_op_64_no1.mp3");

// ELEMENTS DU DOM

const home = document.querySelector("#home");
const enterButton = document.querySelector("#button-enter");

const menu = document.querySelector("#menu");
const menuSvg = document.querySelector("#menu svg");

const articleContainer = document.querySelectorAll(".article-container");
const nav = document.querySelector("#nav");

const audio = document.querySelectorAll(".audio");
const links = document.querySelectorAll(".link");

// readytoplay mis en camelCase
var readyToPlay = false;

// AFFICHAGE ANIME DES VILLES VISITÉES PAR CHOPIN

function cityNameAnimate() {
  let cityToDisplay = document.querySelectorAll("#city text");
  let cityNames = [
    "Aix-la-Chapelle",
    "Azay-sur-Cher",
    "Barcelone",
    "Berlin",
    "Bruxelles",
    "Carlsbad",
    "Decin",
    "Dresde",
    "Edimbourg",
    "Gênes",
    "Glasgow",
    "Leipzig",
    "Londres",
    "Manchester",
    "Marienbad",
    "Marseille",
    "Munich",
    "Nohant",
    "Palma",
    "Perpignan",
    "Prague",
    "Rouen",
    "Stuttgart",
    "Vienne",
  ];
  let count = 0;
  let duree = 3000;

  cityToDisplay.forEach((city, index) => {
    setTimeout(() => {
      setInterval(() => {
        count = count + 1 < cityNames.length ? count + 1 : 0;
        city.innerHTML = cityNames[count];
        city.animate(
          [
            { opacity: 0, transform: "scale(0.6)" },
            { opacity: 1 },
            { opacity: 0, transform: "scale(2.2)" },
          ],
          { duration: duree - 300, iterations: 1, fill: "forwards" }
        );
      }, duree);
    }, 900 * index);
  });
}

cityNameAnimate();

// CONFIGURATION DE LA LECTURE DES AUDIO AU SURVOL

function audioPlay() {
  audio.forEach((element) => {
    let ref = parseInt(element.getAttribute("data-mus"));
    element.addEventListener("mouseenter", () => {
      if (readyToPlay) {
        musics[ref].loop = true;
        musics[ref].play();
      }
    });
    element.addEventListener("mouseout", () => {
      if (readyToPlay) {
        musics[ref].pause();
        musics[ref].currentTime = 0;
      }
    });
  });
}

audioPlay();

// FONCTION DE MELANGE

function fisherYates(array) {
  for (var i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// NAVIGATION

const AnimateNavigation = new (class {
  menuSvg = document.querySelector("#menu-svg");
  pianoKeys = document.querySelectorAll("#piano-key path");
  texts = document.querySelectorAll("#menu-svg text");
  menuBtns = document.querySelectorAll("#menu-svg .menu-btn");

  bgImage = document.querySelectorAll(".background-image");

  displayedSection = -1;

  // je pense que nommer ceci init est mieux
  init() {
    let suffleIndex = fisherYates(
      [...new Array(this.pianoKeys.length)].map((x, i) => i)
    );

    suffleIndex.forEach((val, key) => {
      this.pianoKeys[val].style.transitionDelay = `${key * 100}ms`;
      this.pianoKeys[val].classList.add("show");
    });

    setTimeout(() => {
      this.menuSvg.style.transform = "rotate(45deg)";
      this.menuSvg.style.transition =
        "transform 1.5s cubic-bezier(0.8, -1, 0.5, 0.9)";
    }, 2500);

    setTimeout(() => {
      this.texts.forEach((element, index) => {
        element.parentElement.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 250,
          delay: index * 250,
          fill: "forwards",
        });
      });

      this.menuBtns.forEach((element) => {
        element.classList.add("actif");
        element.addEventListener("click", () => {
          this.spread(parseInt(element.getAttribute("data-ref")));
        });
      });
    }, 3600);
  }

  spread(ref) {
    this.changeSection(ref);

    this.menuBtns.forEach((element) => element.classList.remove("actif"));

    this.pianoKeys.forEach((element) => {
      element.classList.remove("show");
      element.classList.add("invert");
    });

    this.texts.forEach((element) => {
      element.parentElement.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 100,
        delay: 0,
        fill: "forwards",
      });
    });
  }

  shrink() {
    this.changeSection(-1);

    this.pianoKeys.forEach((element) => {
      element.classList.add("show");
      element.classList.remove("invert");
    });

    setTimeout(() => {
      this.menuBtns.forEach((element) => element.classList.add("actif"));

      this.texts.forEach((element) => {
        element.parentElement.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 250,
          fill: "forwards",
        });
      });
    }, 2000);
  }

  changeSection(ref) {
    if (ref > -1) {
      articleContainer[ref].style.transitionDuration = "0.5s";
      articleContainer[ref].style.transitionDelay = "2.5s";
      articleContainer[ref].classList.add("show");
      this.bgImage.forEach((element) => {
        ref == parseInt(element.getAttribute("data-ref"))
          ? element.classList.add("show")
          : element.classList.remove("show");
      });
      this.displayedSection = ref;
      setTimeout(() => {
        this.progressivDisplay(
          articleContainer[ref].getElementsByClassName("article-content")
        );
      }, 2600);
      if (ref == 1) {
        setTimeout(() => {
          readyToPlay = true;
          audio.forEach((element) => {
            element.style.cursor = "wait";
          });
        }, 5500);
      }
    } else {
      this.bgImage.forEach((element) => element.classList.remove("show"));
      this.disparitionElements(
        articleContainer[this.displayedSection].getElementsByClassName(
          "article-content"
        )
      );
      setTimeout(() => {
        articleContainer[this.displayedSection].style.transitionDuration =
          "0.25s";
        articleContainer[this.displayedSection].style.transitionDelay = "0";
        articleContainer[this.displayedSection].classList.remove("show");
      }, 1000);
      readyToPlay = false;
      audio.forEach((element) => {
        element.style.cursor = "default";
      });
    }
  }

  progressivDisplay(elements) {
    let childElemements = elements[0].children;
    let count = childElemements.length;
    nav.classList.add("show");
    for (let i = 0; i < count; i++) {
      childElemements[i].animate(
        [
          { opacity: 0, transform: "scale(0.6)" },
          { opacity: 1, transform: "scale(1.0)" },
        ],
        {
          duration: 1500,
          delay: 500 * i,
          easing: "ease-out",
          iteration: 1,
          fill: "forwards",
        }
      );
    }
  }

  disparitionElements(elements) {
    nav.classList.remove("show");
    let childElemements = elements[0].children;
    let count = childElemements.length;
    for (let i = 0; i < count; i++) {
      childElemements[i].animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 900,
        iteration: 1,
        fill: "forwards",
      });
    }
  }
})();

//

nav.addEventListener("click", () => {
  AnimateNavigation.shrink();
});

links.forEach((element) =>
  element.addEventListener("click", function () {
    let index = parseInt(element.getAttribute("data-lnk"));
    window.open(url[index], "_blank");
  })
);

enterButton.addEventListener("click", function () {
  enterButton.style.cursor = "default";
  enterButton.pointerEvents = "none";

  home.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 1000,
    fill: "forwards",
  });

  setTimeout(() => {
    home.remove();
    AnimateNavigation.init();
  }, 1200);
});
