import { WebsocketClient, WSClientConfigurableOptions, DefaultLogger } from "binance";

export class WsClientExd extends WebsocketClient{
    constructor(options: WSClientConfigurableOptions, logger?: typeof DefaultLogger) {
        super(options, logger);
    }
}