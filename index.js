const {
    Client,
    GatewayIntentBits,
    Partials
} = require("discord.js");


// =======================
// CLIENT
// =======================

const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildPresences

    ],

    partials: [

        Partials.Channel,
        Partials.Message,
        Partials.GuildMember

    ]

});



// =======================
// LOAD COMMANDS / SYSTEMS
// =======================


// welcome system
try {
    require("./welcome/welcomeSystem")(client);
    console.log("✅ Welcome system loaded");
} catch (e) {
    console.log("⚠️ Welcome system missing");
}


// greet system
try {
    require("./greet/greetSystem")(client);
    console.log("✅ Greet system loaded");
} catch (e) {
    console.log("⚠️ Greet system missing");
}


// member count
try {
    require("./commands/memberCount")(client);
    console.log("✅ Member count loaded");
} catch (e) {
    console.log("⚠️ Member count missing");
}


// translate reply
try {
    require("./commands/translateReply")(client);
    console.log("✅ Translate loaded");
} catch (e) {
    console.log("⚠️ Translate missing");
}


// embeds commands
try {
    require("./commands/embeds")(client);
    console.log("✅ Embed commands loaded");
} catch (e) {
    console.log("⚠️ Embeds missing");
}


// rules command
try {
    require("./commands/rules")(client);
    console.log("✅ Rules loaded");
} catch (e) {
    console.log("⚠️ Rules missing");
}


// perks
try {
    require("./commands/perks")(client);
    console.log("✅ Perks loaded");
} catch (e) {
    console.log("⚠️ Perks missing");
}


// role commands
try {
    require("./commands/roles")(client);
    console.log("✅ Role commands loaded");
} catch (e) {
    console.log("⚠️ Roles missing");
}



// =======================
// READY
// =======================

client.once("ready", () => {

    console.log(
        `${client.user.tag} online`
    );

});



// =======================
// LOGIN
// =======================

client.login(
    process.env.DISCORD_TOKEN
);
