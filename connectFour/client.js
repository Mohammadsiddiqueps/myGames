import { getUserInput } from "./connect_four.js";

class ConnectFourClient {
  async init(port) {
    this.connection = await Deno.connect({ port });

    await this.sendName();
    await this.gameIntro();
    await this.gameLoop();
  }

  async sendName() {
    this.name = prompt("Enter Your Name: ");
    console.log("This is the name user gave:", this.name);
    await this.connection.write(new TextEncoder().encode(this.name));
    console.log("Name has been sent.");
  }

  async gameIntro() {
    console.log("Waiting for the opponent...");

    const startMsg = await this.readMessage();
    console.log(startMsg);
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
    console.log("Your turn! 🎮");
    const playerInput = prompt("Enter Column No to Drop: ");
    console.log("This is the input of the player:", playerInput);
    await this.connection.write(new TextEncoder().encode(playerInput));

    const move = await this.readMessage();
    console.log("My move:", move);
  }

  async readMessage() {
    const buff = new Uint8Array(1024);
    const byteCount = await this.connection.read(buff);
    // if (!byteCount) return "";
    return new TextDecoder().decode(buff.slice(0, byteCount)).trim();
  }
}

const client = new ConnectFourClient();
await client.init(8000);
