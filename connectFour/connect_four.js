const BOX_LENGTH = 35;
const EMPTY = "";
const BLANK_CELL = "🟡";
const PLAYER1_COLOUR = "🟢";
const PLAYER2_COLOUR = "🔵";

function getOuterLine(lineType, length) {
  let line = EMPTY;

  for (let lineLength = 0; lineLength < length; lineLength++) {
    line = line + lineType;
  }

  return line;
}

export function getMapStructure() {
  const connectMap = [];

  for (let index = 0; index < 42; index++) {
    connectMap[index] = BLANK_CELL;
  }

  return connectMap;
}

export function getBoard(connectMap) {
  const line = getOuterLine("-", 34);
  let board = "\n";

  for (let index = 0; index < 42; index++) {
    board += "| " + connectMap[index] + " ";

    if ((index + 1) % 7 === 0 && index < 40) {
      board += "|\n\n";
    }
  }

  board += "|\n|" + line + "|\n";
  board += "| 1️⃣  | 2️⃣  | 3️⃣  | 4️⃣  | 5️⃣  | 6️⃣  | 7️⃣  |\n";

  return board;
}

function getBottomIndex(connectMap, index) {
  if (connectMap[index] === BLANK_CELL && !(index > 42)) {
    return getBottomIndex(connectMap, index + 7);
  }

  return index - 7;
}

function delay() {
  for (let i = 0; i < 100000000; i++) {}
}

export function animateDrop(dropPosition, connectMap, ballColour, topPosition) {
  connectMap[topPosition] = ballColour;
  console.clear();
  console.log("      CONNECT FOUR 🎮 🎮");
  console.log(getBoard(connectMap));
  delay();

  if (topPosition === dropPosition) {
    return;
  }

  connectMap[topPosition] = BLANK_CELL;

  return animateDrop(dropPosition, connectMap, ballColour, topPosition + 7);
}

export function getUserInput(player, connectMap, ballColour) {
  const playerInput = prompt(player + " Enter Column No to Drop.. : ");
  const dropPosition = getBottomIndex(connectMap, playerInput - 1);
  const isInRange = playerInput > 0 && playerInput < 8;

  if (playerInput === EMPTY || dropPosition < 0 || !isInRange) {
    console.log("Enter Valid Input ❌ ⬇️");
    return getUserInput(player, connectMap, ballColour);
  }

  
  return { playerInput, dropPosition };
}

function checkCells(connectMap, index, adder, ballColour) {
  for (let i = 1; i < 4; i++) {
    if (connectMap[index + adder * i] !== ballColour) {
      return false;
    }
  }

  return true;
}

function isPlayerWin(connectMap, ballColour) {
  for (let index = 0; index < connectMap.length; index++) {
    if (connectMap[index] === ballColour) {
      const isItWonRow = checkCells(connectMap, index, 1, ballColour);
      const isItWonColumn = checkCells(connectMap, index, 7, ballColour);
      const isItWonDiagnalLeft = checkCells(connectMap, index, 6, ballColour);
      const isItWonDiagnalRight = checkCells(connectMap, index, 8, ballColour);

      if (
        isItWonRow ||
        isItWonColumn ||
        isItWonDiagnalLeft ||
        isItWonDiagnalRight
      ) {
        return true;
      }
    }
  }

  return false;
}

export function playConnect(player1, player2) {
  // const connectMap = getMapStructure();
  // console.log("Lets Play connect Four....");
  // console.log(getBoard(connectMap));
  // const player1 = prompt("Enter First player name : ");
  // const player2 = prompt("Enter Second player name : ");

  while (true) {
    getUserInput(player1, connectMap, PLAYER1_COLOUR);
    if (isPlayerWin(connectMap, PLAYER1_COLOUR)) {
      console.log(player1 + " won the match.....🏆🥇\n");
      break;
    }

    getUserInput(player2, connectMap, PLAYER2_COLOUR);
    if (isPlayerWin(connectMap, PLAYER2_COLOUR)) {
      console.log(player2 + " won the match.....🏆🥇\n");
      break;
    }
  }
}

// playConnect();
