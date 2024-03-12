const { slashCommandHandler } = require("../handlers/slashCommandHandler");
const { sendWelcomeMessageToOldUsers } = require("../autoSendMessage")

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    await slashCommandHandler(client);

    // Call the function to send messages to users who joined more than 10 days ago when the bot starts up
    sendWelcomeMessageToOldUsers(client);
    // Schedule the function to run periodically (e.g., once a day)
    setInterval(() => {
      sendWelcomeMessageToOldUsers(client);
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

    console.log(`Logged in as ${client.user.tag}`);
  },
};
