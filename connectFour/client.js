import {
  animateDrop,
  getBoard,
  getMapStructure,
  getUserInput,
} from "./connect_four.js";

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
      `Game Started! You are playing against ${this.opponent}\nYour Color is ${this.color}`
    );
  }

  async gameLoop() {
    console.log(getBoard(this.connectMap));

    while (true) {
      const serverMessage = await this.readMsg();

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
  }

  async handleTurn() {
    const inputInfo = getUserInput(this.name, this.connectMap, this.color);

    await this.connection.write(
      new TextEncoder().encode(
        JSON.stringify({ ...inputInfo, color: this.color })
      )
    );

    animateDrop(
      inputInfo.dropPosition,
      this.connectMap,
      this.color,
      inputInfo.playerInput - 1
    );
  }

  writeMsg(conn, msg) {
    conn.write(new TextEncoder().encode(JSON.stringify(msg)));
  }

  async readMsg() {
    const buff = new Uint8Array(1024);
    const byteCount = await this.connection.read(buff);

    return new TextDecoder().decode(buff.slice(0, byteCount)).trim();
  }
}

const client = new ConnectFourClient();
await client.init(8000);
