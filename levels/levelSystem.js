const { PermissionsBitField } = require("discord.js");


const levelRoles = {

    5: "1532910668280500365",
    10: "1532910669223952518",
    20: "1532910670532579379",
    30: "1532910671807778896",
    40: "1532910672843767980",
    50: "1532910673930096811",
    60: "1532910675104501911",
    70: "1532910676119392296",
    80: "1532910677092598024",
    90: "1532910678006825105",
    100: "1532910679407726702"

};



module.exports = (client, db) => {



    // Create level tables

    db.query(`
    CREATE TABLE IF NOT EXISTS levels (

        user_id TEXT,
        guild_id TEXT,
        xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 0,

        PRIMARY KEY(user_id,guild_id)

    )
    `);



    db.query(`
    ALTER TABLE guilds
    ADD COLUMN IF NOT EXISTS level_channel TEXT
    `);





    client.on("messageCreate", async message => {


        if (message.author.bot) return;
        if (!message.guild) return;



        const args = message.content.split(" ");



        // ======================
        // SET LEVEL CHANNEL
        // ======================


        if (args[0] === ".setlevel") {


            if (
                !message.member.permissions.has(
                    PermissionsBitField.Flags.Administrator
                )
            ) {
                return message.reply(
                    "❌ Admin only"
                );
            }



            const channel =
                message.mentions.channels.first();



            if (!channel) {

                return message.reply(
                    "Use: `.setlevel #channel`"
                );

            }



            await db.query(
                `
                UPDATE guilds
                SET level_channel=$1
                WHERE guild_id=$2
                `,
                [
                    channel.id,
                    message.guild.id
                ]
            );



            return message.reply(
                `✅ Level channel set to ${channel}`
            );

        }





        // ======================
        // XP SYSTEM
        // ======================


        const data = await db.query(
            `
            SELECT *
            FROM levels
            WHERE user_id=$1
            AND guild_id=$2
            `,
            [
                message.author.id,
                message.guild.id
            ]
        );




        if (!data.rows.length) {


            await db.query(
                `
                INSERT INTO levels
                (user_id,guild_id,xp,level)

                VALUES($1,$2,1,0)
                `,
                [
                    message.author.id,
                    message.guild.id
                ]
            );


            return;

        }





        const user = data.rows[0];


        const xp = user.xp + 1;


        const newLevel = Math.floor(xp / 100);





        if (newLevel > user.level) {



            await db.query(
                `
                UPDATE levels

                SET xp=$1, level=$2

                WHERE user_id=$3
                AND guild_id=$4
                `,
                [
                    xp,
                    newLevel,
                    message.author.id,
                    message.guild.id
                ]
            );




            const settings = await db.query(
                `
                SELECT level_channel
                FROM guilds
                WHERE guild_id=$1
                `,
                [
                    message.guild.id
                ]
            );




            if (
                settings.rows[0] &&
                settings.rows[0].level_channel
            ) {


                const channel =
                message.guild.channels.cache.get(
                    settings.rows[0].level_channel
                );



                if(channel) {


                    channel.send(
`${message.author} **Congratulation** u Reached Level **${newLevel}** <a:rb1:1530379253735231562>`
                    );


                }

            }





            // Give role

            const roleID =
                levelRoles[newLevel];



            if(roleID) {


                const role =
                message.guild.roles.cache.get(roleID);



                if(role) {


                    message.member.roles.add(role)
                    .catch(()=>{});


                }

            }




        }



        await db.query(
            `
            UPDATE levels

            SET xp=$1

            WHERE user_id=$2
            AND guild_id=$3
            `,
            [
                xp,
                message.author.id,
                message.guild.id
            ]
        );



    });



};
