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


const invites = new Map();


client.once("ready", async () => {

    console.log(`${client.user.tag} online`);

    for (const guild of client.guilds.cache.values()) {

        const inv = await guild.invites.fetch().catch(() => null);

        if (inv)
            invites.set(guild.id, inv);
    }
});



client.on("messageCreate", async message => {

    if (message.author.bot) return;
    if (!message.guild) return;


    const args = message.content.split(" ");


    if (args[0] === ".setwelcome") {


        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return message.reply("Admin only");


        const channel = message.mentions.channels.first();


        if (!channel)
            return message.reply("Use: .setwelcome #channel");


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


        message.reply(`✅ Welcome channel set to ${channel}`);

    }

});



client.on("guildMemberAdd", async member => {


    const oldInvites = invites.get(member.guild.id);


    const newInvites = await member.guild.invites.fetch().catch(() => null);


    if (!newInvites) return;


    invites.set(member.guild.id,newInvites);


    let inviter = "Unknown";


    newInvites.forEach(inv => {

        const old = oldInvites?.get(inv.code);


        if(old && inv.uses > old.uses)
        {
            inviter = inv.inviter;
        }

    });



    const data = await db.query(
        "SELECT welcome_channel FROM guilds WHERE guild_id=$1",
        [member.guild.id]
    );


    if(!data.rows.length) return;


    const channel = member.guild.channels.cache.get(
        data.rows[0].welcome_channel
    );


    if(!channel) return;



    channel.send(
`<:right_arrow_purple:1532994544705212447> ${member} **Joined** ; Invited by ${inviter} | Server have **${member.guild.memberCount}** Members <:Halloween4:1532994476824461423>`
    );


});



client.login(process.env.DISCORD_TOKEN);
