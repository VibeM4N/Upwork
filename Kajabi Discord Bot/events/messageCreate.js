const { Message } = require('discord.js');

// Create a Map to store message logs
const messageLogs = new Map();

module.exports = {
  name: 'messageCreate',
  execute(message, client) {
    // Check if the message is from a user in a DM channel
    if (!message.author.bot && message.channel.type === 'DM') {
      const logChannel = client.channels.cache.get('1213509782560841792');
      if (logChannel instanceof Message) {
        // Log incoming DMs and store the message ID along with the user ID
        logChannel.send(`Incoming DM from ${message.author}: ${message.content}`);
        const messageLog = {
          userId: message.author.id,
          messageId: message.id
        };
        // Save message log to the Map
        messageLogs.set(message.id, messageLog);
      }
    }
  },
  getMessageLogs: function() {
    return messageLogs;
  }
};
