const {
    Client,
    GatewayIntentBits,
    PermissionsBitField
} = require("discord.js");

const { Pool } = require("pg");


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildInvites
    ]
});



const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});



db.query(`
CREATE TABLE IF NOT EXISTS guilds (
    guild_id TEXT PRIMARY KEY,
    welcome_channel TEXT
)
`);



// Invite cache
const inviteCache = new Map();



// Save current invites
async function cacheInvites(guild) {

    try {

        const invites = await guild.invites.fetch();

        inviteCache.set(
            guild.id,
            new Map(
                invites.map(inv => [
                    inv.code,
                    inv.uses
                ])
            )
        );


    } catch (err) {

        console.log(
            "Cannot cache invites:",
            err.message
        );

    }

}





client.once("ready", async () => {


    console.log(
        `${client.user.tag} online`
    );


    for (const guild of client.guilds.cache.values()) {

        await cacheInvites(guild);

    }


});





client.on("inviteCreate", async invite => {

    await cacheInvites(invite.guild);

});



client.on("inviteDelete", async invite => {

    await cacheInvites(invite.guild);

});







client.on("messageCreate", async message => {

    if (message.author.bot) return;
    if (!message.guild) return;

    const args = message.content.split(" ");

    // ==========================
    // SET WELCOME
    // ==========================

    if (args[0] === ".setwelcome") {

        if (
            !message.member.permissions.has(
                PermissionsBitField.Flags.Administrator
            )
        ) {
            return message.reply("❌ You need Administrator permission");
        }

        const channel = message.mentions.channels.first();

        if (!channel) {
            return message.reply("Use: `.setwelcome #channel`");
        }

        await db.query(
            `
            INSERT INTO guilds(guild_id,welcome_channel)
            VALUES($1,$2)
            ON CONFLICT(guild_id)
            DO UPDATE SET welcome_channel=$2
            `,
            [
                message.guild.id,
                channel.id
            ]
        );

        return message.reply(
            `✅ Welcome channel set to ${channel}`
        );
    }

    // ==========================
    // RULES
    // ==========================

    if (args[0] === ".rules") {

        const { EmbedBuilder } = require("discord.js");

        const embed = new EmbedBuilder()
            .setColor("#00D8FF")
            .setTitle("/6xy Community Rules")
            .setDescription(
`<a:dot:1528726500075900968> Be respectful to other members.
<a:dot:1528726500075900968> Do not spam or use excessive caps.
<a:dot:1528726500075900968> Mentions of server raiding will lead to a ban.
<a:dot:1528726500075900968> No NSFW content.
<a:dot:1528726500075900968> Be channel-specific (i.e keep your discussions in suitable channels)
<a:dot:1528726500075900968> Follow the Discord Community Guidelines and Terms of Service.
<a:dot:1528726500075900968> Please keep the chats in English only.
<a:dot:1528726500075900968> No alt accounts allowed. Alts can result in ban.

**Also follow discord tos**

https://discord.com/terms
https://discord.com/guidelines`
            );

        return message.channel.send({
            embeds: [embed]
        });

    }

});









client.on("guildMemberAdd", async member => {


    let inviter = "Unknown";



    try {


        const oldInvites =
            inviteCache.get(member.guild.id);



        const newInvites =
            await member.guild.invites.fetch();



        for (const invite of newInvites.values()) {


            const oldUses =
                oldInvites?.get(invite.code) || 0;



            if (invite.uses > oldUses) {


                inviter =
                    invite.inviter
                    ? `<@${invite.inviter.id}>`
                    : "Unknown";


                break;


            }


        }



        await cacheInvites(member.guild);



    } catch (err) {


        console.log(
            "Invite error:",
            err.message
        );


    }





    const result =
        await db.query(
            "SELECT welcome_channel FROM guilds WHERE guild_id=$1",
            [
                member.guild.id
            ]
        );



    if (!result.rows.length)
        return;




    const channel =
        member.guild.channels.cache.get(
            result.rows[0].welcome_channel
        );



    if (!channel)
        return;




    channel.send(
`<:right_arrow_purple:1532994544705212447> ${member} **Joined** ; Invited by ${inviter} | Server have **${member.guild.memberCount}** Members <:Halloween4:1532994476824461423>`
    );



});







client.login(
    process.env.DISCORD_TOKEN
);
