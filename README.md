# GEXP Tracker
A Discord bot to track players' GEXP for my guild.

Written in Typescript, using `node.js` and `discord.js`

<br><br>

### General work
- [x] Name/UUID requesting and caching
- [x] Logging
- [ ] Hypixel API requester

### Commands
- [ ] View player command
- [ ] View leaderboard command
- [ ] Get players' tiers command
- [ ] Get commands to run at end of month command

<br><br>

To run the bot, place the entire directory within another `gexp-bot/` directory.
This is because it will create a `runtime/` directory one level above itself, e.g.

```gexp-bot/
├─ bot/
│  ├─ build/
│  ├─ src/
│  ├─ package.json
├─ runtime/
│  ├─ cache/
│  ├─ log/```
