import { getMapStructure, isPlayerWin } from "./connect_four.js";
import { readMsg, writeMsg } from "./util.js";

const PLAYER1_COLOUR = "🟢";
const PLAYER2_COLOUR = "🔵";

class ConnectFourServer {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.currentPlayer = player1;
    this.gameOver = false;
    this.connectMap = getMapStructure();
  }

  async startGame() {
    const player1Info = {
      opponent: this.player2.name,
      color: this.player1.color,
    };

    const player2Info = {
      opponent: this.player1.name,
      color: this.player2.color,
    };

    writeMsg(this.player1.conn, player1Info);
    writeMsg(this.player2.conn, player2Info);

    while (!this.gameOver) {
      await this.delay(200); //find gsomething better

      const opponent =
        this.currentPlayer === this.player1 ? this.player2 : this.player1;

      try {
        await this.handlePlayerTurn(this.currentPlayer, opponent);
      } catch {
        console.error("client disconnected");
        this.handleGameExit();
        break;
      }

      this.currentPlayer = opponent;
    }
  }

  async handleGameExit() {
    this.gameOver = true;

    await this.player1.conn.close();
    await this.player2.conn.close();
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async handlePlayerTurn(player, opponent) {
    writeMsg(player.conn, { option: "TURN" });
    writeMsg(opponent.conn, { option: "WAIT" });

    const input = await readMsg(player.conn);

    writeMsg(opponent.conn, input);
    this.processMove(player, input);
  }

  async processMove(player, input) {
    this.connectMap[input.dropPosition] = player.color;

    if (isPlayerWin(this.connectMap, player.color)) {
      console.log(player.name + " won the match.....🏆🥇\n");

      writeMsg(this.player1.conn, { option: "win", winner: player.name });
      writeMsg(this.player2.conn, { option: "win", winner: player.name });

      await this.handleGameExit();
    }
  }
}

const handleClient = async (conn, allPlayers) => {
  const { name } = await readMsg(conn);
  allPlayers.push({ conn, name });
  console.log(`Connected to client: ${name}`);

  if (allPlayers.length >= 2) {
    // multiple of 2
    const [player1, player2] = allPlayers.splice(0, 2);
    player1.color = PLAYER1_COLOUR;
    player2.color = PLAYER2_COLOUR;

    const game = new ConnectFourServer(player1, player2);
    game.startGame();

    console.log(`Game started between ${player1.name} and ${player2.name}`);
  }
};

const main = async (port) => {
  const listener = Deno.listen({ port });
  const allPlayers = [];

  for await (const conn of listener) {
    handleClient(conn, allPlayers);
  }
};

main(8000);
