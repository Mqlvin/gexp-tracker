### Active player data
This is an example object for active player data held in an array.

```json
{
    "uuid":"73d8f852c8cb4bbb95dc63a31967e4a3",
    "lastUpdated":1690903294,
    "lastHistoryStore":26,
    "totalGexpToday":24128,

    "currentUsername":"Mqlvin",
    "currentRank":"Tier 1",
    "playerJoined":161764024
}
```

| Value | Use | Format | Pushed to history |
|-------|-----|--------|-------------------|
| "uuid" | Specifies the UUID of the player | string | *false* |
| "lastUpdated" | Specifies the last time the active player data was updated | unix seconds | *false* |
| "lastHistoryStore" | Specifies the day (e.g. 26th) the history was last updated | number | *false* |
| "gexpToday" | Object containing a list of unix seconds and corresponding GEXP **not accumulated - not added** | number | *true* |
| "totalGexp" | Specifies the total number of GEXP collected today | number | *true* |
| "currentUsername" | Specifies the last username cached | string | *true* |
| "currentRank" | Specifies the current players rank in the guild | string | *true* |
| "playerJoined" | Specifies the time the player joined | unix seconds | *false* |

<br><br>

### History

The player history system stores old player data in a history file.
This means the small, relevant player data can be held in RAM which results in less IO.

To do this, one function `exportToHistory(uuid)` exists, which pushes all active player data into a history file.

When data is pushed to history, it should be pushed in an object, with a key as the timestamp pushed.

```json
{
    "29-04-2023": {
        "username":"Mqlvin",
        "timeLastUpdated":"03:59",
        "gexpEarned":24128,
        "rank":"Tier 2",
    },
    "30-04-2023": {
        "username":"Mqlvin",
        "timeLastUpdated":"03:59",
        "gexpEarned":0,
        "rank":"Tier 1",
    },
    "1-05-2023": {
        "username":"Mqlvin",
        "timeLastUpdated":"03:52",
        "gexpEarned":5829,
        "rank":"Tier 1",
    }
}
```
`timeLastUpdated` refers to the UTC formatted time the GEXP was last updated. This can show inaccuracy if for example the bot was down.

History should be pushed once a day, after the daily GEXP resets.
> NOTE: Daily GEXP resets 12am UTC which is 4am UTC