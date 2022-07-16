export class Signal {
    private ignoreTokens: string[];
    constructor(ignoreTokens: string[]) {
        this.ignoreTokens = ignoreTokens;
    }

    public ifSignalApproach(liqOrder: any): boolean {
        const symbol = liqOrder.symbol;
        if(!(symbol.includes("USDT")) return false;
        if(symbol in this.ignoreTokens) return false;
        if(liqOrder.price <= 50000) return false;
        if(liqOrder.side !== "BUY") return false;
        return true;
    }
}
