---
icon: key
---

# Protecting Your Stuff

## Land and buildings

The City is protected: you can build and dig only in designated areas (your own house or shop, arenas such as Spleef, the
Grave Yard's scenery). Chests, doors and other things you use keep working. The other worlds are open for building.

## Ziggy claims

In buildable worlds, building and maintaining a place earns investment. Enough investment in one area automatically creates a Ziggy claim. Automatic claims use a convex hull around the build. They protect that footprint from the floor to the ceiling of the world. Run `/claim` to see the owners, members, status, investment and your share for the claim you are standing in. Use `/claim show` to highlight its edges for ten seconds.

An owner can use `/claim trust <player>` to give someone build access to all their claims. Use `/claim untrust <player>` to revoke that access. Add `here` to either command to change access for the current claim only. Run `/claim trusted` to see your grants and exceptions. Mutual trust can turn a contested build into a shared claim.

Use `/claim abandon here` to withdraw from the current claim, or `/claim abandon` to withdraw from all your unfrozen claims. Withdrawing clears your investment in those claims. Other owners of a shared claim keep their protection.

A visitor may help under an owner's supervision when the owner is nearby and can see them. Repeated supervised work can earn ongoing build access. Locks and manual regions keep their own permissions.

## Locking containers

1. Run `/lock`, then **punch** the chest, furnace or other container.
2. `/lock add <player>` then punch: let someone else use it.
3. `/lock remove <player>`, `/lock info` and `/unlock` work the same way. `/lock cancel` drops a pending action.

You need build rights where the container is. Old Grindstone locks were not converted.

## Player combat

`/pvp` turns global player combat on or off. Both players must have it enabled. Safe spots are enabled by
default: combat remains blocked in areas where PvP is switched off and in regions either player owns or belongs to.
`/pvp -s` enables PvP without safe spots, or toggles safe spots while PvP is already enabled. Outside global
PvP, combat is possible only where both players stand in a PvP area, such as the
[Sand Arena](/guide/areas/sand-arena) and the [Mirage Arena](/guide/areas/mirage-arena).

You cannot change the setting for seven seconds after a player hit. Disconnecting in that window marks the
logout; on the next login, the Giant Chicken gives the player a three-minute glass-cage and starvation curse.
An administrative kick does not count. PvP turns off whenever you disconnect.
