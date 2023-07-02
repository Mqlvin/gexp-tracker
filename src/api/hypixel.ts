import { startRequesting } from "./player_handler/request_scheduler";
import { getJson } from "./requester";

const GUILD_ENDPOINT: string = "https://api.hypixel.net/guild?id=%ID%"


export function hypixelStartup(): void {
    startRequesting();
}

export async function getGuildData(key: string, guildId: string): Promise<any | undefined> {
    let formattedEndpoint = GUILD_ENDPOINT.replace("%ID%", guildId);

    let response: any = await getJson(formattedEndpoint, {"API-Key":key});

    return response;
}