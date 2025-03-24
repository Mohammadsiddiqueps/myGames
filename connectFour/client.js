import {
  animateDrop,
  getBoard,
  getMapStructure,
  getUserInput,
} from "./connect_four.js";

import { readMsg, writeMsg } from "./util.js";

class ConnectFourClient {
  async init(port) {
    this.connection = await Deno.connect({ port, hostname: "" });
    this.connectMap = getMapStructure();

    await this.gameIntro();
    await this.gameLoop();
  }

  async gameIntro() {
    this.name = prompt("Enter Your Name: ");
    writeMsg(this.connection, { name: this.name });

    console.log("You have registered...\nWaiting for the opponent...");

    const matchDetails = await readMsg(this.connection);

    this.color = matchDetails.color;
    this.opponent = matchDetails.opponent;

    console.log(
      `Game Started! You are playing against ${this.opponent}\nYour Color is ${this.color}`
    );
  }

  async gameLoop() {
    console.log(getBoard(this.connectMap));

    while (true) {
      try {
        const message = await readMsg(this.connection);

        if (message.option === "win") {
          console.log(`${message.winner} won the match.....🏆🥇\n`);
          Deno.exit();
        }
        
        if (message.option === "WAIT") {
          await this.handleOpponentMove();
          continue;
        }

        this.handleTurn();
      } catch {
        console.error("the other player disconnected");
        break;
      }
    }
  }

  async handleOpponentMove() {
    console.log(`${this.opponent} is playing...⏳`);
    const opponentMove = await readMsg(this.connection);

    animateDrop(
      opponentMove.dropPosition,
      this.connectMap,
      opponentMove.color,
      opponentMove.playerInput - 1
    );
  }

  handleTurn() {
    const inputInfo = getUserInput(this.name, this.connectMap, this.color);
    writeMsg(this.connection, { ...inputInfo, color: this.color });

    animateDrop(
      inputInfo.dropPosition,
      this.connectMap,
      this.color,
      inputInfo.playerInput - 1
    );
  }
}

const client = new ConnectFourClient();
await client.init(8000);
