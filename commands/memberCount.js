const { EmbedBuilder } = require("discord.js");

module.exports = (client) => {

    client.on("messageCreate", async (message) => {

        if (message.author.bot) return;
        if (!message.guild) return;

        const cmd = message.content.toLowerCase();

        if (cmd !== "mc" && cmd !== ".mc") return;

        await message.guild.members.fetch();

        let online = 0;
        let idle = 0;
        let offline = 0;

        message.guild.members.cache.forEach(member => {

            if (member.user.bot) return;

            const status = member.presence?.status || "offline";

            if (status === "online")
                online++;

            else if (status === "idle")
                idle++;

            else
                offline++;

        });

        const total =
            message.guild.members.cache.filter(
                m => !m.user.bot
            ).size;

        const embed = new EmbedBuilder()

            .setColor("#00D8FF")

            .setTitle("Member Statistics")

            .setDescription(
`<:online:1516052083529351319> **Online:** ${online}

<:rainymm_reddot:1534132705376210945> **Offline:** ${offline}

<:idel:1534132138830463027> **Idle:** ${idle}

<:panda_heart:1533402152633110528> **Total Members:** ${total}`
            );

        message.reply({
            embeds: [embed]
        });

    });

};
