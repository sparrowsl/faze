import { Client, Events, GatewayIntentBits } from "discord.js";
import { config } from "./config.js";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.once(Events.ClientReady, (c) => {
	console.log(`Ready, logged in as: ${c.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
	// don't reply if the message was sent by the bot.
	if (message.author.bot === true) {
		// FIX: delete the line below
		setTimeout(() => message.delete(), 5000);
		return;
	}

	// TODO: decide to reply only to specific bot username.
	// Only reply to the payments channel if found.
	if (config.CHANNELS.includes(message.channel.name)) {
		await message.reply(`New Payment Receipt from Bot (faze)...
Name: Jack Daniels
Contact: +23299783218
Receipt Number: Check payment receipt
Amount Remitted: $50
Sender Receipt: https://www.url_link.com`);

		const fields = clean_message(message.content);

		try {
			const res = await fetch(
				`https://api.airtable.com/v0/${config.BASE_ID}/${config.TABLE_ID}`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${config.BEARER_TOKEN}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ fields }),
				},
			);
			const data = await res.json();
			console.log(data);
		} catch (_e) {
			console.log(_e.message);
			console.log(_e.cause);
		}

		// FIX: delete the line below
		setTimeout(() => message.delete(), 2000);
	}
});

/**
 * @param {string} message
 * @returns {{Name: string, Contact: string, "Receipt Number": string, "AMount Remitted": string, "Sender Receipt": string }}
 */
function clean_message(message) {
	const string_lines = message.split("\n").slice(1);

	/** @type {{Name: string, Contact: string, "Receipt Number": string, "AMount Remitted": string, "Sender Receipt": string }} */
	const cleaned_data = {
		Name: "",
		Contact: "",
		"Receipt Number": "",
		"Amount Remitted": "",
		"Sender Receipt": "",
	};

	for (const line of string_lines) {
		const colon_idx = line.indexOf(":");
		const key = line.slice(0, colon_idx);
		const value = line.slice(colon_idx + 1).trim();

		cleaned_data[key] = value;
	}

	return cleaned_data;
}

client.login(config.BOT_TOKEN);
