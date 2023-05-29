import { Message } from "discord.js";
import { Command } from "../abstract_command";
import { getMonthlyGexp, getAccumulatedWeeklyGexp, getAllPlayersData, getAllUUIDs } from "../../api/player_handler/player_handler";
import { EmbedBuilder } from "@discordjs/builders";
import { getUsername } from "../../api/player_db";

export class LeaderboardCommand extends Command {
    async onExecute(args: string[], discordMsg: Message): Promise<void> {
        if(args.length == 0) {
            discordMsg.channel.send("Incorrect usage.\nTry " + process.env.PREFIX + "`lb <daily/weekly/monthly>`");
            return;
        }

        let type: string = args[0].toLowerCase();

        if(type == "daily") {
            let playerObjects: Array<any> = getAllPlayersData();
            playerObjects.sort((a, b) => (a["totalGexpToday"] < b["totalGexpToday"]) ? 1 : -1); // sort it by `totalGexpToday`

            // generate the body of the embed as a string
            let leaderboardMessageBuilder: string = "";
            for(let i: number = 0; i < Math.min(10, playerObjects.length); i++) {
                let playerData = playerObjects[i];
                leaderboardMessageBuilder += "`#" + (i + 1) + "` " + playerData["currentUsername"] + ": **" + playerData["totalGexpToday"] + "** ";
                if(i == 0) leaderboardMessageBuilder += ":first_place:";
                else if(i == 1) leaderboardMessageBuilder += ":second_place:";
                else if(i == 2) leaderboardMessageBuilder += ":third_place:";
                leaderboardMessageBuilder += "\n";
            }

            // build the embed
            let embed: EmbedBuilder = new EmbedBuilder()
	            .setColor(0x3FB6B6)
	            .setTitle("GEXP Leaderboard - Today \u1CBC\u1CBC\u1CBC\u1CBC\u1CBC\u1CBC\u1CBC\u1CBC\u1CBC") // `\u1CBC` is invisible character
	            .setDescription(leaderboardMessageBuilder)
	            .setTimestamp(new Date())
	            .setFooter({ text: "GEXP Tracker" });

            // send the embed
            discordMsg.channel.send({ embeds: [ embed ] });


        } else if(type == "monthly" || type == "weekly") {
            let playerUUIDs: Array<any> = getAllUUIDs();
            let uuidToGexp: Map<string, number> = new Map<string, number>();

            // all uuids of players, for each add their uuid->gexp
            playerUUIDs.forEach(uuid => {
                uuidToGexp.set(uuid, (type == "monthly" ? getMonthlyGexp(uuid, false) : getAccumulatedWeeklyGexp(uuid)));
            });

            // we've got the map sorted by gexp
            let mapSorted: Map<string, number> = new Map([...uuidToGexp.entries()].sort((a, b) => b[1] - a[1]));

            let names: Array<string> = Array.from(mapSorted.keys());
            if(names == undefined || names.length == 0) return;
            for(let i: number = 0; i < names.length; i++) {
                let name = await getUsername(names[i]);
                names[i] = (name == undefined ? "`null`" : name);
            }

            let gexpValues: Array<number> = Array.from(mapSorted.values());


            // generate the body of the embed as a string
            let leaderboardMessageBuilder: string = "";
            for(let i: number = 0; i < Math.min(10, names.length); i++) {
                leaderboardMessageBuilder += "`#" + (i + 1) + "` " + names[i] + ": **" + gexpValues[i] + "** ";
                if(i == 0) leaderboardMessageBuilder += ":first_place:";
                else if(i == 1) leaderboardMessageBuilder += ":second_place:";
                else if(i == 2) leaderboardMessageBuilder += ":third_place:";
                leaderboardMessageBuilder += "\n";
            }

            // build the embed
            let embed: EmbedBuilder = new EmbedBuilder()
	            .setColor(0x3FB6B6)
	            .setTitle("GEXP Leaderboard - For the last " + (type == "monthly" ? "month" : "week")) // no need for invisible characters (longer)
	            .setDescription(leaderboardMessageBuilder)
	            .setTimestamp(new Date())
	            .setFooter({ text: "GEXP Tracker" });

            // send the embed
            discordMsg.channel.send({ embeds: [ embed ] });


        } else {
            discordMsg.channel.send("Incorrect usage.\nTry " + process.env.PREFIX + "lb <daily/weekly/monthly>");
            return;
        }
    }
}