---
icon: sign
---

# Highscores

`/highscores [-p page] [filter]` lists every score table. `/highscore <score type>` shows one table.

Each score type has its own rule for updating: *incremental* scores add up, *override* scores replace the old value,
and some only replace it when the new value is better. Times are shown as hours, minutes and seconds, and guild
experience is shown as a level.

The score types and their numbers come straight from Grindstone, and the real 2025 data has been imported.
Score ids are stored in the database and are never renumbered.

## Skrin and the Goblet

The **Skrin** table tracks each wallet's whole-Skrin balance automatically. The monthly Goblet mirrors one
eligible competition table. At a new month its leader wins that Goblet, the proxy scores reset, and a
different competition is selected. After joining you are told the current Goblet and its leader.
