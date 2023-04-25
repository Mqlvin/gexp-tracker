import { existsSync, mkdirSync } from "fs";

export const RUNTIME_DIR: string = "../runtime";

export const CACHE_DIR: string = RUNTIME_DIR + "/cache";
export const PLAYERDATA_DIR: string = RUNTIME_DIR + "/player-data";

// Creates all folders - called on program startup
export function createRuntimeDirectories(): void {
    mkdirIfNotExist(RUNTIME_DIR);
    mkdirIfNotExist(CACHE_DIR);
    mkdirIfNotExist(PLAYERDATA_DIR);
}

// Creates a folder
function mkdirIfNotExist(path: string): void {
    if(!existsSync(path)) mkdirSync(path);
}