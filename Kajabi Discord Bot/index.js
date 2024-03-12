const { Client, Intents, MessageEmbed, Collection } = require("discord.js");
const { eventHandler } = require("./handlers/eventHandler");
const { slashCommandHandler } = require("./handlers/slashCommandHandler");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
});
require("dotenv").config();
const KAJABI_API_KEY = process.env.KAJABI_API_KEY;
const COURSE_ID = process.env.COURSE_ID;
const TOKEN = process.env.TOKEN;

module.exports = client;

client.slashCommands = new Collection();

eventHandler(client);

client.login(TOKEN);
