import { isWsFormattedFuturesUserDataEvent, WebsocketClient} from 'binance'
import { UsdmClientExd } from './usdmClientExd'
import { OrderData, UserData } from './types';
import { OrderBuilder } from './orderBuilder';
import { OrdersCanceller } from './ordersCanceller';
import { Signal } from './Signal';

export class User {

    private wsClient: WebsocketClient;
    private usdmClient: UsdmClientExd;
    private orderBuilder: OrderBuilder;
    private userData: UserData;
    private dataForOrders: OrderData | undefined;
    private ordersCanceller: OrdersCanceller;
    private signal: Signal;

    private isLiquidationStreamLocked: boolean;

    constructor(data: UserData) {

        this.wsClient = new WebsocketClient({
                api_key: data.api_key,
                api_secret: data.api_secret,
                beautify: true,
        })

        this.usdmClient = new UsdmClientExd({
            api_key: data.api_key,
            api_secret: data.api_secret,
        }, undefined, data.isTestnet)

        this.dataForOrders = undefined;

        this.orderBuilder = new OrderBuilder(this.usdmClient);
        this.ordersCanceller = new OrdersCanceller(this.usdmClient);
        this.signal = new Signal(data.ignoreTokens);

        this.wsClient.subscribeAllLiquidationOrders("usdm", false);
        this.wsClient.subscribeUsdFuturesUserDataStream(data.isTestnet, true, true);

        this.userData = data;

        this.isLiquidationStreamLocked = false;

        this.start();

    }

    private start() {
        this.wsClient.on("formattedMessage", async (msg) => {

            if(isWsFormattedFuturesUserDataEvent(msg)) {

                if("order" in msg && msg.order.orderStatus === "FILLED" && msg.order.orderType === "LIMIT") {
                    if(msg.order.orderSide === "BUY") {
                        let isOpened: boolean | undefined = false;
                        if(typeof this.dataForOrders !== "undefined") {
                            isOpened = await this.ordersCanceller.isPositionOpened(this.dataForOrders.symbol)
                            if(typeof isOpened !== undefined && isOpened) { 
                                const marketOrder = this.orderBuilder.getMarketOrder(this.dataForOrders, "BUY")
                                await this.usdmClient.openPosition(marketOrder);
                                await this.ordersCanceller.cancellAllOpenOrders(this.dataForOrders.symbol);
                            }
                        }

                        this.dataForOrders = undefined;
                        this.isLiquidationStreamLocked = false;
                    }

                    if(msg.order.orderSide === "SELL") {
                        console.log("SELL order")
                        if(typeof this.dataForOrders !== "undefined")
                            await this.usdmClient.createLimitOrder(this.orderBuilder.getLimitOrder(this.dataForOrders, -1, "BUY"));
                    }
                } else

                if("order" in msg && msg.order.orderStatus === "CANCELED") {
                    let isOpened: boolean | undefined = false;
                    if(typeof this.dataForOrders !== "undefined") {
                        isOpened = await this.ordersCanceller.isPositionOpened(this.dataForOrders.symbol);
                        if(typeof isOpened !== undefined && !isOpened) {
                            await this.ordersCanceller.cancellAllOpenOrders(this.dataForOrders.symbol);
                            this.dataForOrders = undefined;
                            this.isLiquidationStreamLocked = false;
                        }
                    }
                }

            } else if("eventType" in msg) {

                if("liquidationOrder" in msg && !this.isLiquidationStreamLocked && this.signal.ifSignalApproach(msg.liquidationOrder)) {

                    console.log('liquidation order catched')

                    this.isLiquidationStreamLocked = true;

                    this.dataForOrders = await this.orderBuilder.setDataForOrders(msg.liquidationOrder.symbol,
                        this.userData.percent, this.userData.leverage);


                    const res = await this.usdmClient.openPosition(this.orderBuilder.getMarketOrder(this.dataForOrders, "SELL"));
                    for(let i = 1; i <= 9; i++) {
                       const limit = await this.usdmClient.createLimitOrder(this.orderBuilder.getLimitOrder(this.dataForOrders, i, "SELL"));
                       console.log(limit)
                    }
                    
                    await this.usdmClient.createLimitOrder(this.orderBuilder.getLimitOrder(this.dataForOrders, -1, "BUY"));

                } 

            }

        })
    }
}