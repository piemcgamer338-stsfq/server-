const {
    Client,
    GatewayIntentBits,
    Partials
} = require("discord.js");

require("dotenv").config();

const memberCount = require("./commands/memberCount");
const translateReply = require("./commands/translateReply");

// add your other systems here later
// const greet = require("./greet/greetSystem");


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



client.once("ready", () => {

    console.log(`${client.user.tag} online`);

});



// Commands / systems

memberCount(client);

translateReply(client);


// Put your other files here later
// greet(client);



client.login(process.env.DISCORD_TOKEN);
