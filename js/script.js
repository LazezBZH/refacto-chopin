// DOM
const home = document.querySelector("#home");
const enterButton = document.querySelector("#button-enter");
const menu = document.querySelector("#menu");
const menuSvg = document.querySelector("#menu svg");
const articleContainer = document.querySelectorAll(".article-container");
const nav = document.querySelector("#nav");
const audio = document.querySelectorAll(".audio");
const pianoKeys = document.querySelectorAll("#piano-key path");
const texts = document.querySelectorAll("#menu-svg text");
const menuBtns = document.querySelectorAll("#menu-svg .menu-btn");
const bgImage = document.querySelectorAll(".background-image");

// VARIABLES
const musics = [];
musics[0] = new Audio("../assets/audio/etude_op_10_no3.mp3");
musics[1] = new Audio("../assets/audio/valse_op_18.mp3");
musics[2] = new Audio("../assets/audio/valse_op_64_no1.mp3");
let readyToPlay = false;
let displayedSection = -1;
let refTitle = "";

// EVENTS
nav.addEventListener("click", shrink);
enterButton.addEventListener("click", enter);
menuBtns.forEach((btn) => {
  btn.addEventListener("click", goTo);
});
audio.forEach((elt) => {
  elt.addEventListener("mouseenter", playAudio);
  elt.addEventListener("mouseout", stopAudio);
});

// FONCTIONS
function changeSection(ref) {
  if (ref > -1) {
    articleContainer[ref].style.transitionDuration = "0.5s";
    articleContainer[ref].style.transitionDelay = "2.5s";
    articleContainer[ref].classList.add("show");
    bgImage.forEach((element) => {
      ref == parseInt(element.getAttribute("data-ref"))
        ? element.classList.add("show")
        : element.classList.remove("show");
    });
    displayedSection = ref;
    setTimeout(() => {
      progressivDisplay(
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
    bgImage.forEach((element) => element.classList.remove("show"));
    disparitionElements(
      articleContainer[displayedSection].getElementsByClassName(
        "article-content"
      )
    );
    setTimeout(() => {
      articleContainer[displayedSection].style.transitionDuration = "0.25s";
      articleContainer[displayedSection].style.transitionDelay = "0";
      articleContainer[displayedSection].classList.remove("show");
    }, 1000);
    readyToPlay = false;
    audio.forEach((element) => {
      element.style.cursor = "default";
    });
  }
}

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

function disparitionElements(elements) {
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

function enter() {
  enterButton.style.cursor = "default";
  enterButton.pointerEvents = "none";

  home.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 1000,
    fill: "forwards",
  });

  setTimeout(() => {
    home.remove();
    init();
  }, 1200);
}

function fisherYates(array) {
  for (var i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function goTo(e) {
  spread(parseInt(e.target.getAttribute("data-ref")));
}

function init() {
  let suffleIndex = fisherYates(
    [...new Array(pianoKeys.length)].map((x, i) => i)
  );
  suffleIndex.forEach((val, key) => {
    pianoKeys[val].style.transitionDelay = `${key * 100}ms`;
    pianoKeys[val].classList.add("show");
  });

  setTimeout(() => {
    menuSvg.style.transform = "rotate(45deg)";
    menuSvg.style.transition = "transform 1.5s cubic-bezier(0.8, -1, 0.5, 0.9)";
  }, 2500);

  setTimeout(() => {
    texts.forEach((element, index) => {
      element.parentElement.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 250,
        delay: index * 250,
        fill: "forwards",
      });
    });

    menuBtns.forEach((element) => {
      element.classList.add("actif");
    });
  }, 3600);
}

function playAudio(e) {
  refTitle = parseInt(e.target.getAttribute("data-mus"));
  if (readyToPlay) {
    musics[refTitle].loop = true;
    musics[refTitle].play();
  }
  return (refTitle = refTitle);
}

function progressivDisplay(elements) {
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

function shrink() {
  changeSection(-1);

  pianoKeys.forEach((element) => {
    element.classList.add("show");
    element.classList.remove("invert");
  });

  setTimeout(() => {
    menuBtns.forEach((element) => element.classList.add("actif"));

    texts.forEach((element) => {
      element.parentElement.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 250,
        fill: "forwards",
      });
    });
  }, 2000);
}

function spread(ref) {
  changeSection(ref);

  menuBtns.forEach((element) => element.classList.remove("actif"));

  pianoKeys.forEach((element) => {
    element.classList.remove("show");
    element.classList.add("invert");
  });

  texts.forEach((element) => {
    element.parentElement.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 100,
      delay: 0,
      fill: "forwards",
    });
  });
}

function stopAudio() {
  if (readyToPlay) {
    musics[refTitle].pause();
    musics[refTitle].currentTime = 0;
  }
}
