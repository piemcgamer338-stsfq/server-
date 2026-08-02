const {
    PermissionsBitField
} = require("discord.js");

const roles = {

    staff: "1532910626790179010",
    hstaff: "1532910626072952912",
    mod: "1532910623585865901",
    hmod: "1532910621593571349",
    admin: "1532910620859437138",
    hadmin: "1532910618594512976",
    manager: "1532910613976715266",
    hmanager: "1532910612772818996"

};

module.exports = (client) => {

    client.on("messageCreate", async message => {

        if (message.author.bot) return;
        if (!message.guild) return;

        // Only owner
        if (message.author.id !== process.env.OWNER_ID) return;

        const args = message.content.trim().toLowerCase().split(" ");

        const command = args[0];

        if (!roles[command]) return;

        let member;

        // Reply method
        if (message.reference) {

            const replied = await message.fetchReference().catch(() => null);

            if (replied)
                member = replied.member;

        }

        // Mention method
        if (!member)
            member = message.mentions.members.first();

        if (!member)
            return message.reply(
                "Reply to a user or mention one."
            );

        const role =
            message.guild.roles.cache.get(
                roles[command]
            );

        if (!role)
            return message.reply(
                "Role not found."
            );

        if (member.roles.cache.has(role.id))
            return message.reply(
                `${member.user.username} already has that role.`
            );

        await member.roles.add(role);

        message.reply(
            `✅ Gave **${role.name}** to **${member.user.username}**`
        );

    });

};
