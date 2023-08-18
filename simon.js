const green = document.getElementById("green");
const red = document.getElementById("red");
const orange = document.getElementById("orange");
const blue = document.getElementById("blue");

const colors = ["green", "red", "orange", "blue"];

const audioBlue = new Audio("assets/B_FLAT_BLUE.mp3");
const audioGreen = new Audio("assets/B_FLAT_GREEN.mp3");
const audioYellow = new Audio("assets/C_SHARP_YELLOW.mp3");
const audioRed = new Audio("assets/F_RED.mp3");
const playButton = document.querySelector("#play");

let answers = [];
let score = 0;

const pushNextAnswer = (answers) => {
  return [...answers, colors[Math.floor(Math.random() * 4)]];
};

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

const waitForSelection = (elementId) => {
  return new Promise(function (resolve) {
    async function clickHandler(event) {
      colors.forEach((color) => {
        document
          .getElementById(color)
          .removeEventListener("click", clickHandler);
      });
      playSound(event.target.id);
      await illuminateElement(event.target.id);
      event.target.id === elementId ? resolve(true) : resolve(false);
    }

    colors.forEach((color) => {
      document.getElementById(color).addEventListener("click", clickHandler);
    });
  });
};

const playSound = (color) => {
  pauseAndRestartAudio();
  switch (color) {
    case "blue":
      audioBlue.play();
      break;
    case "green":
      audioGreen.play();
      break;
    case "orange":
      audioYellow.play();
      break;
    case "red":
      audioRed.play();
      break;
    default:
      return;
  }
};

const pauseAndRestartAudio = () => {
  audioBlue.pause();
  audioBlue.currentTime = 0;
  audioGreen.pause();
  audioGreen.currentTime = 0;
  audioRed.pause();
  audioRed.currentTime = 0;
  audioYellow.pause();
  audioYellow.currentTime = 0;
};

const illuminateElement = async (id) => {
  console.log("illuminate ", id, "!");
  document.getElementById(id).classList.add("active");
  return new Promise((resolve) =>
    setTimeout(() => {
      document.getElementById(id).classList.remove("active");
      resolve();
    }, 600)
  );
};

const showAnswers = async (answerArray) => {
  for (const answer of answerArray) {
    await delay(200);
    playSound(answer);
    await illuminateElement(answer);
  }
};

const clearGame = () => {
  document.getElementById("game-message").innerHTML = "";
  score = 0;
  document.getElementById("game-score").innerHTML = 0;
  answers = [];
};

async function gameLoop() {
  clearGame();
  document.getElementById("play").disabled = true;
  mainLoop: while (true) {
    answers = pushNextAnswer(answers);
    console.log(answers);
    await showAnswers(answers);
    for (let answer of answers) {
      const isSelectionCorrect = await waitForSelection(answer);
      if (isSelectionCorrect) {
        continue;
      } else {
        document.getElementById("play").disabled = false;
        document.getElementById("game-message").innerHTML =
          '<h3 id="game-message-end">Game Over!</h3>';
        break mainLoop;
      }
    }
    document.getElementById("game-score").innerHTML = ++score;
  }
}

document.getElementById("game-message").innerHTML =
  '<h3 id="game-message-start">Press Play to Begin!</h3>';
document.getElementById("play").addEventListener("click", gameLoop);
document.getElementById("restart").addEventListener("click", gameLoop);
