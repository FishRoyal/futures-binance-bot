import { USDMClient } from "binance";

export class OrdersCanceller {

    private usdmClient;
    private EPS;

    constructor(usdmClient: USDMClient) {
        this.usdmClient = usdmClient;
        this.EPS = Math.pow(10, -6);
    }

    public async cancellAllOpenOrders(symbol: string) {
        try {
            await this.usdmClient.cancelAllOpenOrders({symbol: symbol, isIsolated: "TRUE"})
        } catch(e) {
            console.log(e);
        }
    }

    public async isPositionOpened(symbol: string): Promise<boolean | undefined> {
        try {
            const positions = await this.usdmClient.getPositions({isIsolated: "TRUE", symbol: symbol})
            const quantity = Math.abs(parseFloat(positions[0].positionAmt.toString()));
            if(quantity > this.EPS) {
                return true;
            } else {
                return false;
            }
        } catch(e) {
            console.log(e);
            return undefined;
        }
    }
}