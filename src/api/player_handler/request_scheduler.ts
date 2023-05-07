import { getGuildData } from "../hypixel";
import { savePlayer } from "./player_handler";

const SECONDS_BETWEEN_REQUEST: number = 60;

export function startRequesting(): void {
    requestGuildDataAndUpdatePlayers(false); // call it once to start or else it'll wait 60s to run the first one
    setInterval(() => { requestGuildDataAndUpdatePlayers(false) }, SECONDS_BETWEEN_REQUEST * 1000);
}

export async function requestGuildDataAndUpdatePlayers(forceExportHistory: boolean): Promise<void> {
    let gdata: any = await getGuildData(process.env.HYPIXEL_API_KEY!, process.env.GUILD_ID!);

    if(gdata == undefined) return;
    if(!gdata["success"]) return;

    let members: Array<any> = gdata["guild"]["members"];

    for(let i: number = 0; i < members.length; i++) {
        let member: any = members[i];
        savePlayer(member["uuid"], member, forceExportHistory);
    }
}