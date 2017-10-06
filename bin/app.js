"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const config_1 = require("./config");
const queue_protocol_1 = require("queue-protocol");
const app = express();
const expressWs = require("express-ws")(app);
let producers = [];
exports.GlobalState = {
    connections: 0,
    messages: 0,
};
app.get("/", (req, res, next) => {
    res.send("WIP");
    next();
});
app.ws("/producer", (ws, req) => {
    let sub;
    ws.on("open", () => {
        sub = new queue_protocol_1.SubscriptionQueue(ws, config_1.default.psk);
        producers.push(sub);
        exports.GlobalState.connections += 1;
    });
    ws.on("close", () => {
        producers = producers.filter((e) => e !== sub);
        exports.GlobalState.connections -= 1;
    });
});
app.ws("/subscribe/:topic", (ws, req) => {
    const topic = req.params.topic;
    let peer;
    /**
     * Subscription function.
     * @param mess Message
     */
    const fnSub = (mess) => {
        peer.send({ t: "m", s: topic, d: mess });
    };
    // Websocket open connection.
    ws.on("open", () => {
        peer = new queue_protocol_1.WebSocketQueue(ws, config_1.default.psk);
        // WebSocketQueue protocol finished hello:
        peer.on("open", () => {
            producers.forEach((e) => {
                e.subscribe(topic, fnSub);
            });
        });
        exports.GlobalState.connections += 1;
    });
    ws.on("close", () => {
        producers.forEach((e) => {
            e.unsubscribe(topic, fnSub);
        });
        exports.GlobalState.connections -= 1;
    });
});
app.listen(80, () => {
    console.log("Listening to port 80");
});
