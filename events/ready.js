const { MessageEmbed, MessageAttachment } = require("discord.js");
const client = require("../index");

client.on("ready", async () => {
  let servers = client.guilds.cache.size;
  let servercount = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
  console.log(
    `Ready! Logged in as ${client.user.tag}\ncurrently in ${servers} servers and watching over ${servercount} members`
  );
  console.log(`Ping: ${client.ws.ping}`);
});