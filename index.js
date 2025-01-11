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

		// FIX: delete the line below
		setTimeout(() => message.delete(), 2000);
	}
});

client.login(config.BOT_TOKEN);
