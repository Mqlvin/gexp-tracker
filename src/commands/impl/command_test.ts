import { Message } from "discord.js";
import { Command } from "../abstract_command";
import { requestGuildDataAndUpdatePlayers } from "../../api/player_handler/request_scheduler";

export class TestCommand extends Command {
    async onExecute(args: string[], discordMsg: Message): Promise<void> {
        if(args[0].toLowerCase() == "exporthistory") {
            let msg = discordMsg.reply("Force exporting guild history data...");
            await requestGuildDataAndUpdatePlayers(true);
            (await msg).edit("Exported all guild history data!")
        }
    }
}