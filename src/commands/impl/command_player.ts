import { Message } from "discord.js";
import { Command } from "../abstract_command";
import { EmbedBuilder } from "@discordjs/builders";
import { getUUID } from "../../api/player_db";
import { getMonthlyGexp, getMonthlyGexpEntries, getPlayerData } from "../../api/player_handler/player_handler";
import { TIER_REQUIREMENTS, getTierFromGexp } from "./command_tiers";

export class PlayerCommand extends Command {
    async onExecute(args: string[], discordMsg: Message): Promise<void> {
        if(args.length == 0) {
            discordMsg.channel.send("Incorrect usage.\nTry " + process.env.PREFIX + "`player <username>`");
            return;
        }

        let username: string = args[0];
        let uuid: string | undefined = await getUUID(username);
        if(username == "" || username.length > 16 || uuid == undefined) {
            discordMsg.channel.send("Invalid or unknown username.")
            return;
        }

        let entries = getMonthlyGexpEntries(uuid, false);
        let playerData = getPlayerData(uuid);
        try {
            playerData["currentRank"];
        } catch(ex) {
            discordMsg.channel.send("Player does not exist in guild.")
            return;
        }
        let fields = [];
        
        // code to get requirements for tiers (for projected tier)
        let gexpRequirements: Array<number> = Object.keys(TIER_REQUIREMENTS).map(item => {
            return parseInt(item, 10)
        });
        let gexpThisMonth = getMonthlyGexp(uuid, false);
        let nextTier = playerData["currentRank"] == "Guild Master" ? "Guild Master" : playerData["currentRank"] == "Admin" ? "Admin" : getTierFromGexp(playerData, gexpThisMonth, gexpRequirements);

        let embed: EmbedBuilder = new EmbedBuilder()
	            .setColor(0x3FB6B6)
	            .setTitle("Player Overview") // no need for invisible characters (longer)
	            .setDescription("Username: `" + playerData["currentUsername"] +"`\nTier: `" + playerData["currentRank"] + "`\nNext Tier: `" + nextTier + "`\nGEXP This Month: `" + gexpThisMonth + "`")
	            .setTimestamp(new Date())
	            .setFooter({ text: "GEXP Tracker" });

        
        // https://stackoverflow.com/questions/52423842/what-is-not-assignable-to-parameter-of-type-never-error-in-typescript
        // Splits the entries array (month of data) into many arrays of length 7 (the weeks)
        let weekArrays: number[][] = entries.reduce((all: any , one: any, i: any) => {
            const ch = Math.floor(i / 7); 
            all[ch] = [].concat((all[ch]||[]),one); 
            return all
        }, []);


        for(let i = 0; i < weekArrays.length; i++) {
            fields.push({name: "Week " + (i + 1), value: "`" + weekArrays[i].reduce((a, b) => a + b) + "` gexp"});
        }
        embed.addFields(fields);


        discordMsg.reply({ embeds: [ embed ] });
    }
}