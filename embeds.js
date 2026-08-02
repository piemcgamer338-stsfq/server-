const { EmbedBuilder } = require("discord.js");

const CYAN = "#00D8FF";


module.exports = {

    rules() {

        return new EmbedBuilder()
            .setColor(CYAN)
            .setTitle("/6xy Community Rules")
            .setDescription(
`<a:dot:1528726500075900968> Be respectful to other members.
<a:dot:1528726500075900968> Do not spam or use excessive caps.
<a:dot:1528726500075900968> Mentions of server raiding will lead to a ban.
<a:dot:1528726500075900968> No NSFW content.
<a:dot:1528726500075900968> Be channel-specific (i.e. keep your discussions in suitable channels).
<a:dot:1528726500075900968> Follow the Discord Community Guidelines and Terms of Service.
<a:dot:1528726500075900968> Please keep the chats in English only.
<a:dot:1528726500075900968> No alt accounts allowed. Alts can result in a ban.

**Also follow Discord ToS**

https://discord.com/terms
https://discord.com/guidelines`
            )
            .setImage("https://media.discordapp.net/attachments/1359151586835693662/1440892681634054164/unknown.png?ex=6a6ffde1&is=6a6eac61&hm=ad54b064cb4c20903e68ad2ddb830982dda473790d0e5cf8d5bd4b714e2e95d7&=&format=webp&quality=lossless");

    },



    perk1() {

        return new EmbedBuilder()
            .setColor(CYAN)
            .setDescription(
`.gg//6xy If you want to earn **Free Loyal Nitro** You have to follow these steps :

<a:dot:1528726500075900968> Must have **"Supporter" Role**. You can get it by putting your status .gg/6xy

<a:dot:1528726500075900968> Must have **"VIP" Role** <:VIP:1533026174526165043>. You can get it by dragging **Miku Giveaways** on top of your server list and ask for role in ⁠unknown after dragg[...]

<a:dot:1528726500075900968> Must be active in <#1532910791546638471> and follow our server pings.

<a:dot:1528726500075900968> Must have **"6xy" Tag** <a:rb1:1530379253735231562>`
            )
            .setImage("https://media.discordapp.net/attachments/1359151586835693662/1440892681634054164/unknown.png?ex=6a6ffde1&is=6a6eac61&hm=ad54b064cb4c20903e68ad2ddb830982dda473790d0e5cf8d5bd4b714e2e95d7&=&format=webp&quality=lossless");

    },



    perk2() {

        return new EmbedBuilder()
            .setColor(CYAN)
            .setDescription(
`<:VIP:1533026174526165043> **Boost Reward** *Listed Below* :

**1x** Boost : 2 Week Nitro <:nitro:1533026966515613828> & 0.20 <:Ltc:1527472200641286244>

**2x** Boost : 2 Week Nitro <:nitro:1533026966515613828> & 0.50 <:Ltc:1527472200641286244>`
            )
            .setImage("https://media.discordapp.net/attachments/1359151586835693662/1440892681634054164/unknown.png?ex=6a6ffde1&is=6a6eac61&hm=ad54b064cb4c20903e68ad2ddb830982dda473790d0e5cf8d5bd4b714e2e95d7&=&format=webp&quality=lossless");

    }

};
