---
icon: sapling
---

# Getting Started

## Your first day

New accounts begin in the arrival room below the City. Type the activation code from the person who invited you into chat, or use
`/activate <code>`. Codes are case-, space- and dash-insensitive and are kept out of public chat. Once active, step through any room
portal to reach your inviter's welcome location (or Halzeil when none is set).

After activation, new players receive 32 cooked beef, a chest, a red bed and **three Gems of Life** (and sometimes a lucky diamond). `/welcome`
repeats the welcome text. If you are still new (under 24 hours played) and lose your things to a grave anyway, you respawn with a
wooden pickaxe and a **Newbie Phantom Potion**. See [Dying](/guide/mechanics/death) for what the gems and potions do.

Your first stop is the City's spawn. The City is protected (see [Protecting your stuff](/guide/protecting-your-stuff)); build in the
other worlds, which you reach through [portals](/guide/mechanics/portals).

Members can use `/invite` to create one single-use activation code. `/invite new` revokes and replaces an outstanding code, and
`/setwelcomelocation` chooses where your invited players arrive. When somebody activates with your code,
you receive one referral reward once you are online and back in your normal inventory.

## Your inventory

Skelril has no off-hand slot: whatever you hold is in your main hand. The buttons in your inventory open:

| Button | Opens |
| --- | --- |
| Gold (where Minecraft's off-hand slot was) | The **Economy** screen: your Skrin balance, what your inventory would sell for, and the market prices of anything you click (see [Market](/guide/mechanics/market#the-economy-screen)). |
| Book | The recipe book. |
| Violet rift | Your [warps](/guide/mechanics/warps) (the same menu as `/warps`). |
| Gear | Player settings (your skin). |
| Trophy | The Hall of Records, every [high score](/guide/mechanics/highscores) table (the same as `/highscores`). |

**Torches from your pickaxe:** right-click a block while holding any pickaxe and a torch from your inventory is placed on the face you
clicked, on the floor or on a wall. Torches, soul torches and copper torches all work (the first one in your inventory, hotbar first).
Blocks with their own use, such as chests and doors, still open as usual, and sneaking keeps the pickaxe's own right-click (the Linear and
Radial pickaxes open their settings).

## Your Grindstone inventory

If your Minecraft account is linked to your imported account, your Minecraft inventory is given to you automatically a moment after you join. There is nothing to run.

Current items are preserved. If there is not enough room in your main inventory, armor slots or ender chest, nothing is given yet: the server tells you which part to clear and gives everything as soon as there is space (it checks again every minute and whenever you join).

The import includes carried items, equipped armor, the offhand (its item goes into your main inventory) and ender-chest contents. It preserves mapped custom items, supported enchantments on ordinary items and wear. Skelril's own custom items come without the enchantments they had in Minecraft; you can enchant them like any other item. Minecraft positions are not imported. Ordinary custom names, book text and map contents are not retained; a few items have no equivalent in this game.

If you are in a mini-game or recovering a saved inventory, delivery waits until you are done. If saving the restoration marker fails, the server reports it and retries without granting again during that server run. An abrupt server crash in that interval can result in a duplicate restore.

## Reporting a problem

Found a bug, a broken mechanism or something that looks wrong? Stand near it and type `/report`. A report screen opens: give it a
one-line title and describe what happened, what you expected and how to see it again, then press **Send report**. Anything you type
after the command, such as `/report the lift is stuck`, starts the description.

The report goes to the staff's private issue tracker; only the staff can read it. Use it for griefing too: stand at the damage when you
report it, so the staff can look up who changed what there. Your player name, the dimension, your position, the
regions you are standing in and the time are attached, so you do not need to type them. You will be told the issue number once it is
filed.

- Closing the screen keeps what you typed; `/report` opens it again. If sending fails, your text is kept as well.
- You can send five reports every five minutes. Your account must be activated first.

## Getting around

- `/spawn` takes you to the spawn of the dimension you are in.
- To visit a friend, `/call` them (`/tpa` works too); they accept with `/bring <your name>` within five minutes.
- `/return` takes you back to where you were before your last teleport, or to where you died. Up to ten places are remembered
  until the server restarts; use it again to go further back. Areas that control who may enter (boss rooms, the jail, mini-games)
  can still refuse it.

## Away from the keyboard

- After three minutes without walking, clicking, chatting or using your inventory you are marked AFK: you are grey in `/who`,
  take no damage, and mobs leave you alone. Anything you do ends it. `/afk [status]` marks you away at once (without the protection),
  and people who message you are told.
- Idle players are disconnected after an hour, or sooner when the server is busy. Just log back in.
