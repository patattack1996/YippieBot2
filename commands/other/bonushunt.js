const Discord = require("discord.js");
const playing = new Set();
const { disableButtons } = require("../../Utils.js")

module.exports = {
    name: "bonushunt",
    category: "other",
    description: "embed.",
    usage: "",
    type: "msg",
  owner: true,
    run: async (client, message, args) => {
        let embed = new Discord.MessageEmbed()
            .setTitle(`Guess the outcome`)
            .setDescription(`Guess the Outcome is a bonus hunt game that pits players against each other to accurately predict the outcomes of two events. In this game, players must guess the Highest Multiplier achieved and the End Balance after the bonus round. The player with the closest predictions to the actual outcomes wins the game and the prize.`)
            .setColor("PURPLE")
            .setTimestamp();

        const row = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
            .setCustomId(`enter`)
            .setLabel("Join")
            .setStyle("PRIMARY")
        );

        const modal = new Discord.Modal()
            .setCustomId('stake')
            .setTitle('Yippieyieyo');

        const input1 = new Discord.TextInputComponent()
            .setCustomId(`stakeName`)
            .setLabel("Stake Name")
            .setStyle("SHORT")
            .setMinLength(1)
            .setMaxLength(50)
            .setRequired(true);

        const input2 = new Discord.TextInputComponent()
            .setCustomId(`kickName`)
            .setLabel("Kick Name:")
            .setStyle("SHORT")
            .setMinLength(1)
            .setMaxLength(25)
            .setRequired(true);

        const input3 = new Discord.TextInputComponent()
            .setCustomId(`highestMulti`)
            .setLabel("Highest multi (only numbers):")
            .setStyle("SHORT")
            .setMinLength(1)
            .setMaxLength(25)
            .setRequired(true);

        const input4 = new Discord.TextInputComponent()
            .setCustomId(`endBalance`)
            .setLabel("Highest win (only numbers):")
            .setStyle("SHORT")
            .setMinLength(1)
            .setMaxLength(25)
            .setRequired(true);

        const ActionRow1 = new Discord.MessageActionRow().addComponents(input1);

        const ActionRow2 = new Discord.MessageActionRow().addComponents(input2);

        const ActionRow3 = new Discord.MessageActionRow().addComponents(input3);

        const ActionRow4 = new Discord.MessageActionRow().addComponents(input4);

        modal.addComponents(ActionRow1, ActionRow2, ActionRow3, ActionRow4);

        let msg = await message.reply({
            embeds: [embed],
            components: [row],
        });

        const collector = msg.createMessageComponentCollector({
            time: 10 * 60 * 1000,
        });

        const collector2 = new Discord.InteractionCollector(client, {
            channel: message.channel.id,
            interactionType: "MODAL_SUBMIT",
        });

        collector.on("collect", async (i) => {
            if (playing.has(i.user.id))
                return i.reply({
                    content: "You already entered.",
                    ephemeral: true,
                });
            if (i.customId === 'enter') {
              await i.showModal(modal);
              playing.add(i.user.id);
            }
        });
        let data = []
        collector2.on("collect", async (c) => {
            if (c.customId === `stake`) {
                const input1 = c.fields.getTextInputValue(`stakeName`);
                const input2 = c.fields.getTextInputValue(`kickName`);
                const input3 = c.fields.getTextInputValue(`highestMulti`);
                const input4 = c.fields.getTextInputValue(`endBalance`);
              
              function isWhole(n) {
                return /^\d+$/.test(n);
              }

               // if (!isWhole(input3) || !isWhole(input4))
               //   return c.reply({
               //     content: "Last two options have to be whole numbers.",
               //     ephemeral: true,
               //   });
                data.push({
                    user: c.user.tag,
                    data: [input1, input2],
                  hm: input3,
                  eb: input4,
                })
                client.db1.push(data[0])

                await c.reply({
                    content: `Your answers were sent.`,
                    ephemeral: true,
                })
                  let mapped = data.map(v => {
                    return `-------------------\n> Discord: ${v.user}\n> Stake Name: ${v.data[0]}\n> Kick Name: ${v.data[1]}\n> Highest Multi: ${v.hm}\n> End Balance: ${v.eb}`;
                  })
              data = []
                      client.channels.cache.get('1062408736712446023').send(`${mapped.join('\n-------------------\n')}`)
            }
        });
        collector.on("end", async (i, reason) => {
          collector2.stop();
          await msg.edit({
            components: disableButtons(msg.components),
          });
        });
    }
}