"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    consumers: [],
    id: process.env.UID || "1",
    psk: process.env.PSK || "pre-shared-key",
    port: process.env.PORT || 80,
    connectionTimeout: process.env.TIMEOUT || 3000,
};
exports.default = config;
