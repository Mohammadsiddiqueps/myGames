export const readMsg = async (conn) => {
  const buff = new Uint8Array(1024);
  const byteCount = await conn.read(buff);

  const msg = buff.slice(0, byteCount);
  const decodedMsg = new TextDecoder().decode(msg).trim();

  if(!decodedMsg) throw new Error("Client disconnected"); 

  return JSON.parse(decodedMsg);
};

export const writeMsg = (conn, msg) => {
  const stringifiedMsg = JSON.stringify(msg);

  conn.write(new TextEncoder().encode(stringifiedMsg));
};
