import { Message } from "discord.js";
import { Command } from "../abstract_command";
import { EmbedBuilder } from "@discordjs/builders";

export class HelpCommand extends Command {
    async onExecute(args: string[], discordMsg: Message): Promise<void> {
        let embed: EmbedBuilder = new EmbedBuilder()
	            .setColor(0x3FB6B6)
	            .setTitle("Help command") // `\u1CBC` is invisible character
	            .setDescription(
                    "`g!help` - Displays this message.\n" +
                    "`g!lb <daily/weekly/monthly>` - Displays a GEXP leaderboard for the specified timeframe.\n" +
                    "`g!tiers` - Displays guild members categorised by the tier they've achieved.\n" +
                    "`g!player <username>` - Displays monthly GEXP information for the specified player.\n" + 
                    "`g!vets` - Displays a list of veterans and should-be veterans."
                )
	            .setTimestamp(new Date())
	            .setFooter({ text: "GEXP Tracker" });

        discordMsg.channel.send({ embeds: [ embed ] });
    }
}