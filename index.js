const { io } = require("socket.io-client");

const URL = process.env.URL || "http://34.89.90.167";
const MAX_CLIENTS = 1000;
const POLLING_PERCENTAGE = 0.05;
const CLIENT_CREATION_INTERVAL_IN_MS = 10;
const EMIT_INTERVAL_IN_MS = 1000;

let clientCount = 0;
let lastReport = new Date().getTime();
let packetsSinceLastReport = 0;

const createClient = () => {
  // for demonstration purposes, some clients stay stuck in HTTP long-polling
  const transports =
    Math.random() < POLLING_PERCENTAGE ? ["polling"] : ["polling", "websocket"];

  const socket = io(URL, {
    transports,
  });


  const randomName = `client_${v4()}`;

  socket.on("disconnect", (reason) => {
    console.log(`disconnect due to ${reason}`);
  });
  
  //MAIN
  socket.on("connect", () => {
      console.log('connected to main.');
  
      socket.emit("message_sent", { userName: randomName, message: "Hello!" });
  });
  
  socket.on("server_identification", (serverName) => {
      console.log(`main socket, connected to server: ${serverName}`);
  });
  
  socket.on("message_received", (data) => {
        packetsSinceLastReport++;
      console.log(`${data.userName} says ${data.message}`);
  });
  
  socket.on("user_disconnected", (data) => {
      console.log(`${data} disconnected from main.`);
  });
  
  socket.on("connect_error", (err) => {
      console.log(err.message);
  });
  
  setInterval(() => {
    socket.connect();
  }, EMIT_INTERVAL_IN_MS);

  if (++clientCount < MAX_CLIENTS) {
    setTimeout(createClient, CLIENT_CREATION_INTERVAL_IN_MS);
  }
};

createClient();

const printReport = () => {
  const now = new Date().getTime();
  const durationSinceLastReport = (now - lastReport) / 1000;
  const packetsPerSeconds = (
    packetsSinceLastReport / durationSinceLastReport
  ).toFixed(2);

  console.log(
    `client count: ${clientCount} ; average packets received per second: ${packetsPerSeconds}`
  );

  packetsSinceLastReport = 0;
  lastReport = now;
};

setInterval(printReport, 5000);