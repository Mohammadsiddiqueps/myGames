class Serve {
  constructor(port) {
    this.listener = Deno.listen({ port });
  }

  format() {
    return new TransformStream({
      transform(msg, controller) {
        const [currentTime] = Date().match(/\d+:\d+:\d+/);

        const formatted = currentTime + ": " + msg;
        controller.enqueue(formatted);
      },
    });
  }

  async handleConnection(conn) {
    await conn.readable
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(this.format())
      .pipeThrough(new TextEncoderStream())
      .pipeTo(conn.writable);
  }

  async connector() {
    const allPlayers = new Set();

    for await (const conn of this.listener) {
      allPlayers.add(conn);
      console.log("connected to the client", allPlayers);

      if (allPlayers.size >= 2) {
        const [player1, player2] = allPlayers;
        allPlayers.delete(player1);
        allPlayers.delete(player2);

        // this.startGame(player1, player2);
        console.log(player1, player2, "game starts");
      }
    }
  }
}

const server = new Serve(8000);
server.connector();
console.log("listening to the port");
