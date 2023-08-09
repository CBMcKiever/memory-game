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
    await illuminateElement(answer);
  }
};

async function gameLoop() {
  let i = 0;
  mainLoop: while (true) {
    answers = pushNextAnswer(answers);
    console.log(answers);
    await showAnswers(answers);
    for (let answer of answers) {
      const isSelectionCorrect = await waitForSelection(answer);
      if (isSelectionCorrect) {
        console.log("correct guess... next");
        // console.log(++score);

        continue;
      } else {
        break mainLoop;
      }
    }
    document.getElementById("score").innerHTML = ++score;
  }
  console.log("Damn dude, game over.... Loser");
}

gameLoop();
