import { RestClientOptions, USDMClient } from "binance";
import { LimitOrderData, MarketOrderData } from "./types";
import { AxiosRequestConfig } from "axios"

export class UsdmClientExd extends USDMClient{
    constructor(restClientOptions?: RestClientOptions, requestOptions?: AxiosRequestConfig, useTestnet?: boolean) {
        super(restClientOptions, requestOptions, useTestnet);
    }

    public async openPosition(data: MarketOrderData | undefined): Promise<boolean> {
        if(typeof data === "undefined") return false;
        console.log("symbol:", data.symbol)
        try {
            await this.submitNewOrder({
                side: data.side,
                symbol: data.symbol,
                type: "MARKET",
                quantity: data.quantity,
                reduceOnly: data.reduceOnly
            })
            return true;
        } catch(e) {
            console.log(e);
            return false;
        }
    }

    public async createLimitOrder(data: LimitOrderData | undefined): Promise<boolean> {
        if(typeof data === "undefined") return false;
        try {
            await this.submitNewOrder({
                side: data.side,
                symbol: data.symbol,
                type: "LIMIT",
                price: data.price,
                quantity: data.quantity,
                timeInForce: 'GTC',
                positionSide: 'BOTH',
                reduceOnly: data.reduceOnly
            })
            return true;
        } catch(e) {
            return false;
        }
    }

}