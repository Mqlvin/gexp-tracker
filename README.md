# GEXP Tracker
A Discord bot to track players' GEXP for my guild.

Written in Typescript, using `node.js` and `discord.js`

Sorry the code is well commented, but quite patchy. I didn't think out anything before I started writing it which usually leads to a messy codebase.

<br><br>

### General work
- [x] Name/UUID requesting and caching
- [x] Logging
- [x] Hypixel API requester

### Commands
- [x] View leaderboard command
- [x] Get players' tiers command
- [x] Get certain commands to run at end of month
- [x] View player overview command

<br><br>

To run the bot, place the entire directory within another `gexp-bot/` directory.
This is because it will create a `runtime/` directory one level above itself, e.g.

```
gexp-bot/
├─ bot/
│  ├─ build/
│  ├─ src/
│  ├─ package.json
├─ runtime/
│  ├─ cache/
│  ├─ log/
```
