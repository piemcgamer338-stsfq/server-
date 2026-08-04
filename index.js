const {
    Client,
    GatewayIntentBits,
    PermissionsBitField
} = require("discord.js");

const sqlite3 = require("sqlite3").verbose();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildPresences
    ]
});


// ================= DATABASE =================

const db = new sqlite3.Database("./database.sqlite");

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS guilds (
            guild_id TEXT PRIMARY KEY,
            welcome_channel TEXT
        )
    `);

});



// ================= LOAD COMMAND FILES =================

try {
    require("./commands/memberCount")(client);
    console.log("✅ Member Count Loaded");
} catch(e) {
    console.log("❌ Member Count Missing");
}


try {
    require("./commands/translateReply")(client);
    console.log("✅ Translate Loaded");
} catch(e) {
    console.log("❌ Translate Missing");
}


try {
    require("./commands/embeds")(client);
    console.log("✅ Embeds Loaded");
} catch(e) {
    console.log("❌ Embeds Missing");
}


try {
    require("./commands/rules")(client);
    console.log("✅ Rules Loaded");
} catch(e) {
    console.log("❌ Rules Missing");
}


try {
    require("./commands/perks")(client);
    console.log("✅ Perks Loaded");
} catch(e) {
    console.log("❌ Perks Missing");
}


try {
    require("./commands/roles")(client);
    console.log("✅ Roles Loaded");
} catch(e) {
    console.log("❌ Roles Missing");
}



// ================= INVITES =================

const invites = new Map();



client.once("ready", async () => {

    console.log(`${client.user.tag} is online!`);


    for (const guild of client.guilds.cache.values()) {

        const guildInvites = await guild.invites.fetch().catch(() => null);

        if (guildInvites)
            invites.set(guild.id, guildInvites);

    }

});



client.on("inviteCreate", invite => {

    const guildInvites = invites.get(invite.guild.id) || new Map();

    guildInvites.set(invite.code, invite);

    invites.set(invite.guild.id, guildInvites);

});



client.on("inviteDelete", invite => {

    const guildInvites = invites.get(invite.guild.id);

    if (!guildInvites) return;

    guildInvites.delete(invite.code);

});





// ================= SET WELCOME =================


client.on("messageCreate", message => {


    if (message.author.bot) return;

    if (!message.guild) return;


    const args = message.content.split(" ");



    if (args[0] === ".setwelcome") {


        if (!message.member.permissions.has(
            PermissionsBitField.Flags.Administrator
        ))
            return message.reply("You need Administrator permission.");



        const channel = message.mentions.channels.first();



        if (!channel)
            return message.reply("Usage: `.setwelcome #channel`");



        db.run(
            `
            INSERT OR REPLACE INTO guilds
            (guild_id,welcome_channel)
            VALUES(?,?)
            `,
            [
                message.guild.id,
                channel.id
            ]
        );



        message.reply(
            `✅ Welcome channel set to ${channel}`
        );

    }


});





// ================= WELCOME MESSAGE =================


client.on("guildMemberAdd", async member => {


    const oldInvites = invites.get(member.guild.id);


    const newInvites =
        await member.guild.invites.fetch()
        .catch(() => null);



    if (!newInvites)
        return;



    invites.set(
        member.guild.id,
        newInvites
    );



    let usedInvite;



    newInvites.forEach(invite => {


        const old =
            oldInvites?.get(invite.code);



        if (!old || invite.uses > old.uses)
            usedInvite = invite;



    });



    db.get(
        `
        SELECT welcome_channel 
        FROM guilds 
        WHERE guild_id = ?
        `,
        [
            member.guild.id
        ],

        (err,row)=>{


            if (!row)
                return;



            const channel =
                member.guild.channels.cache.get(
                    row.welcome_channel
                );



            if (!channel)
                return;



            channel.send(

`<:right_arrow_purple:1532994544705212447> ${member.user.username} **Joined** ; Invited by ${usedInvite?.inviter ? usedInvite.inviter : "**Unknown**"} | Server have **${member.guild.memberCount}** Members <:Halloween4:1532994476824461423>`

            );


        }

    );


});



// ================= LOGIN =================

client.login(
    process.env.DISCORD_TOKEN
);
