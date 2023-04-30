import { LOG_DIR } from "../filesystem/directories";
import { appendString, createFile } from "../filesystem/files";

const LOG_FILE_PATH: string = LOG_DIR + "/" + "log-" + getFormattedDate() + ".txt"; // log-24.04.2023.txt



export enum LogType {
    INFO,
    WARNING,
    ERROR,
    REQUEST
}

export function loggerStartup(): void {
    createFile(LOG_FILE_PATH, "")
}

export function logger(type: LogType, content: string): void {
    appendString(LOG_FILE_PATH, 
        "[" + getLogTime() + "] " +
        "[" + LogType[type] + "] " +
        content + "\n"
    );
}




// Returns dd-mm-yyyy
function getFormattedDate(): string {
    let reversed = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split(" ")[0];
    // reversed is now equal to 2012-11-04

    return reversed.split("-").reverse().join("-");
}

function getLogTime(): string {
    let isoString = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace("-", "/").replace("-", "/"); // '2023/25/04 20:09:53'

    return isoString.split(" ").reverse().join(" ");
}