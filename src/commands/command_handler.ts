import { Message } from "discord.js";
import { TestCommand } from "./impl/command_test";
import { Command } from "./abstract_command";
import { LogType, logger } from "../log/logger";
import { LeaderboardCommand } from "./impl/command_leaderboard";

const PREFIX: string = (process.env.PREFIX == undefined ? "error!" : process.env.PREFIX);
const commandObject: Map<string, Command> = new Map<string, Command>();



export function initCommands(): void {
    commandObject.set("test", new TestCommand());
    commandObject.set("lb", new LeaderboardCommand());
}

export function dispatchCommand(discordMsg: Message): void {
    if(!discordMsg.content.startsWith(PREFIX)) return; // This is not a command for the bot

    logger(LogType.INFO, "User \"" + discordMsg.author.tag + "\" executed command: \"" + discordMsg.content + "\"");

    let commandParts: Array<string> = stripPrefix(discordMsg.content).split(" ");
    let command: string | undefined = commandParts.shift();

    // now `commandParts` contains the args, and `command` is the identifier of the command

    if(command == undefined || !commandObject.has(command)) {
        discordMsg.reply(":warning: Unknown command. Try `" + PREFIX + "help` for a full list of commands!");
        return;
    }

    // @ts-ignore: Object is possibly 'null'.
    commandObject.get(command).onExecute(commandParts, discordMsg);
}

function stripPrefix(message: string): string {
    return message.substring(PREFIX.length);
}   