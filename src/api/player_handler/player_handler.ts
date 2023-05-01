import { createPlayerDirectory } from "../../filesystem/directories";
import { createFile, PLAYER_HISTORY_FILE, PLAYER_DATA_FILE, readFile, writeString } from "../../filesystem/files";
import { getUsername } from "../player_db";

const PLAYER_OBJECTS: Map<string, any> = new Map<string, any>();

/* Takes in an object like this:

    {
        "uuid": "400ff3c99a034a77b4458f5b30e277a6",
        "rank": "Veteran",
        "joined": 1603294924005,
        "questParticipation": 1227,
        "mutedTill": 1626999047373,
        "expHistory": {
          "2023-04-29": 0,
          "2023-04-28": 0,
          "2023-04-27": 0,
          "2023-04-26": 0,
          "2023-04-25": 0,
          "2023-04-24": 0,
          "2023-04-23": 0
    }


    This `savePlayer()` function gets called for every player once a minute, based on the information gathered by the Hypixel API.
*/
export async function savePlayer(uuid: string, playerData: any): Promise<void> {
    // If player object doesn't exist yet.
    if(!PLAYER_OBJECTS.has(uuid)) {
        PLAYER_OBJECTS.set(uuid, {"lastHistoryStore":getCurrentDay()});
        createPlayerDirectory(uuid);
    }

    // Needs to be updated: if after 4am and lastHistoryUpdate day is yesterday.
    else if(PLAYER_OBJECTS.has(uuid) && playerData["lastHistoryStore"] + 1 == getCurrentDay()) {
        exportToHistory(uuid, PLAYER_OBJECTS.get(uuid));
        playerData["lastHistoryStore"] = getCurrentDay();
    }

    let playerDataFile: string = PLAYER_DATA_FILE.replace("%UUID%", uuid);
    
    let obj: any = PLAYER_OBJECTS.get(uuid);
    obj["uuid"] = uuid;
    // obj["lastUpdated"] = Math.floor(Date.now() / 1000);
    // Removed as currently unused
    obj["totalGexpToday"] = playerData["expHistory"] [Object.keys(playerData["expHistory"])[0]] ;
    obj["currentUsername"] = await getUsername(uuid);
    obj["curentRank"] = playerData["rank"];
    obj["playerJoined"] = Math.floor(playerData["joined"] / 1000);
    PLAYER_OBJECTS.set(uuid, obj);

    writeString(playerDataFile, JSON.stringify(PLAYER_OBJECTS.get(uuid)));
}

function exportToHistory(uuid: string, playerObj: any): void {
    let historyFile: string = PLAYER_HISTORY_FILE.replace("%UUID%", uuid);
    createFile(historyFile, "{}"); // creates the file if it doesn't already exist

    let addingObject: any = {};
    addingObject["username"] = playerObj["currentUsername"];
    addingObject["gexp"] = playerObj["totalGexpToday"];
    addingObject["rank"] = playerObj["currentRank"];
    // add all the data from the current player object into history object

    let historyJson: any = JSON.parse(readFile(historyFile)); // read history file
    historyJson[getFormattedDate()] = addingObject; // append history object to history json, with key as date
    writeString(historyFile, JSON.stringify(historyJson)); // save the file
}



// Returns a specific players data
export function getPlayerData(uuid: string): any | undefined {
    if(PLAYER_OBJECTS.has(uuid)) return PLAYER_OBJECTS.get(uuid);
    else return undefined;
}

// Returns all of todays player data as an array
export function getAllPlayersData(): Array<any> {
    return Array.from(PLAYER_OBJECTS.values());
}

// Returns the weekly GEXP of a player - GEXP from the last 7 days
export function getAccumulatedWeeklyGexp(uuid: string): number {
    let playerHistory: any = JSON.parse(readFile(PLAYER_HISTORY_FILE.replace("%UUID%", uuid)));
    if(playerHistory == undefined) return 0;
    let dates: Array<string> = Object.keys(playerHistory);

    // larger than or equal to, because the 7th day is the data we already have today (so get 6 days from history)
    while(dates.length >= 7) {
        dates.shift();
    }

    // now we have 6 dates, lets add together all the gexp
    let totalGexp: number = 0;
    dates.forEach(dateKey => {
        totalGexp += playerHistory[dateKey]["gexpEarned"];
    });
    totalGexp += PLAYER_OBJECTS.get(uuid)["totalGexpToday"];

    return totalGexp;
}

// Returns the monthly GEXP of a player - GEXP from the last 30 days
export function getAccumulatedMonthlyGexp(uuid: string): number {
    let playerHistory: any = JSON.parse(readFile(PLAYER_HISTORY_FILE.replace("%UUID%", uuid)));
    if(playerHistory == undefined) return 0;
    let dates: Array<string> = Object.keys(playerHistory);

    // larger than or equal to, because the 7th day is the data we already have today (so get 6 days from history)
    while(dates.length >= 30) {
        dates.shift();
    }

    // now we have 6 dates, lets add together all the gexp
    let totalGexp: number = 0;
    dates.forEach(dateKey => {
        totalGexp += playerHistory[dateKey]["gexpEarned"];
    });
    totalGexp += PLAYER_OBJECTS.get(uuid)["totalGexpToday"];

    return totalGexp;
}

// Returns all players' UUIDs in the guild
export function getAllUUIDs(): Array<string> {
    return Array.from(Object.keys(PLAYER_OBJECTS));
}





// Gets current day in month, e.g. 1st, 26th
function getCurrentDay(): number {
    var dateEst = new Date(); dateEst.setHours(dateEst.getHours() - 4); // Date as EST timezone
    return parseInt(dateEst.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(" ")[0].split("-")[2]);
}

// Returns e.g. 10:14am; 614
function getMinutesPastMidnight(): number {
    var dateEst = new Date(); dateEst.setHours(dateEst.getHours() - 4); // Date as EST timezone
    let arr: string[] = dateEst.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(" ")[1].split(":");

    return parseInt(arr[0]) * 60 + parseInt(arr[1]);
}

// Returns dd-mm-yyyy
// Duplicate function in "./log/logger.ts"
function getFormattedDate(): string {
    var dateEst = new Date(); dateEst.setHours(dateEst.getHours() - 4); // Date as EST timezone
    let reversed = dateEst.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(" ")[0];
    // reversed is now equal to 2012-11-04

    return reversed.split("-").reverse().join("-");
}