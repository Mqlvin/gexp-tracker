import { Message } from "discord.js";
import { Command } from "../abstract_command";

export class TestCommand extends Command {
    onExecute(args: string[], discordMsg: Message): void {
        console.log("executed test command with: " + args)
    }
}