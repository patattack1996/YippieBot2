const express = require("express");
const app = express();

app.listen(3000, () => {
  console.log("project is running!");
})

app.get("/", (req, res)=>{
  res.send("hello world!");
})

const { Client, Collection, MessageEmbed } = require("discord.js");

const client = new Client({
  intents: 32767,
  restTimeOffset: 0,
  allowedMentions: {
    parse: ["roles", "users"],
    repliedUser: false,
  },
});

module.exports = client;
client.commands = new Collection();
client.slashCommands = new Collection();
client.db1 = [];
client.developer = ["431528138254581760", "948070668698796033", "1018914804540395570", "907605328399597598"];

require("./handler")(client);

client.login(process.env.token);