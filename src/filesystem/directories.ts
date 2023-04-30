import { existsSync, mkdirSync } from "fs";

export const RUNTIME_DIR: string = "../runtime";

export const CACHE_DIR: string = RUNTIME_DIR + "/cache";
export const PLAYERDATA_DIR: string = RUNTIME_DIR + "/player-data";
export const LOG_DIR: string = RUNTIME_DIR + "/log"

// Creates all folders - called on program startup
export function createRuntimeDirectories(): void {
    mkdirIfNotExist(RUNTIME_DIR);
    mkdirIfNotExist(CACHE_DIR);
    mkdirIfNotExist(PLAYERDATA_DIR);
    mkdirIfNotExist(LOG_DIR);
}

export function createPlayerDirectory(uuid: string): void {
    mkdirIfNotExist(PLAYERDATA_DIR + "/" + uuid);
}

// Creates a folder
function mkdirIfNotExist(path: string): void {
    if(!existsSync(path)) mkdirSync(path);
}