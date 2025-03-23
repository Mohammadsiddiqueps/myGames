const connection = await Deno.connect({ port: 8000 });

const name = prompt("Enter Your Name: ");

console.log("this is the name user gave: ", name);
await connection.write(new TextEncoder().encode(name));

console.log("name has send");
