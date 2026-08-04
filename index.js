const {
    Client,
    GatewayIntentBits
} = require("discord.js");

const { Pool } = require("pg");

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
`).catch(console.error);



// ================= LOAD COMMANDS =================


try {
    require("./commands/memberCount")(client);
    console.log("✅ Member Count Loaded");
} catch (e) {
    console.log("⚠️ Member Count Missing");
}


try {
    require("./commands/translateReply")(client);
    console.log("✅ Translate Loaded");
} catch (e) {
    console.log("⚠️ Translate Missing");
}


try {
    require("./commands/embeds")(client);
    console.log("✅ Embeds Loaded");
} catch (e) {
    console.log("⚠️ Embeds Missing");
}


try {
    require("./commands/rules")(client);
    console.log("✅ Rules Loaded");
} catch (e) {
    console.log("⚠️ Rules Missing");
}


try {
    require("./commands/perks")(client);
    console.log("✅ Perks Loaded");
} catch (e) {
    console.log("⚠️ Perks Missing");
}


try {
    require("./commands/roles")(client);
    console.log("✅ Roles Loaded");
} catch (e) {
    console.log("⚠️ Roles Missing");
}



// ================= INVITE CACHE =================

const invites = new Map();



client.once("ready", async () => {

    console.log(`${client.user.tag} online`);


    for (const guild of client.guilds.cache.values()) {

        const data = await guild.invites.fetch().catch(() => null);

        if (data) {
            invites.set(guild.id, data);
        }

    }

});



client.on("inviteCreate", async invite => {

    const old = invites.get(invite.guild.id) || new Map();

    old.set(invite.code, invite);

    invites.set(invite.guild.id, old);

});



client.on("inviteDelete", async invite => {

    const old = invites.get(invite.guild.id);

    if (!old) return;

    old.delete(invite.code);

});




// ================= WELCOME SET =================


client.on("messageCreate", async message => {

    if (message.author.bot) return;

    if (!message.guild) return;


    const args = message.content.trim().split(/\s+/);



    if (args[0] === ".setwelcome") {


        if (!message.member.permissions.has("Administrator")) {
            return message.reply("❌ You need Administrator permission.");
        }


        const channel = message.mentions.channels.first();


        if (!channel) {
            return message.reply(
                "Usage: `.setwelcome #channel`"
            );
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



        message.reply(
            `✅ Welcome channel set to ${channel}`
        );


    }


});





// ================= WELCOME MESSAGE =================


client.on("guildMemberAdd", async member => {


    const oldInvites =
        invites.get(member.guild.id);



    const newInvites =
        await member.guild.invites.fetch()
        .catch(() => null);



    if (!newInvites) return;



    invites.set(
        member.guild.id,
        newInvites
    );



    let usedInvite;



    newInvites.forEach(invite => {


        const old =
            oldInvites?.get(invite.code);



        if (!old || invite.uses > old.uses) {

            usedInvite = invite;

        }


    });




    const result = await db.query(
`
SELECT welcome_channel
FROM guilds
