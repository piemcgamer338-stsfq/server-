const translate = require("@vitalets/google-translate-api");

module.exports = (client) => {

    client.on("messageCreate", async (message) => {

        if (message.author.bot) return;
        if (!message.guild) return;

        // Only owner can use it
        if (message.author.id !== process.env.OWNER_ID) return;

        // Must reply to a message
        if (!message.reference) return;

        // Trigger word
        if (message.content.toLowerCase() !== "en") return;

        try {

            const replied = await message.fetchReference();

            if (!replied.content)
                return message.reply("Nothing to translate.");

            const result = await translate(
                replied.content,
                {
                    to: "en"
                }
            );

            await message.reply(
`## 🇺🇸 English Translation

${result.text}`
            );

        } catch (err) {

            console.log(err);

            message.reply("Translation failed.");

        }

    });

};
