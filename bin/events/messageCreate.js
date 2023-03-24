const client = require("../index");
const {
  MessageEmbed,
  Permissions,
  MessageActionRow,
  MessageButton,
} = require("discord.js");

client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  const p = "!"
  if (!message.content.startsWith(p)) return;
  if (message.author.bot) return;
  if (!message.member)
    message.member = await message.guild.fetchMember(message);
  const args = message.content.slice(p.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length == 0) return;
  const command =
    client.commands.get(cmd.toLowerCase()) ||
    client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));

  if (!command) return;

  if (command?.owner === true && !client.developer.includes(message.author.id)) return;

  if (command) {
    if (
      !message.guild.me
        .permissionsIn(message.channel)
        .has("SEND_MESSAGES", "EMBED_LINKS")
    )
      return;

    if (!message.member.permissions.has(command.userPerms || [])) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Missing Permisssion")
            .setDescription(
              "My apologies but you do not have the required permissions to run this command."
            )
            .addField(
              "Required Permissions",
              `\`\`\`${cmd.userPerms
                .map((perm) => nicerPermissions(perm))
                .join("\n")}\`\`\``
            )
            .setColor("#6F8FAF"),
        ],
        ephemeral: true,
      });
    }

    if (!message.guild.me.permissions.has(command.botPerms || [])) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Missing Permisssion")
            .setDescription(
              "My apologies but I do not have the required permissions to run this command."
            )
            .addField(
              "Required Permissions",
              `\`\`\`${cmd.botPerms
                .map((perm) => nicerPermissions(perm))
                .join("\n")}\`\`\``
            )
            .setColor("#6F8FAF"),
        ],
        ephemeral: true,
      });
    }

    if (message.content.length > command.msgLimit) {
      let limit = new MessageEmbed()
        .setDescription(
          `My apologies please keep the message content under ${command.msgLimit} characters.`
        )
        .setColor("#6F8FAF");
      return message.reply({
        embeds: [limit],
      });
    }
    command.run(client, message, args);
  }
});

function nicerPermissions(permissionString) {
  return permissionString
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}