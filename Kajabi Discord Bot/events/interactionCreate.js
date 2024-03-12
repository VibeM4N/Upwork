const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    if (!interaction.isCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);
    if (!command) {
      return interaction
        .reply({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setDescription("⛔ | This command is outdated!"),
          ],
        })
        .then(() => client.slashCommands.delete(interaction.commandName));
    }

    try {
      command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
};
