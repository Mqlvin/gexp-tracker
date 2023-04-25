import { readFile, writeString } from "../filesystem/files";
import { MC_NAME_CACHE_FILE, createFile } from "../filesystem/files";
import { getJson } from "./requester";

const PLAYERDB_ENDPOINT = "https://playerdb.co/api/player/minecraft/";
const MILLISECONDS_IN_ONE_DAY = 1000 * 60 * 60 * 24 * 1;

let mcNameCache: Array<any> = [];

// Called on program startup
// MC_NAME_CACHE_FILE - {"uuid":"73b0cc9alf93", "username":"Mqlvin", "cached":16909000(unix-seconds)}
export function player_dbStartup(): void {
    let newFileCreated: boolean = createFile(MC_NAME_CACHE_FILE, "[]");
    // create a new file if one doesn't already exist
    // if a file did exist, then read it in to the `mcNameCache`
    if(!newFileCreated) {
        mcNameCache = JSON.parse(readFile(MC_NAME_CACHE_FILE));
    }
}



// Gets the username/uuid from playerdb - whether it should be gotten from cache or not is handled elsewhere
// This method updates the mcNameCache, and returns the new object {"uuid":"73b0... for the player data.
async function requestUpstreamUsername(playerId: string, wantUsername: boolean): Promise<object | undefined> {
    let response: any = await getJson(PLAYERDB_ENDPOINT + playerId, {"user-agent":"melvinkelvin#6328 on Discord"}); // Included as per requirement from playerdb.co

    if(response == undefined || response["success"] == "false") {
        return undefined;
    }
    // Otherwise the response is valid, so we can cache it

    // The old object in cache will be replaced with this new up-to-date object.
    let newPlayerObject: any = {"uuid": response["data"]["player"]["raw_id"], "username": response["data"]["player"]["username"], "cached": Date.now()};

    // i = the index of the players UUID object in mcNameCache
    let i: number = 0
    let playerWasInObject: boolean = false;
    for(i = 0; i < Object.keys(mcNameCache).length; i++) {
        if(mcNameCache[i][wantUsername ? "uuid" : "username"] == playerId) { // if "i" is the right index in the array
            mcNameCache[i] = newPlayerObject;
            playerWasInObject = true;
            break;
        }
    }

    // if the player was not in the mcNameCache, no object would've been updated, so we must add the player now
    mcNameCache.push(newPlayerObject);

    // Save the new cache to the file system
    writeString(MC_NAME_CACHE_FILE, JSON.stringify(mcNameCache));

    return mcNameCache[playerWasInObject ? i : mcNameCache.length - 1];
}



// Gets the username, either from cache or requests it from playerdb if cache time has expired
async function fetchUsername(uuid: string): Promise<string | undefined> {
    let playerObjIndex: number = getPlayerObjectIndex(uuid);
    if(playerObjIndex == -1) {  // if the player doesn't exist in our cache, request it from playerdb
        let newData: any = await requestUpstreamUsername(uuid, true);
        if(newData == undefined) return undefined;
        return newData["username"];
    }
    
    let playerObj: any = mcNameCache[playerObjIndex];
    // we now have the relevant player object

    // if the cache is expired, we must fetch the data from playerdb
    if(isCacheExpired(playerObj)) {
        let newData: any = await requestUpstreamUsername(uuid, true);
        // since the `playerObj` variable may be different to the fresh data just fetched, we must return the data directly provided by the method.
        return newData["username"];
    }

    return playerObj["username"];
}

// Simply gets the username from cache
async function fetchUUID(username: string): Promise<string | undefined> {
    let playerObjIndex: number = getPlayerObjectIndex(username);
    if(playerObjIndex == -1) { // if the player doesn't exist in our cache, request it from playerdb
        let newData: any = await requestUpstreamUsername(username, false);
        if(newData == undefined) return undefined;
        return newData["uuid"];
    }
    
    // otherwise if we do have the uuid, we don't need to refresh it since it doesn't change, so just return
    return mcNameCache[playerObjIndex]["uuid"];
}

// Returns true if the cache for a player object is expired, based on current time
// Player object is an object within mcNameCache
function isCacheExpired(playerObj: any): boolean {
    return playerObj["cached"] + MILLISECONDS_IN_ONE_DAY < Date.now();
}

// Takes UUID or username
// Returns the index of a player object in the mcNameCache
function getPlayerObjectIndex(usernameOrUUID: string): number {
    let objectItemCheck: string = (usernameOrUUID.length > 16 ? "uuid" : "username"); // This will be the item checked in the object
    let i: number = 0;
    for(i; i < mcNameCache.length; i++) {
        if(mcNameCache[i][objectItemCheck] == usernameOrUUID) {
            return i;
        }
    }

    return -1;
}



// Public method to get player UUID from username
export async function getUUID(username: string): Promise<string | undefined> {
    return await fetchUUID(username);
}

// Public method to get player username from UUID
export async function getUsername(uuid: string): Promise<string | undefined> {
    return await fetchUsername(uuid);
}