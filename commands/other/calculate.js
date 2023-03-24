const Discord = require("discord.js");
const {
    disableButtons
} = require("../../Utils.js")

module.exports = {
    name: "calculate",
    category: "other",
    description: "embed.",
    usage: "",
    type: "msg",
    owner: true,
    run: async (client, message, args) => {
        if (client.db1.legnth === 0) return message.reply('Theres no data.')

        let embed = new Discord.MessageEmbed()
            .setTitle(`Calculate the results`)
            .setDescription(`This will calculate the 2 winners of guess the outcome!`)
            .setColor("PURPLE")
            .setTimestamp();

        const row = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
            .setCustomId(`enterc`)
            .setLabel("Calculate")
            .setStyle("PRIMARY")
        );

        const modal = new Discord.Modal()
            .setCustomId('stakec')
            .setTitle('Yippieyieyo');

        const input1 = new Discord.TextInputComponent()
            .setCustomId(`highestMultic`)
            .setLabel("Highest multi (only numbers):")
            .setStyle("SHORT")
            .setMinLength(1)
            .setMaxLength(25)
            .setRequired(true);

        const input2 = new Discord.TextInputComponent()
            .setCustomId(`endBalancec`)
            .setLabel("Highest win (only numbers):")
            .setStyle("SHORT")
            .setMinLength(1)
            .setMaxLength(25)
            .setRequired(true);

        const ActionRow1 = new Discord.MessageActionRow().addComponents(input1);

        const ActionRow2 = new Discord.MessageActionRow().addComponents(input2);

        modal.addComponents(ActionRow1, ActionRow2);

        let msg = await message.reply({
            embeds: [embed],
            components: [row],
        });

        const collector = msg.createMessageComponentCollector({
            time: 300000,
        });

        const collector2 = new Discord.InteractionCollector(client, {
            channel: message.channel.id,
            interactionType: "MODAL_SUBMIT",
        });

        collector.on("collect", async (i) => {
            if (i.user.id !== message.author.id)
                return i.reply({
                    content: "This is not for you.",
                    ephemeral: true,
                });
            if (i.customId === 'enterc') {
                await i.showModal(modal);
                await msg.edit({
                    components: disableButtons(msg.components),
                });
            }
        });
        let data = client.db1;
        collector2.on("collect", async (c) => {
            if (c.customId === `stakec`) {
                const input1 = c.fields.getTextInputValue(`highestMultic`);
                const input2 = c.fields.getTextInputValue(`endBalancec`);

                /*function isWhole(n) {
                    return /^\d+$/.test(n);
                }

                if (!isWhole(input1) || !isWhole(input2))
                    return c.reply({
                        content: "Options have to be whole numbers.",
                        ephemeral: true,
                    });
                  */

                //let higestDataMulti = Math.max(...data.map(o => o.data[2]))
                //let higestDataBalance = Math.max(...data.map(o => o.data[3]))


                var closest = data.reduce(function(prev, curr) {
                    return (Math.abs(curr.hm - +input1) < Math.abs(prev.hm - +input1) ? curr : prev);
                });

                var closest2 = data.reduce(function(prev, curr) {
                    return (Math.abs(curr.eb - +input2) < Math.abs(prev.eb - +input2) ? curr : prev);
                });
console.log(data)
                console.log(closest);

                let i1 = data.findIndex(v => v.hm === closest.hm)
                let i2 = data.findIndex(v => v.eb === closest2.eb)
                console.log(i1)
                console.log(i2)
                await c.reply({
                    content: `The winner of the highest multi is ${data[i1]?.user}, he/she guessed: ${closest.hm}x\nThe winner of the highest win is ${data[i2]?.user}, he/she guessed: ${closest2.eb}$`,
                    ephemeral: true,
                })
                client.db1 = [];
            }
        });
    }
}