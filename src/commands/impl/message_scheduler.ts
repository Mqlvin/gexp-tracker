import { Client } from "discord.js";
import { sendTiersMessage } from "./command_tiers";

const ONE_MINUTE_IN_MILLISECONDS = 1000 * 60;
let lastDay: number = getCurrentDay();

export function schedule(discordClient: Client): void {
    setInterval(() => { checkTime(discordClient) }, ONE_MINUTE_IN_MILLISECONDS);
}

async function checkTime(discordClient: Client): Promise<void> {
    let today: number = getCurrentDay();
    if(today != lastDay && today == 1) { // today is the first of the month
        let possibleChannel = await discordClient.channels.fetch(process.env.GEXP_CHANNEL!);
        if(possibleChannel == undefined || possibleChannel == null) return;
        sendTiersMessage(possibleChannel);
    }
}



function getCurrentDay(): number {
    var dateEst = new Date(); dateEst.setHours(dateEst.getHours() - 4); // Date as EST timezone
    return parseInt(dateEst.toISOString().replace(/T/, ' ').replace(/\..+/, '').split(" ")[0].split("-")[2]);
}