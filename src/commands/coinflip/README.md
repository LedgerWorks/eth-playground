# CoinFlip CLI Commands

_* Note: I still can't get the three player commands to work. It sends the transaction, but then just hangs._

| Command | Args | Access | Payable | View |
|---|---|:---:|:---:|:---:|
| coinflip-deposit | `<amount>` | all | ✅ | ❌ |
| coinflip-withdraw | `<amount>` | owner | ❌ | ❌ |
| coinflip-disable | | owner | ❌ | ❌ |
| coinflip-enable | | owner | ❌ | ❌ |
| coinflip-ban | | owner | ❌ | ❌ |
| coinflip-unban | | owner | ❌ | ❌ |
| coinflip-wager * | `<called_side>` `<amount>` | player | ✅ | ❌ |
| coinflip-flip * | `<timestamp>` | player | ❌ | ❌ |
| coinflip-collect * | | player | ❌ | ❌ |
| coinflip-get-balance | | all | ❌ | ✅ |
| coinflip-get-flip | `[flip_index]` | all | ❌ | ✅ |
| coinflip-is-banned | | all | ❌ | ✅ |
| coinflip-is-disabled | | all | ❌ | ✅ |
| coinflip-is-winner | | all | ❌ | ✅ |
||||||
