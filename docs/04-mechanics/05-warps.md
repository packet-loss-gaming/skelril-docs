---
icon: bed
---

# Warps and Homes

A **warp** is a named spot you can teleport to. It is either **global** (shared by everyone, made by admins) or
**personal** (yours).

## Using warps

`/warps` with no arguments opens the **warp menu**: a search box, then a scrolling list. A compass icon marks a global
warp and an ender-eye icon a personal one. Click a warp to go there.

`/warp <name>` teleports you to a warp. Your own warps are checked first, then the global ones, so a personal warp
can hide a global one with the same name. Names are not case sensitive.

Warps search up to 16 blocks upward for safe footing (solid ground with two free blocks above it) and refuse a blocked
destination with "That location is not safe!".

## Your home

Ordinary beds are for homes, not sleeping. Right-click once for the reminder, then right-click the same bed
again within a quarter-second to set or update your personal warp `HOME` for free. `/home` returns there, and death respawns
there when a safe two-high space exists; otherwise the current dimension's spawn is used. Beds only work in worlds that
allow them.

## Making warps

| Command | Does |
| --- | --- |
| `/warps set <name>` | Save a personal warp here. Costs one **Tome of the Rift Splitter**, used up once the warp is saved. |
| `/warps destroy <name>` | Delete one of your warps. |
| `/warps list [-p page] [filter]` | List the warps you can use. |

`/warps set home` also sets your home, but costs a tome; a bed is free.

`/whereami` tells you which world you are in, your block coordinates and the direction you are facing. Quote these
coordinates when you report a problem with a place.

## Dimensions

A warp remembers its destination dimension as well as its coordinates. Compasses point to the current dimension's spawn when its rules allow them; lodestone compasses only track lodestones in the same dimension. Maps are tied to one dimension, even when two dimensions share overworld behavior.

Gates between the worlds are described in [Portals](/guide/mechanics/portals). The End is unavailable.

::: info Not checked in a client yet
The warp menu's look still needs a client check.
:::
