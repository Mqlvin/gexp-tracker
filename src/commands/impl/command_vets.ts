import { getUsername } from "../../api/player_db";
import { getAllPlayersData, getAllUUIDs } from "../../api/player_handler/player_handler";
import { Command } from "../abstract_command";
import { Message, EmbedBuilder } from "discord.js";

const fourMonthsAgoInSeconds: number = 60 * 60 * 24 * 120;

export class VeteranCommand extends Command {
    async onExecute(args: string[], discordMsg: Message): Promise<void> {
        if(!discordMsg.member?.roles.cache.find(role => role.id == process.env.ADMIN_RANK_ID!)
        && !discordMsg.member?.roles.cache.find(role => role.id == process.env.DEV_RANK_ID!)
        && !discordMsg.member?.roles.cache.find(role => role.id == process.env.CLOUDY_RANK_ID!)) return;



        let players: any[] = getAllPlayersData();

        let vetUsernames: string[] = [];
        let shouldBeVetUsernames: string[] = [];
        let unixFourMonthsAgo = (Date.now() / 1000) - fourMonthsAgoInSeconds;
        let staffNamesToIgnore = process.env.STAFFLIST?.split(",").map(name => name.toLowerCase());
        players.forEach(async (obj: any) => {
            if(staffNamesToIgnore?.includes(obj.currentUsername.toLowerCase())) return;

            if(obj.currentRank == "Veteran") {
                vetUsernames.push(obj.currentUsername);
            }
            // else has potential to be veteran, if not ignore
            else {
                if(obj.playerJoined < unixFourMonthsAgo) {
                    shouldBeVetUsernames.push(obj.currentUsername);
                }
            }
        });

        // all vars to this point are correct

        // now we will generate the message
        let msgAlreadyVet: string = "`" + vetUsernames.join("`, `") + "`";
        let msgShouldBeVet: string = "`" + shouldBeVetUsernames.join("`, `") + "`";

        let embedAlreadyVet: EmbedBuilder = new EmbedBuilder()
	            .setColor(0x3FB649)
	            .setTitle("Players - Veterans") // `\u1CBC` is invisible character
	            .setDescription(
                    msgAlreadyVet
                )
	            .setTimestamp(new Date())
	            .setFooter({ text: "GEXP Tracker" });

        let embedShouldBeVet: EmbedBuilder = new EmbedBuilder()
	            .setColor(0x3FB6B6)
	            .setTitle("Player - Should be veteran") // `\u1CBC` is invisible character
	            .setDescription(
                    msgShouldBeVet
                )
	            .setTimestamp(new Date())
	            .setFooter({ text: "GEXP Tracker" });
        
        // and finally send the message
        discordMsg.reply({ embeds: [ embedAlreadyVet, embedShouldBeVet ] });
    }
}