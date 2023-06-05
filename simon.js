const green = document.getElementById("green");
const red = document.getElementById("red");
const orange = document.getElementById("orange");
const blue = document.getElementById("blue");

const colors = ["green", "red", "orange", "blue"];
let answers = [];

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
      await illuminateElement(event.target.id);
      event.target.id === elementId ? resolve(true) : resolve(false);
    }

    colors.forEach((color) => {
      document.getElementById(color).addEventListener("click", clickHandler);
    });
  });
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
    showAnswers(answers);
    for (let answer of answers) {
      const isSelectionCorrect = await waitForSelection(answer);
      if (isSelectionCorrect) {
        console.log("correct guess... next");
        continue;
      } else {
        break mainLoop;
      }
    }
    console.log("Correct!");
  }
  console.log("Damn dude, game over.... Loser");
}

gameLoop();
