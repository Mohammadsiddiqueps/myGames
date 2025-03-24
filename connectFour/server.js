const PLAYER1_COLOUR = "🟢";
const PLAYER2_COLOUR = "🔵";

class ConnectFourServer {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.currentPlayer = player1;
  }

  async startGame() {
    this.player1.conn.write(
      new TextEncoder().encode(
        JSON.stringify({
          opponent: this.player2.name,
          color: this.player1.color,
        })
      )
    );

    this.player2.conn.write(
      new TextEncoder().encode(
        JSON.stringify({
          opponent: this.player1.name,
          color: this.player2.color,
        })
      )
    );

    while (true) {
      await this.delay(200);
      const opponent =
        this.currentPlayer === this.player1 ? this.player2 : this.player1;
      await this.handlePlayerTurn(this.currentPlayer, opponent);
      this.swapTurn();
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async handlePlayerTurn(player, opponent) {
    await player.conn.write(new TextEncoder().encode("TURN\n"));
    await opponent.conn.write(new TextEncoder().encode("WAIT\n"));

    const buff = new Uint8Array(1024);
    const byteCount = await player.conn.read(buff);

    const input = new TextDecoder().decode(buff.slice(0, byteCount)).trim();
    console.log(`Input from ${player.name}:`, input);

    this.processMove(player, input);

    await player.conn.write(new TextEncoder().encode(input));
    await opponent.conn.write(new TextEncoder().encode(input));
  }

  processMove(player, input) {
    console.log(`${player.name} played: ${input}`);
  }

  swapTurn() {
    this.currentPlayer =
      this.currentPlayer === this.player1 ? this.player2 : this.player1;
  }
}

const listener = Deno.listen({ port: 8000 });
const allPlayers = [];

for await (const conn of listener) {
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
}
