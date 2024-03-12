const { Client, Interaction, Message } = require('discord.js');
const { getMessageLogs } = require("../events/messageCreate.js"); // Import the getMessageLogs function

module.exports = {
  name: 'respond',
  description: "respond to the DM with the bot",
  async execute(interaction, client) {
    // Get the message logs Map using the getMessageLogs function
    const messageLogs = getMessageLogs();
    
    // Get the message ID and custom message from the interaction data
    const messageId = interaction.options.getString('message_id');
    const customMessage = interaction.options.getString('custom_message');

    // Fetch the message using its ID from the messageLogs Map
    const messageLog = messageLogs.get(messageId);
    if (!messageLog) {
      await interaction.reply('Invalid message ID or message is not a DM.');
      return;
    }
    
    // Fetch the message using its ID from the channel
    const message = await interaction.channel.messages.fetch(messageId);
    
    // Check if the message exists and is a DM
    if (message instanceof Message && message.channel.type === 'DM') {
      // Reply to the user in the DM channel with the custom message
      try {
        await message.reply(customMessage);
        await interaction.reply('Reply sent successfully!');
      } catch (error) {
        console.error('Failed to send reply:', error);
        await interaction.reply('Failed to send reply.');
      }
    } else {
      // If the message doesn't exist or is not a DM, send an error message
      await interaction.reply('Invalid message ID or message is not a DM.');
    }
  },
};
