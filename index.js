import { Client, Events, GatewayIntentBits } from "discord.js";
import fetch from "node-fetch";
import { config } from "./config.js";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.once(Events.ClientReady, (c) => console.log(`${c.user.tag}: Ready`));

client.on(Events.MessageCreate, async (message) => {
	// don't reply if the message was sent by the bot,
	// or if the channels to reply in is not in the list
	if (
		message.author.bot === true ||
		config.CHANNELS.includes(message.channel.name) === false
	) {
		// FIX: delete the line below
		setTimeout(() => message.delete(), 5000);
		return;
	}

	// TODO: decide to reply only to specific bot username.
	// Only reply to the payments channel if found.
	await message.reply("Message sent successfully!!");

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
		console.log(_e);
	}

	// FIX: delete the line below
	setTimeout(() => message.delete(), 2000);
});

/**
 * @param {string} message
 * @returns {{
 *	"Customer Name": string,
 *	"Customer Contact": string,
 *	"Type": string,
 *	"Amount Remitted": string,
 *	"Date": string
 * }}
 */
function clean_message(message) {
	const string_lines = message.split("\n").slice(1);

	/** @type {{Name: string, Contact: string, "Receipt Number": string, "AMount Remitted": string, "Sender Receipt": string }} */
	const cleaned_data = {
		"Customer Name": "",
		"Customer Phone": "",
		Type: "Remittance In",
		"Amount Remitted": "",
		Date: new Date().toUTCString(),
	};

	for (const line of string_lines) {
		const colon_idx = line.indexOf(":");
		const key = line.slice(0, colon_idx);
		const value = line.slice(colon_idx + 1).trim();

		if (key in cleaned_data) {
			cleaned_data[key] = value;
		}
	}

	return cleaned_data;
}

client.login(config.BOT_TOKEN);
