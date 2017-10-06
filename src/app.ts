import express = require("express");
import config from "./config";
import { SubscriptionQueue, WebSocketQueue } from "queue-protocol";

const app = express();
const expressWs = require("express-ws")(app);
let producers: SubscriptionQueue[] = [];


export const GlobalState = {
  connections: 0,
  messages: 0,
};

app.get("/", (req, res, next) => {
  res.send("WIP");
  next();
});

app.ws("/producer", (ws, req) => {
  let sub: SubscriptionQueue;
  console.log("Producer connected.");
  sub = new SubscriptionQueue(ws, config.psk);
  GlobalState.connections += 1;

  sub.on("open", () => {
    console.log("Producer hello done.");
    producers.push(sub);
  });

  sub.on("error", () => {
    console.log("Producer disconnected by error.");
  });


  ws.on("close", () => {
    console.log("Producer closed.");
    producers = producers.filter((e) => e !== sub);
    GlobalState.connections -= 1;
  });
});

app.ws("/subscribe/:topic", (ws, req) => {
  const topic = req.params.topic;
  let peer: WebSocketQueue;

  /**
   * Subscription function.
   * @param mess Message 
   */
  const fnSub = (mess: string) => {
    peer.send({ t: "m", s: topic, d: mess });
  }

  // Websocket open connection.
  console.log(`Subscriber connected to ${topic}.`);
  peer = new WebSocketQueue(ws, config.psk);
  GlobalState.connections += 1;

  // WebSocketQueue protocol finished hello:
  peer.on("open", () => {
    console.log(`Subscriber hello to ${topic}.`);
    producers.forEach((e) => {
      e.subscribe(topic, fnSub);
    });
  });

  peer.on("error", () => {
    console.log("Peer disconnected by error.");
  });


  ws.on("close", () => {
    console.log(`Subscriber disconnected from ${topic}.`);
    producers.forEach((e) => {
      e.unsubscribe(topic, fnSub);
    });
    GlobalState.connections -= 1;
  });
});

app.listen(80, () => {
  console.log("Server running at http://127.0.0.1:80/");
});