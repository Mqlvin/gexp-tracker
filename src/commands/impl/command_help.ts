import { Message } from "discord.js";
import { Command } from "../abstract_command";
import { EmbedBuilder } from "@discordjs/builders";

export class HelpCommand extends Command {
    async onExecute(args: string[], discordMsg: Message): Promise<void> {
        let embed: EmbedBuilder = new EmbedBuilder()
	            .setColor(0x3FB6B6)
	            .setTitle("Monthly player ranks") // `\u1CBC` is invisible character
	            .setDescription(
                    "`!lb <daily/weekly/monthly>` - Displays a GEXP leaderboard for the specified timeframe.\n" +
                    "`!tiers` - Displays guild members categorised by the tier they've achieved."
                )
	            .setTimestamp(new Date())
	            .setFooter({ text: "GEXP Tracker" });

        discordMsg.channel.send({ embeds: [ embed ] });
    }
}