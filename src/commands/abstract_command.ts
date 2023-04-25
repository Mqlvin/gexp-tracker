import { Message } from "discord.js";

export abstract class Command {
    abstract onExecute(args: Array<string>, discordMsg: Message): void;
}