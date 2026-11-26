---
icon: chest
---

# Wallet

Money is **Skrin**. Your balance is stored in the database and every change is applied there first, so a crash
can never lose or duplicate money.

`/balance` shows what you have.

`/pay <player> <amount>` sends Skrin to another player.

`/ledger` shows where your money went and came from: every change of your balance with its reason (market purchases and
sales, bank deposits and withdrawals, payments and who they were with, lottery tickets and wins, rewards). It shows the last
7 days, 20 lines at most; `/ledger time=30d limit=50` looks further back.

## Bank signs

City signs marked `[Bank]` or `[Conversion]` exchange gold and Skrin at face value: a nugget is 1 Skrin,
an ingot is 9, and a block is 81. Right-click to deposit up to the amount on line 3; punch the sign to
withdraw up to that amount. If only part of a withdrawal fits, the bank withdraws only that part.

Withdrawals are saved before gold is granted. If delivery is interrupted, use `/bank collect`. An uncertain
delivery waits for an administrator rather than risking a duplicate grant.
