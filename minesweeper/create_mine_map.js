// import { CELL_COUNT, NO_OF_BOMBS } from "./mine_sweeper.js";
export const NO_OF_BOMBS = 15;
export const CELL_COUNT = 100;
const getBombPositions = (noOfBombs, bombPositions) => {
  if (bombPositions.length === noOfBombs) {
    return bombPositions;
  }

  const randomNumber = Math.floor(Math.random() * 100);

  if (bombPositions.includes(randomNumber)) {
    return getBombPositions(noOfBombs, bombPositions);
  }

  return getBombPositions(noOfBombs, [...bombPositions, randomNumber]);
};

function createGround(limit, bombPositions) {
  const ground = Array(limit).fill(0);
  bombPositions.map((x) => (ground[x] = "B"));

  return ground;
}

const getPositionInfo = (index) => {
  return [
    index - 10 < 0,
    index + 10 > 99,
    index % 10 === 0,
    (index + 1) % 10 === 0,
  ];
};

const getIncrementConditions = (index) => {
  const [isAtFirstRow, isAtLastRow, isAtLeftRow, isAtRightRow] =
    getPositionInfo(index);
  return [
    !isAtFirstRow && !isAtLeftRow,
    !isAtFirstRow && !isAtRightRow,
    !isAtLastRow && !isAtLeftRow,
    !isAtLastRow && !isAtRightRow,
    !isAtLeftRow,
    !isAtFirstRow,
    !isAtRightRow,
    !isAtLastRow,
  ];
};

function getPosToIncrement(index) {
  const arrayCondition = getIncrementConditions(index);

  const indexes = [
    index - 11,
    index - 9,
    index + 9,
    index + 11,
    index - 1,
    index - 10,
    index + 1,
    index + 10,
  ];

  return arrayCondition.reduce((a, b, i) => {
    if (b) {
      return [...a, indexes[i]];
    }
    return [...a];
  }, []);
}

function getIncrementedString(mineMap, posToIncrement) {
  posToIncrement.map((x) => {
    if (mineMap[x] !== "B") {
      mineMap[x]++;
    }
  });
  return mineMap;
}

function setMineCount(mineMap) {
  for (let index = 0; index < mineMap.length; index++) {
    if (mineMap[index] === "B") {
      const posToIncrement = getPosToIncrement(index);
      mineMap = getIncrementedString(mineMap, posToIncrement);
    }
  }

  return mineMap;
}
console.log(NO_OF_BOMBS, CELL_COUNT);

export const bombPositions = getBombPositions(NO_OF_BOMBS, []);
const mineGround = createGround(CELL_COUNT, bombPositions);
export const mineMap = setMineCount(mineGround);

const getNumberToPrint = (cellNo) => {
  if (cellNo < 10) {
    return " 0" + cellNo;
  }

  if (cellNo >= 100) {
    return String(cellNo);
  }

  return " " + cellNo;
};
const displayvalues = mineMap.map((x, i) => getNumberToPrint(i + 1));
