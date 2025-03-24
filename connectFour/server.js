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

    this.writeMsg(this.player1.conn, player1Info);
    this.writeMsg(this.player2.conn, player2Info);

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

    const buff = new Uint8Array(1024);
    const byteCount = await player.conn.read(buff);

    const input = new TextDecoder().decode(buff.slice(0, byteCount)).trim();
    this.processMove(player, input);

    await opponent.conn.write(new TextEncoder().encode(input));
  }

  processMove(player, input) {
    console.log(`${player.name} played: ${input}`);
  }

  writeMsg(conn, msg) {
    conn.write(new TextEncoder().encode(JSON.stringify(msg)));
  }
}

const handleClient = async (conn, allPlayers) => {
  const buff = new Uint8Array(1024);
  const byteCount = await conn.read(buff);
  const name = new TextDecoder().decode(buff.slice(0, byteCount)).trim();

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
