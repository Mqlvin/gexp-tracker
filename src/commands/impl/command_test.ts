import { Message } from "discord.js";
import { Command } from "../abstract_command";
import { getUUID } from "../../api/player_db";

export class TestCommand extends Command {
    async onExecute(args: string[], discordMsg: Message): Promise<void> {
        discordMsg.reply("UUID: " + await getUUID(args[0]));
    }
}