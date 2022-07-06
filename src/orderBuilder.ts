import { USDMClient } from "binance";
import { LimitOrderData, MarketOrderData, OrderData } from "./types";
import { Utils } from "./utils";

export class OrderBuilder {

    private utils: Utils;

    constructor(usdmClient: USDMClient) {
        this.utils = new Utils(usdmClient);
    }

    public async getMarketOrder(symbol: string, percent: number, leverage: number): Promise<MarketOrderData> {
        const available_balance = await this.utils.getAvailableUSDTBalance();
        const pricePrecision = await this.utils.getPrecisionPrice(symbol);
        const price = await this.utils.getPrice(symbol, pricePrecision);
        const precision = await this.utils.getPrecision(symbol);
        const quantity = await this.utils.getQuantity(available_balance, price, precision, percent, leverage);

        return {
            side: "SELL",
            symbol: symbol,
            quantity: quantity,
            reduceOnly: "false"
        }

    }

    public async getLimitOrder(symbol: string, percent: number, leverage: number): Promise<LimitOrderData>{
        const available_balance = await this.utils.getAvailableUSDTBalance();
        const pricePrecision = await this.utils.getPrecisionPrice(symbol);
        const price = await this.utils.getPrice(symbol, pricePrecision);
        const precision = await this.utils.getPrecision(symbol);
        const quantity = await this.utils.getQuantity(available_balance, price, precision, percent, leverage);

        return {
            side: "SELL",
            symbol: "BTCUSDT",
            price: price,
            quantity: 1,
            reduceOnly: "false"
        }
    }

}