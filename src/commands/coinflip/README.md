# CoinFlip CLI

## Environment

The following environment variables need to be added to your `.env` file:
- `RPC_HOST`
- `COINFLIP_CONTRACT_ADDRESS`
- `COINFLIP_OWNER_ADDRESS`
- `COINFLIP_OWNER_KEY`
- `COINFLIP_PLAYER_ADDRESS`
- `COINFLIP_PLAYER_KEY`

## Commands

| Command | Args | Access | Payable | View |
|---|---|:---:|:---:|:---:|
| coinflip-deposit | `<amount>` | all | ✅ | ❌ |
| coinflip-withdraw | `<amount>` | owner | ❌ | ❌ |
| coinflip-disable | | owner | ❌ | ❌ |
| coinflip-enable | | owner | ❌ | ❌ |
| coinflip-ban | | owner | ❌ | ❌ |
| coinflip-unban | | owner | ❌ | ❌ |
| coinflip-wager | `<called_side>` `<amount>` | player | ✅ | ❌ |
| coinflip-flip | `<timestamp>` | player | ❌ | ❌ |
| coinflip-collect | | player | ❌ | ❌ |
| coinflip-get-balance | | all | ❌ | ✅ |
| coinflip-get-flip | `[flip_index]` | all | ❌ | ✅ |
| coinflip-is-banned | | all | ❌ | ✅ |
| coinflip-is-disabled | | all | ❌ | ✅ |
| coinflip-is-winner | | all | ❌ | ✅ |
||||||
