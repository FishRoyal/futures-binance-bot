import { LimitOrderData, MarketOrderData, OrderData } from "./types";
import { UsdmClientExd } from "./usdmClientExd";
import { Utils } from "./utils";

export class OrderBuilder {

    private utils: Utils;

    constructor(usdmClient: UsdmClientExd) {
        this.utils = new Utils(usdmClient);
    }

    public getMarketOrder(data: OrderData): MarketOrderData {
        
        const quantity_ten = this.utils.floorPrecised(data.quantity/10.0, data.precision);

        return {
            side: "SELL",
            symbol: data.symbol,
            quantity: quantity_ten,
            reduceOnly: "false"
        }

    }

    public getLimitOrder(data: OrderData, pos: number): LimitOrderData{

        const priceForOrder = this.utils.floorPrecised(data.price + data.step*pos, data.pricePrecision);
        const quantity_ten = this.utils.floorPrecised(data.quantity/10.0, data.precision);

        return {
            side: "SELL",
            symbol: data.symbol,
            price: priceForOrder,
            quantity: quantity_ten,
            reduceOnly: "false"
        }
    }

    public async setDataForOrders(symbol: string, percent: number, leverage: number): Promise<OrderData> {
        const available_balance = await this.utils.getAvailableUSDTBalance();
        const pricePrecision = await this.utils.getPrecisionPrice(symbol);
        const price = await this.utils.getPrice(symbol, pricePrecision);
        const precision = await this.utils.getPrecision(symbol);
        const quantity = this.utils.getQuantity(available_balance, price, precision, percent, leverage);
        const step = 0.1/leverage*price;
        return {
            symbol: symbol,
            quantity: quantity,
            price: price,
            pricePrecision: pricePrecision,
            step: step,
            precision: precision
        }
    }

}