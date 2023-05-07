import { Message } from "discord.js";
import { Command } from "../abstract_command";
import { getAllPlayersData, getMonthlyGexp } from "../../api/player_handler/player_handler";
import { EmbedBuilder } from "@discordjs/builders";

export class TiersCommand extends Command {
    async onExecute(args: string[], discordMsg: Message): Promise<void> {
        let players: Array<any> = getAllPlayersData();
        let gexpRequirements: Array<number> = Object.keys(TIER_REQUIREMENTS).map(item => {
            return parseInt(item, 10)
        });

        let rankToPlayers: { [rank: string]: string[] } = {};
        players.forEach(player => {
            let rankToPlayersKey = getTierFromGexp(player, getMonthlyGexp(player["uuid"], false), gexpRequirements);
            if(!Object.keys(rankToPlayers).includes(rankToPlayersKey)) rankToPlayers[rankToPlayersKey] = ["%"]; // initialise an array if there isn't one already

            // Anything in a list before the % doesn't need changing. Anything after the % in the list needs changing.
            if(player["currentRank"] == rankToPlayersKey) {
                rankToPlayers[rankToPlayersKey].unshift(player["currentUsername"]);
            } else {
                rankToPlayers[rankToPlayersKey].push(player["currentUsername"]);
            }
        });

        // staff names to ignore
        let staffNamesToIgnore = process.env.STAFFLIST?.split(",").map(name => name.toLocaleLowerCase());

        // the categories for the embed
        let playerCategoriesForMessage = Object.keys(rankToPlayers);
        let messageContent: string = "";
        
        for(let i: number = 0; i < playerCategoriesForMessage.length; i++) {
            let needToAddExtraBreakline: boolean = true;
            if(rankToPlayers[playerCategoriesForMessage[i]][0] != "%") {
                messageContent += "\n\n\n**" + playerCategoriesForMessage[i] + " (don't change)**\n";
                needToAddExtraBreakline = false;
            }

            

            let noChange: boolean = true;
            rankToPlayers[playerCategoriesForMessage[i]].forEach(player => {
                if(staffNamesToIgnore?.includes(player.toLocaleLowerCase())) return;

                if(player == "%" && rankToPlayers[playerCategoriesForMessage[i]][rankToPlayers[playerCategoriesForMessage[i]].length - 1] != "%") {
                    noChange = false;
                    messageContent += (needToAddExtraBreakline ? "\n" : "") + "\n\n**" + playerCategoriesForMessage[i] + (playerCategoriesForMessage[i] == "Kick" ? "" : " (change)") + "**\n";
                    return;
                }

                messageContent += "`" + player + "` "
            });

            messageContent += "\n";


            // after 100 trial and errors, this message has been formatted correctly. DONT TOUCH!
        }

        let embed: EmbedBuilder = new EmbedBuilder()
	            .setColor(0x3FB6B6)
	            .setTitle("Monthly player ranks") // `\u1CBC` is invisible character
	            .setDescription(messageContent)
	            .setTimestamp(new Date())
	            .setFooter({ text: "GEXP Tracker" });

        discordMsg.channel.send({ embeds: [ embed ] });
    }
}




// These are the requirements and the corresponding ranks for my guild. You can change this.
// You can add more ranks and requirements, as many as you would like.
const TIER_REQUIREMENTS: { [tier: number]: string } = {
    0: "Kick",
    50000: "Tier 1",
    300000: "Tier 2",
    600000: "Tier 3"
};

function getTierFromGexp(playerObj: any, gexp: number, requirements: Array<number>): string {
    /*
        This is where you can change any special rules for a player.
        For example, in my guild a player of 4+ month in the guild receives a "Veteran" rank.
    */

    let fourMonthsAgo = new Date(); fourMonthsAgo.setHours(fourMonthsAgo.getHours() - (24 * 30 * 4));
    if(playerObj["playerJoined"] > Math.floor(fourMonthsAgo.valueOf() / 1000)) {
        // return "Veteran";
    }

    return TIER_REQUIREMENTS[findThreshold(requirements, gexp)];
}

// https://stackoverflow.com/questions/67473039/find-which-value-bracket-a-number-falls-within
function findThreshold(array: Array<number>, target: number, low = 0, high = array.length - 1): number {
    if (low > high) {
      return array[high]
    }
    const mid = Math.floor((low + high) / 2)
  
    if (target < array[mid]) {
      return findThreshold(array, target, low, mid - 1)
    } else if (target > array[mid]) {
      return findThreshold(array, target, mid + 1, high)
    } else {
      return array[mid]
    }
}
  