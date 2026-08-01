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
<a:dot:1528726500075900968> Be channel-specific (i.e keep your discussions in suitable channels)
<a:dot:1528726500075900968> Follow the Discord Community Guidelines and Terms of Service.
<a:dot:1528726500075900968> Please keep the chats in English only.
<a:dot:1528726500075900968> No alt accounts allowed. Alts can result in ban.

**Also follow Discord ToS**

https://discord.com/terms
https://discord.com/guidelines`
            );
    },

    perk1() {
        return new EmbedBuilder()
            .setColor(CYAN)
            .setDescription(
`.gg//6xy If you want to earn **Free Loyal Nitro** You have to follow these steps :

<a:blue_dot:1394806045813244050> Must have **Supporter** role. You can get it by putting your status **.gg/6xy**
<a:blue_dot:1394806045813244050> Must have **VIP** Role <:VIP:1533026174526165043>. You can get it by dragging **Miku Giveaways** to the top of your server list and asking for the role in <#unknown>.
<a:blue_dot:1394806045813244050> Must be active in <#1532910791546638471> and follow our server pings.
<a:blue_dot:1394806045813244050> Must have **6xy** Tag <a:rb1:1530379253735231562>`
            );
    },

    perk2() {
        return new EmbedBuilder()
            .setColor(CYAN)
            .setDescription(
`<:VIP:1533026174526165043> **Boost Reward** *Listed Below* :

**1x** Boost : 2 Week Nitro <:nitro:1533026966515613828> & 0.20 <:Ltc:1527472200641286244>

**2x** Boost : 2 Week Nitro <:nitro:1533026966515613828> & 0.50 <:Ltc:1527472200641286244>`
            );
    }

};
