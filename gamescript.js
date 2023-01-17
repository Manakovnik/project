const cards = document.querySelectorAll(".card");

let openedCard = false;
let firstCard, secondCard;
let isCardMathed = null;
let counterOfMatches = 0;
let timer;
let seconds = 60;

countdown();

function countdown() {
    document.getElementById('timer').innerHTML = `Осталось ${seconds} секунд`;
    seconds--;
    if (seconds < 0) {
        clearTimeout(timer);
        if (confirm('Время вышло')) {
            restartGame()
            seconds = 60
        }
    } else {
        timer = setTimeout(countdown, 1000)
        if (seconds < 10) {
            document.getElementById('timer').style.color = 'red';
        }
    }
}


const restartBtn = document.getElementById("restart");
const newGameBtn = document.getElementById("new");

function openCard(e) {
  if (isCardMathed === false) {
    unMatchCards();
    return;
  }

  const target = e.target;

  if (target === firstCard) return;

  target.classList.add("open");

  if (!openedCard) {
    openedCard = true;
    firstCard = target;
  } else {
    secondCard = target;
    checkMatch();
  }

  if (counterOfMatches == 8) {
    victory();
  }
}

const checkMatch = () => {
  if (firstCard.textContent === secondCard.textContent) {
    isCardMathed = null;
    matchCards();
    reset();
  } else {
    isCardMathed = false;
  }
};

const matchCards = () => {
  firstCard.classList.add("found");
  secondCard.classList.add("found");
  firstCard.removeEventListener("click", openCard);
  secondCard.removeEventListener("click", openCard);
  counterOfMatches++;
};

const unMatchCards = () => {
  firstCard.classList.remove("open");
  secondCard.classList.remove("open");
  reset();
};

const reset = () => {
  openedCard = false;
  firstCard = secondCard = isCardMathed = null;
};

cards.forEach((card) => {
  card.addEventListener("click", openCard);
  shuffleCard(card);
});

const restartGame = () => {
  reset();
  cards.forEach((card) => {
    shuffleCard(card);
    card.classList = "card";
    card.addEventListener("click", openCard);
    counterOfMatches = 0;
  });
  seconds = 60
  document.getElementById('timer').style.color = 'white';
  countdown()
};

function victory() {
  newGameBtn.style.display = "flex";
  clearTimeout(timer);
}

function fail() {
    cards.removeEventListener('click', openCard)
}

function newGame() {
  newGameBtn.style.display = "none";
  restartGame();
}

function shuffleCard(card) {
  const randomIndex = Math.floor(Math.random() * cards.length);
  card.style.order = randomIndex;
}

restartBtn.addEventListener("click", restartGame);
newGameBtn.addEventListener("click", newGame);
