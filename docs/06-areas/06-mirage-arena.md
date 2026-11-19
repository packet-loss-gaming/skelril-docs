---
icon: tnt
---

# Mirage Arena

The Mirage Arena (Carpe Diem district) is a PvP arena whose whole map changes by vote.

## Voting for a map

`/mirage list` shows the 19 maps; `/mirage vote <map>` starts a one-minute vote among everyone near the arena, then the map with
the most votes is drained of water and lava and rebuilt (watch the bar at the top; nothing in the arena hurts you meanwhile, except
other players).

## Fighting

Blocks you break drop nothing and come back after four minutes; a block you place must be the one in your hand and is taken back
after ten seconds, the item returned to you. Every hit you take from a player builds up gold: when you die it spills where you fell
(a gold nugget per point, sometimes ingots), and your killer is healed fully and scores a Mirage Arena kill. Dying there costs you
nothing: your belongings and experience come back when you respawn. Gold you pick up in the arena is packed into ingots and blocks.

`/mirage ignore <player>` stops you from hurting a friend (`/mirage unignore <player>` undoes it).

Tested only without a game client so far.
