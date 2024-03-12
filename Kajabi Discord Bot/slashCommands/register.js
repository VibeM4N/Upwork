require("dotenv").config();
const { CommandInteraction, MessageEmbed } = require("discord.js");
const axios = require("axios");
const KAJABI_API_SECRET = process.env.KAJABI_API_SECRET;
const KAJABI_API_KEY = process.env.KAJABI_API_KEY;
const KAJABI_API_URL =
  "https://api.newkajabi.com/v1/courses/2148528064/memberships";

module.exports = {
  name: "register",
  description: "Register yourself with the kajabi course.",
  options: [
    {
      name: "name",
      description: "Provide me with your name.",
      type: "STRING",
      required: true,
    },
    {
      name: "email",
      description: "Provide me with your email.",
      type: "STRING",
      required: true,
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const { options, member } = interaction;

    const Name = options.getString("name");
    const Email = options.getString("email");

    interaction.reply({ content: "Done", ephemeral: true });

    await interaction.channel.send({content: `${Name} ${Email}`});
  },
};
