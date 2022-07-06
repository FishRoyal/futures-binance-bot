import { OrderSide } from "binance";
import { LimitOrderData, MarketOrderData, OrderData } from "./types";
import { UsdmClientExd } from "./usdmClientExd";
import { Utils } from "./utils";

export class OrderBuilder {

    private utils: Utils;

    constructor(usdmClient: UsdmClientExd) {
        this.utils = new Utils(usdmClient);
    }

    public getMarketOrder(data: OrderData | undefined, side: OrderSide): MarketOrderData | undefined {
        if(typeof data === "undefined") return;
        const quantity_ten = this.utils.floorPrecised(data.quantity/10.0, data.precision);
        const quantity = this.utils.floorPrecised(data.quantity*1.2, data.precision);

        return {
            side: side === "SELL" ? "SELL" : "BUY",
            symbol: data.symbol,
            quantity: side === "SELL" ? quantity_ten : quantity,
            reduceOnly: side === "SELL" ? "false" : "true" 
        }

    }

    public getLimitOrder(data: OrderData | undefined, pos: number, side: OrderSide): LimitOrderData | undefined{
        if(typeof data === "undefined") return;
        const priceForOrder = this.utils.floorPrecised(data.price + data.step*pos, data.pricePrecision);
        const quantity_ten = this.utils.floorPrecised(data.quantity/10.0, data.precision);
        const quantity = this.utils.floorPrecised(data.quantity*1.2, data.precision);

        return {
            side: side === "SELL" ? "SELL" : "BUY",
            symbol: data.symbol,
            price: priceForOrder,
            quantity: side === "SELL" ? quantity_ten : quantity,
            reduceOnly: side === "SELL" ? "false" : "true" 
        }
    }

    public async setDataForOrders(symbol: string, percent: number, leverage: number): Promise<OrderData | undefined> {
        try{
            const available_balance = await this.utils.getAvailableUSDTBalance();
            const pricePrecision = await this.utils.getPrecisionPrice(symbol);
            const price = await this.utils.getPrice(symbol, pricePrecision);
            const precision = await this.utils.getPrecision(symbol);
            const quantity = this.utils.getQuantity(available_balance, price, precision, percent, leverage);
            const step = 0.1/leverage*price; 
            console.log()
            return {
                symbol: symbol,
                quantity: quantity,
                price: price,
                pricePrecision: pricePrecision,
                step: step,
                precision: precision
            }
        } catch(e) {
            console.log(e);
            return undefined;
        }
    }

}