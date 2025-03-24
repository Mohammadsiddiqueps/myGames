import { animateDrop, getBoard, getMapStructure, getUserInput } from "./connect_four.js";

class ConnectFourClient {
  async init(port) {
    this.connection = await Deno.connect({ port });
    this.connectMap = getMapStructure();

    await this.gameIntro();
    await this.gameLoop();
  }

  async gameIntro() {
    this.name = prompt("Enter Your Name: ");

    await this.connection.write(new TextEncoder().encode(this.name));
    console.log("You have registered...\nWaiting for the opponent...");

    const matchDetails = JSON.parse(await this.readMsg());
    this.color = matchDetails.color;
    this.opponent = matchDetails.opponent;

    console.log(
      `Game Started! You are playing against ${this.opponent}\n Your Color is ${this.color}`
    );
  }

  async gameLoop() {
    while (true) {
      console.log("Waiting for the server message...");

      const serverMessage = await this.readMsg();
      console.log("Server message:", serverMessage);

      if (serverMessage === "WAIT") {
        await this.handleOpponentMove();
        continue;
      }

      await this.handleTurn();
    }
  }

  async handleOpponentMove() {
    console.log("Opponent is playing...⏳");
    const opponentMove = JSON.parse(await this.readMsg());
    animateDrop(
      opponentMove.dropPosition,
      this.connectMap,
      opponentMove.color,
      opponentMove.playerInput - 1
    );

    console.log("Opponent's move:", opponentMove);
  }

  async handleTurn() {
    console.log(getBoard(this.connectMap));
    const inputInfo = getUserInput(this.name, this.connectMap, this.color);
    console.log("This is the input of the player:", inputInfo);
    await this.connection.write(
      new TextEncoder().encode(
        JSON.stringify({ ...inputInfo, color: this.color })
      )
    );

    const move = await this.readMsg();
    animateDrop(
      inputInfo.dropPosition,
      this.connectMap,
      this.color,
      inputInfo.playerInput - 1
    );

    console.log("My move:", move);
  }

  // asyn writeMsg
  async readMsg() {
    const buff = new Uint8Array(1024);
    const byteCount = await this.connection.read(buff);

    return new TextDecoder().decode(buff.slice(0, byteCount)).trim();
  }
}

const client = new ConnectFourClient();
await client.init(8000);
