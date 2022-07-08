import { User } from "./User"

const user = new User({
    api_key: "9ec08cae0e9952bca21524b2fe7cfa82b9931b472231ae05eb122a12631c4b69",
    api_secret: "0799e705b9e504e5229a44e61b2f07974c83e04e5f83393ed5ead41ca12874d0",
    leverage: 20,
    percent: 20,
    ignoreTokens: ["BTCUSDT", "ETHUSDT", "SOLUSDT"],
    isTestnet: true
})