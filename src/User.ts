import { WebsocketClient, USDMClient, isWsFormattedFuturesUserDataEvent } from 'binance'

export class User {

    private wsClient: WebsocketClient;
    private usdmClient: USDMClient;

    constructor(api_key: string, api_secret: string) {

        this.wsClient = new WebsocketClient({
                api_key: api_key,
                api_secret: api_secret,
                beautify: true,
        })

        this.usdmClient = new USDMClient({
            api_key: api_key,
            api_secret: api_secret,
        })

        this.wsClient.subscribeAllLiquidationOrders("usdm", false);
        this.wsClient.subscribeUsdFuturesUserDataStream(true, true, true);

        this.start();

    }

    private start() {
        this.wsClient.on("formattedMessage", (msg) => {
            if(isWsFormattedFuturesUserDataEvent(msg)) {
                console.log("Formated futures user data event")
            } else if("eventType" in msg){
                console.log(msg.eventType)
            }
        })
    }
}