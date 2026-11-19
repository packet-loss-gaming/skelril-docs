---
icon: chest
---

# Lottery

Tickets cost **20 Skrin** each. Each draw picks one ticket at random and the owner wins the whole pot.
Draws run every Friday at 17:00 server time. If the server was offline then, one missed draw runs after it
starts. At the top of each hour, the server announces the current ticket count and pot.

## Buying tickets

Right-click a City sign marked `[Lottery]` to buy the number of tickets on line 2. The sign shows the total
price on its last two lines. A player may hold at most 800 tickets in one draw.

| Command | Does |
| --- | --- |
| `/lottery buy [amount]` | Buy tickets (one if you give no amount). |
| `/lottery pot` | Show how many tickets are in and what the pot is worth. |
| `/lottery recent` | Show the latest winners. |

::: tip Buying twice
If you buy again while a purchase is still being processed, the second request is ignored. Wait for the
confirmation message.
:::

## The pot

Part of the pot comes from the [market](/guide/mechanics/market)'s profit. Unlike Grindstone, that part is **reset after each draw**.
