import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";

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
		setTimeout(() => message.delete(), 5000);
		return;
	}

	await message.reply(`New Payment from Bot...
Name: Jack Daniels
Contact: +23299783218
Receipt Number: Check payment receipt
Amount Remitted: $50
Sender Receipt: https://www.url_link.com`);

	setTimeout(() => message.delete(), 2000);
});

client.login(process.env.BOT_TOKEN);
