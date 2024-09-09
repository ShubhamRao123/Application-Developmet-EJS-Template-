const express = require("express");
const app = express();
const mqtt = require("mqtt"); // MQTT Client
const aedes = require("aedes")();
const persistence = require("aedes-persistence")(); // In-memory persistence
const net = require("net"); // For creating TCP server for MQTT
const port = 3000;
const brokerPort = 1883;

app.set("view engine", "ejs"); // Set EJS as the template engine

// ==============================
// MQTT Broker Setup (Using Aedes with Persistence)
// ==============================

const brokerSettings = {
  persistence: persistence, // Use in-memory persistence for Aedes
};

const server = net.createServer(aedes.handle);
server.listen(brokerPort, () => {
  console.log(`Aedes MQTT Broker is running on port ${brokerPort}`);
});

// Handle broker events (optional)
aedes.on("client", (client) => {
  console.log("Client connected:", client.id);
});

aedes.on("publish", (packet, client) => {
  console.log("Published:", packet.payload.toString());
});

aedes.on("subscribe", (subscriptions, client) => {
  console.log("Subscribed:", subscriptions);
});

aedes.on("unsubscribe", (subscriptions, client) => {
  console.log("Unsubscribed:", subscriptions);
});

aedes.on("clientDisconnect", (client) => {
  console.log("Client disconnected:", client.id);
});

// ==============================
// MQTT Client Setup
// ==============================

const mqttClient = mqtt.connect("mqtt://localhost:1883");

mqttClient.on("connect", () => {
  console.log("Connected to Aedes MQTT Broker as client");

  mqttClient.subscribe("mytopic", (err) => {
    if (!err) {
      console.log("Client subscribed to topic: mytopic");
    }
  });
});

mqttClient.on("message", (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
});

// ==============================
// Express App Setup
// ==============================

app.get("/", (req, res) => {
  let siteName = "Adidas";
  let searchText = "Search Now";

  mqttClient.publish("mytopic", "Hello from the home page");

  res.render("index", { siteName: siteName, searchText: searchText });
});

app.get("/send-message", (req, res) => {
  const message = "This is a test message!";
  mqttClient.publish("mytopic", message);

  res.send("Message sent to MQTT broker: " + message);
});

// Start the Express server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
