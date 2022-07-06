import { isWsFormattedFuturesUserDataEvent } from 'binance'
import { WsClientExd } from './wsClientExd';
import { UsdmClientExd } from './usdmClientExd'
import { OrderData, UserData } from './types';
import { OrderBuilder } from './orderBuilder';

export class User {

    private wsClient: WsClientExd;
    private usdmClient: UsdmClientExd;
    private orderBuilder: OrderBuilder;
    private userData: UserData;

    private isLiquidationStreamLocked: boolean;

    constructor(data: UserData) {

        this.wsClient = new WsClientExd({
                api_key: data.api_key,
                api_secret: data.api_secret,
                beautify: true,
        })

        this.usdmClient = new UsdmClientExd({
            api_key: data.api_key,
            api_secret: data.api_secret,
        }, undefined, data.isTestnet)

        this.orderBuilder = new OrderBuilder(this.usdmClient);

        this.wsClient.subscribeAllLiquidationOrders("usdm", false);
        this.wsClient.subscribeUsdFuturesUserDataStream(data.isTestnet, true, true);

        this.userData = data;

        this.isLiquidationStreamLocked = false;

        this.start();

    }

    private start() {
        this.wsClient.on("formattedMessage", async (msg) => {

            if(isWsFormattedFuturesUserDataEvent(msg)) {

                console.log("user data")

            } else if("eventType" in msg) {

                if("liquidationOrder" in msg && !this.isLiquidationStreamLocked) {

                    console.log("... here ")
                    this.isLiquidationStreamLocked = true;

                    const data: OrderData = await this.orderBuilder.setDataForOrders(msg.liquidationOrder.symbol,
                        this.userData.percent, this.userData.leverage);

                    await this.usdmClient.openPosition(this.orderBuilder.getMarketOrder(data));
                    for(let i = 1; i <= 9; i++) await this.usdmClient.createLimitOrder(this.orderBuilder.getLimitOrder(data, i));

                } else {
                    console.log(msg);
                }

            }

        })
    }
}