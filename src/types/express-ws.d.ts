import * as core from "express-serve-static-core";
import WebSocket = require("ws");

declare global {
  export namespace Express {

    interface WebsocketHandler {
      (websocket: WebSocket, req: core.Request, next: core.NextFunction): any;
    }

    export interface Application {
      ws: (path: string, ...handlers: WebsocketHandler[]) => this;
    }
  }
}

export = 0;