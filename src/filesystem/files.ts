import { appendFileSync, closeSync, existsSync, openSync, readFileSync, writeSync } from "fs";
import { CACHE_DIR, PLAYERDATA_DIR, RUNTIME_DIR } from "./directories";

export const MC_NAME_CACHE_FILE: string = CACHE_DIR + "/minecraft-username-cache.json";
export const PLAYER_DATA_FILE: string = PLAYERDATA_DIR + "/%UUID%/data.json";

// Creates the file only if it doesn't already exist
// Returns true if the file was created, false if the file exists
export function createFile(path: string, initialisingContent: string): boolean {
    if(existsSync(path)) return false;

    let fd = openSync(path, "w", 0o666);
    writeSync(fd, initialisingContent);
    closeSync(fd);

    return true;
}



// Returns file contents as string
export function readFile(path: string): string {
    return readFileSync(path, { encoding: "utf8", flag: "r"});
}

// Returns file contents as string array
export function readFileIntoArray(path: string): Array<string> {
    return readFile(path).split("\n");
}

export function writeString(path: string, contents: string): void {
    let fd = openSync(path, "w", 0o666);
    writeSync(fd, contents);
    closeSync(fd);
}

export function appendString(path: string, dataToAppend: string): void {
    appendFileSync(path, dataToAppend);
}