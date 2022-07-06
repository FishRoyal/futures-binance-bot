import { isWsFormattedFuturesUserDataEvent } from 'binance'
import { WsClientExd } from './wsClientExd';
import { UsdmClientExd } from './usdmClientExd'

export class User {

    private wsClient: WsClientExd;
    private usdmClient: UsdmClientExd;

    constructor(data: UserData) {

        this.wsClient = new WsClientExd({
                api_key: data.api_key,
                api_secret: data.api_secret,
                beautify: true,
        })

        this.usdmClient = new UsdmClientExd({
            api_key: data.api_key,
            api_secret: data.api_secret,
        })

        this.wsClient.subscribeAllLiquidationOrders("usdm", false);
        this.wsClient.subscribeUsdFuturesUserDataStream(data.isTestnet, true, true);

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