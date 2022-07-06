import { USDMClient } from "binance";

export class Utils {

    private usdmClient: USDMClient;

    constructor(usdmClient: USDMClient) {
        this.usdmClient = usdmClient;
    }

    public async getPrecision(symbol: string): Promise<number> {
        try {
            const info = await this.usdmClient.getExchangeInfo();
            const symbols = info.symbols;
            for(let i = 0; i < symbols.length; i++) {
                if(symbols[i].symbol == symbol) {
                    return symbols[i].quantityPrecision;
                }
            }
        } catch(e) {
            console.log(e);
        }
        return -1;
    }

    public async getPrecisionPrice(symbol: string): Promise<number>{
        try {
            const info = await this.usdmClient.getExchangeInfo();
            const symbols = info.symbols;
            for(let i = 0; i < symbols.length; i++){
                if(symbols[i].symbol == symbol) {
                    for(const filtr of symbols[i].filters){
                        if(filtr.filterType === "PRICE_FILTER"){
                            const size = "" + filtr.tickSize;
                            if(typeof size[size.indexOf("1") + 1] === "undefined"){
                                return symbols[i].pricePrecision;
                            } else{
                                return size.indexOf("1") - 1;
                            }
                        }
                    }
                }
            }
        } catch(e) {
            console.log(e);
        }
        return -1;
    }

    public getQuantity(balance: number, price: number, precision: number, percent: number, leverage: number) {
        const quantity = this.floorPrecised((balance * percent * leverage / price * 0.9), precision);
        return quantity;
    }

    public async getPrice(symbol: string, pricePrecision: number): Promise<number> {
        return this.floorPrecised( ((await this.usdmClient.getMarkPrice({isIsolated: "FALSE", symbol: symbol})).markPrice), pricePrecision );
    }

    private floorPrecised(number: number, precision: number) {
        var power = Math.pow(10, precision);
        return Math.floor(number * power) / power;
    }

    public async getAvailableUSDTBalance(): Promise<number> {
        try {
            const balance = await this.usdmClient.getBalance();
            for(const b of balance) {
                if(b.asset === "USDT") {
                    if(typeof b.availableBalance === "number") return b.availableBalance;
                    else return parseFloat(b.availableBalance);
                }
            }
        } catch(e) {
            return -1;
        }
        return 0;
    }
}