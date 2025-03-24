import { readMsg, writeMsg } from "./util.js";

const PLAYER1_COLOUR = "🟢";
const PLAYER2_COLOUR = "🔵";

class ConnectFourServer {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.currentPlayer = player1;
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

    while (true) {
      await this.delay(200);

      const opponent =
        this.currentPlayer === this.player1 ? this.player2 : this.player1;

      await this.handlePlayerTurn(this.currentPlayer, opponent);
      this.currentPlayer = opponent;
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async handlePlayerTurn(player, opponent) {
    await player.conn.write(new TextEncoder().encode("TURN"));
    await opponent.conn.write(new TextEncoder().encode("WAIT"));

    const input = await readMsg(player.conn);
    
    this.processMove(player, input);
    writeMsg(opponent.conn, input);
  }

  processMove(player, input) {
    console.log(input);

    console.log(`${player.name} played: ${input.playerInput}`);
  }
}

const handleClient = async (conn, allPlayers) => {
  const { name } = await readMsg(conn);
  allPlayers.push({ conn, name });
  console.log(`Connected to client: ${name}`);

  if (allPlayers.length >= 2) {
    const [player1, player2] = allPlayers.splice(0, 2);
    player1.color = PLAYER1_COLOUR;
    player2.color = PLAYER2_COLOUR;

    const game = new ConnectFourServer(player1, player2);
    game.startGame();

    console.log(`Game started between ${player1.name} and ${player2.name}`);
  }
};

const main = async () => {
  const listener = Deno.listen({ port: 8000 });
  const allPlayers = [];

  for await (const conn of listener) {
    handleClient(conn, allPlayers);
  }
};

main();
