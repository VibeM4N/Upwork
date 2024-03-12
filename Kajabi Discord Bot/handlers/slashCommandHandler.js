const { readdirSync } = require("fs");
const { join } = require("path");

module.exports.slashCommandHandler = async (client) => {
  const slashCommandFiles = await readdirSync("./slashCommands").filter((file) =>
    file.endsWith(".js")
  );

  let commandsArray = [];
  slashCommandFiles.forEach((file) => {
    const command = require(join(__dirname, "../slashCommands", file)); // Provide the correct directory path
    client.slashCommands.set(command.name, command);
    commandsArray.push(command);
  });

  client.application.commands.set(commandsArray);

  return console.log(`Loaded ${slashCommandFiles.length} commands`);
};