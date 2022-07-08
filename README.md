## FUTURES-BINANCE-BOT   
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)   
This bot catches liquidation signals from binance api, opens SHORT positions and makes easy money.
### Strategy
When the bot gets SHORT liquidation signal (3-4 times per day) with margin higher than 50000$, it means that the current cryptocurrency goes up.
The bot takes part of your futures balance and devides it by ten parts. One part goes to MARKET
position, other nine parts goes to LIMIT safety orders.
Difference between positions is 10% up including leverage. TAKE-PROFIT LIMIT order is always 10% under MARKET position including leverage.
### Configuration
When you create your User object you can set up **leverage** to your notice. If you like bigger risks and want to earn faster, then choose 20x or more.
If you prefer more relaxed trading, then choose 5x.
You can set up **percent** of balance which will be used for trading (ex. 50% means that 5% of balance will go to the MARKET position and 45% to LIMIT safety
orders)
Also you can choose testnet or mainnet.
### Realization
Bot was made with TypeScript and library "binance". The main class is User, which has Websocket Client and USDMClient.   
   
-> Websocket Client   
Websocket client subscribes to both liquidation orders and user data stream. With liquidation orders stream the Bot catches signals. User data stream helps to
understand what happens with opened position. For ex. when BUY order is FILLED it means that you got your profit. Then bot cancells limit orders and
become ready to catch new signals and earn.   
   
-> USDM Client   
USDM client allows to open orders. With class OrderBuilder you get data for a new order and then you can place it with added functions "openPosition" / 
"createLimitOrder"   
### Getting Started   
```bash
git clone https://github.com/FishRoyal/futures-binance-bot.git
cd ./futures-binance-bot
npm install
```
> Then add your binance api-key and api-secret to src/index.ts
```bash
npx tsc
node ./build/index.js
```   
### Roadmap   
-> Testing in mainnet   
-> Fixing bugs   
-> Strategy improvement

### Disclaimer   
Futures trading is always associated with risk. I am not responsible for possible losses.
