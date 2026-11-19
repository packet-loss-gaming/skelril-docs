---
icon: chest
---

# Item Sorters

Pixies carry items from your **source** chests to your **sink** containers. A network belongs to you and has a name.

1. Stand where the network should be and run `/sorter network create <name>`. Sources must be within 100 blocks of this spot.
2. `/sorter add source`, then **punch** a chest (or trapped chest).
3. `/sorter add sink [mode]`, then **punch** a chest, trapped chest, barrel, shulker box, dispenser, dropper or ender chest.
4. Put items into a source chest and close it. The pixies empty it into your sinks.

| Sink mode | The sink accepts |
| --- | --- |
| `overwrite` (default) | The kinds of items it holds now. An empty container accepts anything. |
| `add` | The same as `overwrite`, plus what it accepted before. |
| `template` | The items it holds now, each only in the slots it occupies now. |
| `void` | Anything. |

`void` is handy for a junk chest. For a `template` sink, put single items where each kind should go: an organised armour
chest, or one row per item.

Template sinks are filled first, then sinks that list the item, then sinks that accept anything. A double chest counts as one container.
An ender chest sink is your own ender chest. It is only used while you are online.

`/sorter network use <name>` selects another of your networks, `/sorter network list` shows them, and `/sorter cancel` drops a pending punch.

::: info The pixies charge for their work
Each run costs 3 Skrin, plus 0.5 Skrin per stack and 0.1 Skrin per item moved. Nothing is charged if nothing moves. If you
cannot afford a stack, it stays in the source. For example, five stacks of ten items cost 3 + 2.5 + 5 = 10.5 Skrin.

The network's owner pays, whoever fills the source, so [lock](/guide/protecting-your-stuff#locking-containers) your source chests.
:::

::: tip Hoppers
Items that a hopper or dropper puts into a source chest are sorted within five minutes.
:::

Sorters work in the worlds you can build in, not in the City. You can only add containers you are allowed to open. Grindstone's networks
were imported with their sources and sinks. This feature has not been checked in a game client yet.
