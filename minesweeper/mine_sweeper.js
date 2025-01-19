export const NO_OF_BOMBS = 15;
export const CELL_COUNT = 100;
import { bombPositions, displayvalues, mineMap } from "./create_mine_map.js";

const HYPHEN = "-";
const LINE_LENGTH = 49;
const SAFE_CELLS = CELL_COUNT - NO_OF_BOMBS;

const getPositionInfo = (index) => {
  return [
    index - 10 < 0,
    index + 10 > 99,
    index % 10 === 0,
    (index + 1) % 10 === 0,
  ];
};

function getLine() {
  return HYPHEN.repeat(LINE_LENGTH);
}

function getEmojiToPrint(cellValue) {
  if (cellValue === "B") {
    return " 💣";
  }

  const numberEmoji = [" 0️⃣ ", " 1️⃣ ", " 2️⃣ ", " 3️⃣ ", " 4️⃣ "];

  return numberEmoji[+cellValue];
}

//updated this much

function getCharToPrint(cellNo, openedCells, string, flagedCells) {
  if (flagedCells.includes(cellNo - 1)) {
    return " 🚩";
  }

  if (openedCells.includes(cellNo - 1)) {
    return getEmojiToPrint(string[cellNo - 1]);
  }

  if (cellNo < 10) {
    return " 0" + cellNo;
  }

  if (cellNo >= 100) {
    return cellNo;
  }

  return " " + cellNo;
}

function getStyledGround(openedCells, mineMap, flagedCells) {
  const line = getLine(LINE_LENGTH);
  let mineGround = "\n " + line + "\n";

  for (let cellNo = 1; cellNo <= CELL_COUNT; cellNo++) {
    const character = printValues[cellNo - 1];
    const cellDesign = "┃" + character + " ";
    const isItTenthCell = cellNo % 10 === 0 ? "┃\n┃" + line + "┃\n" : "";

    mineGround += cellDesign + isItTenthCell;
  }

  return mineGround;
}
function openNearCells(openedCells, index) {
  const [isAtFirstRow, isAtLastRow, isAtLeftRow, isAtRightRow] =
    getPositionInfo(index);
  // console.log(isAtFirstRow, isAtLastRow, isAtLeftRow, isAtRightRow);
  if (!(openedCells.includes(index - 11) || isAtFirstRow || isAtLeftRow)) {
    openedCells.push(index - 11);
    printValues[index - 11] = getEmojiToPrint(mineMap[index - 11]);
  }

  if (!(openedCells.includes(index - 1) || isAtLeftRow)) {
    openedCells.push(index - 1);
    printValues[index - 1] = getEmojiToPrint(mineMap[index - 1]);
  }

  if (!(openedCells.includes(index + 9) || isAtLastRow || isAtLeftRow)) {
    openedCells.push(index + 9);
    printValues[index + 9] = getEmojiToPrint(mineMap[index + 9]);
  }

  if (!(openedCells.includes(index - 10) || isAtFirstRow)) {
    openedCells.push(index - 10);
    printValues[index - 10] = getEmojiToPrint(mineMap[index - 10]);
  }

  if (!(openedCells.includes(index + 10) || isAtLastRow)) {
    openedCells.push(index + 10);
    printValues[index + 10] = getEmojiToPrint(mineMap[index + 10]);
  }

  if (!(openedCells.includes(index + 1) || isAtRightRow)) {
    openedCells.push(index + 1);
    printValues[index + 1] = getEmojiToPrint(mineMap[index + 1]);
  }

  if (!(openedCells.includes(index - 9) || isAtRightRow || isAtFirstRow)) {
    openedCells.push(index - 9);
    printValues[index - 9] = getEmojiToPrint(mineMap[index - 9]);
  }

  if (!(openedCells.includes(index + 11) || isAtRightRow || isAtLastRow)) {
    openedCells.push(index + 11);
    printValues[index + 11] = getEmojiToPrint(mineMap[index + 11]);
  }

  return openedCells;
}

