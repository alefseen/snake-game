const HORIZENTAL_AREAS = 35;
const VERTICAL_AREAS = 25;
const DURATION = 200;
const GOAL_ID = "goal";
const board = document.getElementById("board");

function partIdGenerator([x, y]) {
  return `part-${x}-${y}`;
}

function paint([x, y]) {
  const child = document.createElement("div");
  child.id = partIdGenerator([x, y]);
  child.classList.add("snake");
  child.style = `
    left: calc(${x} * var(--blockSize));
    top: calc(${y} * var(--blockSize));
    `;

  board.appendChild(child);
}

function remove([x, y]) {
  const elementId = partIdGenerator([x, y]);
  const element = document.getElementById(elementId);

  element.remove();
}

function paintGoal([x, y]) {
  const child = document.createElement("div");
  child.id = GOAL_ID;
  child.classList.add("goal");
  child.style = `
      left: calc(${x} * var(--blockSize));
      top: calc(${y} * var(--blockSize));
      `;

  board.appendChild(child);
}

function removeGoal() {
  const element = document.getElementById(GOAL_ID);

  element.remove();
}

class Snake {
  constructor() {
    this.position.forEach(paint);
    paintGoal(this.goalPosition);
  }

  direction = "RIGHT";
  position = [
    [14, 13],
    [15, 13],
    [16, 13],
  ];
  goalPosition = this.randomPosition();
  isGameOver = false;

  randomPosition() {
    const rndX = Math.floor(Math.random() * HORIZENTAL_AREAS);
    const rndY = Math.floor(Math.random() * VERTICAL_AREAS);
    return [rndX, rndY];
  }

  run() {
    if (this.isGameOver) return;

    const newPosition = this.getNewPosition();

    const [newX, newY] = newPosition;

    const horizentalAccident = newX < 0 || newX >= HORIZENTAL_AREAS;
    const verticalAccident = newY < 0 || newY >= VERTICAL_AREAS;

    const isPositionDuplicated = this.position.some(
      ([x, y]) => newX === x && newY === y
    );

    if (horizentalAccident || verticalAccident || isPositionDuplicated) {
      this.isGameOver = true;
      alert("game over");
    } else {
      const removedChild = this.position[0];
      remove(removedChild);

      this.position = this.position.slice(1).concat([newPosition]);

      paint(newPosition);
    }

    const [goalX, goalY] = this.goalPosition;
    const isEatenGoal = newX === goalX && newY === goalY;
    if (isEatenGoal) {
      this.eat();
    }
  }

  getNewPosition() {
    const [x, y] = this.position[this.position.length - 1];

    let newPosition;
    switch (this.direction) {
      case "LEFT":
        newPosition = [x - 1, y];
        break;
      case "RIGHT":
        newPosition = [x + 1, y];
        break;
      case "UP":
        newPosition = [x, y - 1];
        break;
      case "BOTTOM":
        newPosition = [x, y + 1];
        break;
      default:
        throw new Error("direaction is invalid");
    }

    return newPosition;
  }

  changeDirection(newDirection) {
    const directions = [this.direction, newDirection];
    const isChangeUpToBottom =
      directions.includes("UP") && directions.includes("BOTTOM");
    const isChangeLeftToRight =
      directions.includes("LEFT") && directions.includes("RIGHT");
    if (isChangeUpToBottom || isChangeLeftToRight) return;

    this.direction = newDirection;
  }

  eat() {
    removeGoal();
    const newPosition = this.getNewPosition();
    this.position = this.position.concat([newPosition]);
    paint(newPosition);
    this.goalPosition = this.randomPosition();
    paintGoal(this.goalPosition);
  }
}

window.addEventListener("load", function () {
  const snake = new Snake();
  this.setInterval(function () {
    snake.run();
  }, DURATION);

  function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == "38") {
      snake.changeDirection("UP");
    } else if (e.keyCode == "40") {
      snake.changeDirection("BOTTOM");
    } else if (e.keyCode == "37") {
      snake.changeDirection("LEFT");
    } else if (e.keyCode == "39") {
      snake.changeDirection("RIGHT");
    }
  }

  window.addEventListener("keydown", checkKey);
});
