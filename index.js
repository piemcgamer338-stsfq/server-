const translate = require("translate");

translate.engine = "google";

module.exports = (client) => {

    client.on("messageCreate", async (message) => {

        if (message.author.bot) return;
        if (!message.guild) return;

        // Only owner
        if (message.author.id !== process.env.OWNER_ID) return;

        // Must reply
        if (!message.reference) return;

        // Command
        if (message.content.toLowerCase() !== "en") return;

        try {

            const replied = await message.fetchReference();

            if (!replied.content)
                return message.reply("Nothing to translate.");

            const translated = await translate(
                replied.content,
                "en"
            );

            await message.reply({
                content:
`## 🇺🇸 English Translation

${translated}`
            });

        } catch (err) {

            console.error(err);

            message.reply("❌ Translation failed.");

        }

    });

};