function getBorderedMessage(message) {
  const line = getLine(LINE_LENGTH);

  return line + "\n        " + message + "            \n" + line;
}

function printBoardAndMessage(message) {
  // console.clear();
  console.log(getBorderedMessage(message));
  console.log("\n💣 💣 💥 💥💣 𝐌 𝑰𝐍 𝑬 𝐒Ꮤ 𝑬 𝑬 𝐏 𝑬 Ʀ 💣 💣 💥 💥 💣");
  console.log(getStyledGround(openedCells, mineMap, flagedCells));
}

function getUserInput() {
  const input = prompt(
    "Enter Cell No to continue || Enter e to exit || Enter f to flag"
  );
  const isInputInRange = input <= CELL_COUNT && input > 0;
  const isValidInput = input === "f" || input === "e";
  const isFlaged = flagedCells.includes(input - 1);
  const isOpened = openedCells.includes(input - 1);

  if (!(isInputInRange || isValidInput) || isFlaged || isOpened) {
    console.log("Don't Enter flaged || opened cells || invalid values");
    return getUserInput();
  }

  return input;
}

function processInput(input, flagedCells, openedCells, mineMap) {
  if (mineMap[input - 1] === "B") {
    printBoardAndMessage("Bomb Blasted 💥 💥 💥, You have losed......");
  }

  if (openedCells.length > SAFE_CELLS) {
    printBoardAndMessage(
      "Nice tactics, you got it 🏅 🏆\nYou are a Genius. You are Selected>>>>👑 👑"
    );
  }
}

const getOpenedEmoji = (index) => {};
// const bombPositions = getRandomNumbers(NO_OF_BOMBS, []);
// const mineGround = createGround(CELL_COUNT, bombPositions);
// const mineMap = setMineCount(mineGround);

const printValues = displayvalues;
let openedCells = [];
let flagedCells = [];
let isGameDone = false;

printBoardAndMessage("let's see your tactics 🤘 🤘");
const startingTime = performance.now();
// Your program code here

while (!isGameDone) {
  const input = getUserInput();
  //flag case...........
  if (input === "f") {
    const inputToFlag = prompt("Enter the CellNo to flag: ");
    printValues[inputToFlag - 1] = " 🚩"; //
    flagedCells.push(inputToFlag - 1);
    printBoardAndMessage("NIce You Have flaged Successfully");
    continue;
  }

  //exit case.....
  if (input === "e") {
    console.log("Why are you so cruel; anyWay bie see you again;");
    isGameDone = true;
  }

  //cell open case..
  if (!openedCells.includes(input)) {
    printValues[input - 1] = getEmojiToPrint(mineMap[input - 1]);
    openedCells.push(input - 1);

    if (mineMap[input - 1] === 0) {
      openedCells = openNearCells(openedCells, input - 1);
    }

    printBoardAndMessage("NIce MOve");
  }

  // game finish case....
  if (openedCells.length > SAFE_CELLS || mineMap[input - 1] === "B") {
    flagedCells = [];
    bombPositions.map((x) => {
      printValues[x] = " 💣";
    });
    openedCells = [...openedCells, ...bombPositions];
    // console.log(openedCells);

    isGameDone = true;
    processInput(input, flagedCells, openedCells, mineMap);
  }
  // console.log(printValues);
}
const endingTime = performance.now();

// console.log(bombPositions);
// console.log(openedCells.split(",").length - 1);
//winners List.....
//Praveen
//likitha g, akash, sushanth
//dhanoj
//aman shabbas , shrutika
//Hima Sai

//sujoy --> 2
//shrutika
//sameera bhanu
// mounika
//siddique
//devadatta, anagh, rohini
//rohini, krishnanand
//Dhanoj
//sameera , sai ram

// feedback
// very good game good siddique you are cool
