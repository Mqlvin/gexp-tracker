import { Client, GatewayIntentBits, ActivityType, Message } from "discord.js";

import { createRuntimeDirectories } from "./filesystem/directories";
import { player_dbStartup } from "./api/player_db";
import { hypixelStartup } from "./api/hypixel";
import { dispatchCommand, initCommands } from "./commands/command_handler";
import { LogType, logger, loggerStartup } from "./log/logger";
import { schedule } from "./commands/impl/message_scheduler";

const client: Client = new Client( {intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]} );

function bootupSync(): void {
    createRuntimeDirectories(); // create directories for cache files (in case not already made?)
    loggerStartup();

    player_dbStartup(); // read and load files/cache
    hypixelStartup(); // read and load files/cache

    initCommands(); // initialise commands in the command handler

    schedule(client); // NOTE: Client is likely not initialised here (it has at least 60 seconds to intiialise though)
}

bootupSync();




client.on("messageCreate", (message: Message) => {
    if(message.author.id == client.user?.id) return;
    
    dispatchCommand(message);
});

client.on("ready", () => {
    logger(LogType.INFO, "Bot logged in: " + client.user?.tag);
    console.log("Bot started...")

    client.user?.setActivity('your GEXP', { type: ActivityType.Watching });
});

client.login(process.env.BOT_TOKEN);