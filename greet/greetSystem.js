const { PermissionsBitField } = require("discord.js");


module.exports = (client, db) => {


    db.query(`
    ALTER TABLE guilds
    ADD COLUMN IF NOT EXISTS greet_channel TEXT
    `);



    // .greet #channel

    client.on("messageCreate", async message => {


        if (message.author.bot) return;
        if (!message.guild) return;


        const args = message.content.split(" ");



        if (args[0] === ".greet") {


            if (
                !message.member.permissions.has(
                    PermissionsBitField.Flags.Administrator
                )
            ) {
                return message.reply("❌ Admin only");
            }



            const channel =
                message.mentions.channels.first();



            if (!channel) {

                return message.reply(
                    "Use: `.greet #channel`"
                );

            }



            await db.query(
                `
                UPDATE guilds
                SET greet_channel=$1
                WHERE guild_id=$2
                `,
                [
                    channel.id,
                    message.guild.id
                ]
            );



            return message.reply(
                `✅ Greet channel set to ${channel}`
            );

        }


    });





    // Member join message

    client.on("guildMemberAdd", async member => {



        const data = await db.query(
            `
            SELECT greet_channel
            FROM guilds
            WHERE guild_id=$1
            `,
            [
                member.guild.id
            ]
        );



        if (!data.rows.length) return;



        const channelID =
            data.rows[0].greet_channel;



        if (!channelID) return;



        const channel =
            member.guild.channels.cache.get(
                channelID
            );



        if (!channel) return;



        channel.send(
`﹒6xy™﹒ <:firstnight_heart:1527007026750951555>    .  . !!

.　⁺ welc . . . ${member}　<a:panda_heart:1527004702980706394>

　♡ <:heart_bandage:1527004627743277118> .gg/6xy　›　[vouches](https://discord.com/channels/1521776721626533888/1532910777088999494)　[rules](https://discord.com/channels/1521776721626533888/1532910774211837973)　♩　　‧　<a:lyf_butterfly_white:1527004636169633872>`
        );



    });



};
