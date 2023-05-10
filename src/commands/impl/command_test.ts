import { Message } from "discord.js";
import { Command } from "../abstract_command";
import { requestGuildDataAndUpdatePlayers } from "../../api/player_handler/request_scheduler";
import { sendTiersMessage } from "./command_tiers";

export class TestCommand extends Command {
    async onExecute(args: string[], discordMsg: Message): Promise<void> {
        if(!(discordMsg.member?.roles.cache.find(role => role.id == process.env.ADMIN_RANK_ID! && role.id == process.env.DEV_RANK_ID))) return;

        if(args[0].toLowerCase() == "exporthistory") {
            let msg = discordMsg.reply("Force exporting guild history data...");
            await requestGuildDataAndUpdatePlayers(true);
            (await msg).edit("Exported all guild history data!")
        } else if(args[0].toLowerCase() == "forcetiers") {
            let possibleChannel = await discordMsg.client.channels.fetch(process.env.GEXP_CHANNEL!);
            if(possibleChannel == undefined || possibleChannel == null) return;
            sendTiersMessage(possibleChannel);
        }
    }
}