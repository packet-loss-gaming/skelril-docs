---
icon: sun
---

# Guilds

::: warning Not yet checked in a client
The guild powers are written but not yet played in a game client. Client movement and click-timing tuning is deferred to the final phase and does not block other features.
:::

There are two guilds, the [Ninja Guild](/guide/guilds/ninja) and the [Rogue Guild](/guide/guilds/rogue). Each gives its members
powers that unlock as they level up.

## Joining

Right-click a block with a **Ninja Oath** or **Rogue Oath** to join that guild. Rejoining a guild you left costs 10% of your
experience, to a maximum of 1,000.

## Experience and levels

You earn experience by dealing damage: a tenth of the damage dealt (no more than the target's maximum health), up to 50 per hit.
Reaching a level takes `300 * level^2` experience. Each guild also has its own training area, described on its page. Guild
levels have their own highscore tables.

Your guild powers are on whenever you log in. If you log in somewhere they are not allowed (in jail or an arena), they switch on as soon as you leave.
Your guild powers switch off while you are inside an arena that hands out its own gear (like Spleef) and return when you leave.
They also do not work in the [Grave Yard](/guide/areas/graveyard)'s hall of lights or on its parkour.

## Commands

| Command | Does |
| --- | --- |
| `/guild enable\|disable` | Turn your powers on or off. |
| `/guild level [page]` | Show levels. |
| `/guild settings [name true\|false]` | Toggle personal options. |
| `/guild teleport` | Go to your guild base. |

Both guilds have the settings **Verbose Experience** and **Allow Environmental Damage** (whether your explosions damage blocks).
Rogues also have **Blip While Sneaking**, **Show Berserker Buffs** and **Animate Blips**.

The pitfall powers act on [pitfall traps](/guide/mechanics/pitfalls).
