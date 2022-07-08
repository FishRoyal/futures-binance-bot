import { BooleanString, OrderSide } from "binance"

export type MarketOrderData = {
    side: OrderSide,
    symbol: string,
    quantity: number,
    reduceOnly: BooleanString
}

export type LimitOrderData = {
    side: OrderSide,
    symbol: string,
    price: number,
    quantity: number,
    reduceOnly: BooleanString
}

export type UserData = {
    api_key: string,
    api_secret: string,
    leverage: number,
    percent: number,
    ignoreTokens: string[],
    isTestnet: boolean
}

export type OrderData = {
    symbol: string,
    quantity: number,
    price: number,
    pricePrecision: number,
    step: number,
    precision: number
}