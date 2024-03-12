// Import necessary modules
const { MessageEmbed, Client } = require("discord.js");
const mongoose = require("mongoose");
require("dotenv").config();

// Define MongoDB schema
const userJoinSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  joinDate: { type: Date, default: Date.now, required: true },
});

// Define MongoDB model
const UserJoin = mongoose.model("UserJoin", userJoinSchema);

// Define MongoDB schema for sent messages
const sentMessageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
});

// Define MongoDB model for sent messages
const SentMessage = mongoose.model("SentMessage", sentMessageSchema);

// Function to send a message to users who joined more than 10 days ago
async function sendWelcomeMessageToOldUsers(client) {
  try {
    // Connect to MongoDB database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Calculate the date 10 days ago
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    // Find users who joined more than 10 days ago and have not received the message
    const usersJoinedBefore10Days = await UserJoin.find({
      joinDate: { $lte: tenDaysAgo },
    });

    // Filter out users who have already received the message
    const unsentUsers = await Promise.all(
      usersJoinedBefore10Days.map(async (user) => {
        const isSent = await SentMessage.exists({ userId: user.userId });
        return isSent ? null : user;
      })
    );

    // Send a message to users who have not received the message yet
    await Promise.all(
      unsentUsers
        .filter((user) => user !== null)
        .map(async (user) => {
          try {
            const guild = client.guilds.cache.get("1213509780421873726"); // Update with your guild ID
            if (!guild) return;
            const member = await guild.members.fetch(user.userId);
            if (member) {
              const embed = new MessageEmbed()
                .setColor("#0099ff")
                .setTitle("Lassen Sie sich diese Chance nicht entgehen")
                .setDescription(
                  `Hey ${member}, hast du dir bereits den kostenlosen Kurs angesehen? Und wie kommst du generell mit deinem Dropshipping Business voran?`
                );
              await member.send({ embeds: [embed] });

              // Mark the message as sent
              await SentMessage.create({ userId: user.userId });
            }
          } catch (error) {
            console.error(`Failed to send message to ${user.userId}: ${error}`);
          }
        })
    );

    // Disconnect from MongoDB
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = { sendWelcomeMessageToOldUsers };
