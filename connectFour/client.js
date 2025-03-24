import { getBoard, getMapStructure, getUserInput } from "./connect_four.js";

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

    const matchDetails = JSON.parse(await this.readMessage());
    this.color = matchDetails.color;
    this.opponent = matchDetails.opponent;

    console.log(
      `Game Started! You are playing against ${this.opponent}\n Your Color is ${this.color}`
    );
  }

  async gameLoop() {
    while (true) {
      console.log("Waiting for the server message...");

      const serverMessage = await this.readMessage();
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
    const move = await this.readMessage();
    console.log("Opponent's move:", move);
  }

  async handleTurn() {
    console.log(getBoard(this.connectMap));
    const playerInput = getUserInput(this.name, this.connectMap);
    console.log("This is the input of the player:", playerInput);
    await this.connection.write(new TextEncoder().encode(playerInput));

    const move = await this.readMessage();
    console.log("My move:", move);
  }

  async readMessage() {
    const buff = new Uint8Array(1024);
    const byteCount = await this.connection.read(buff);

    return new TextDecoder().decode(buff.slice(0, byteCount)).trim();
  }
}

const client = new ConnectFourClient();
await client.init(8000);
