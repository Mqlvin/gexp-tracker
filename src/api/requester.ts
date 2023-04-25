// import fetch from "node-fetch";

import { LogType, logger } from "../log/logger";

export async function getJson(url: string, requestHeaders: any): Promise<any> {
    let response = await fetch(url, {headers: requestHeaders});

    logger(LogType.REQUEST, "Request made to URL: \"" + url + "\"");

    return response.json();
}