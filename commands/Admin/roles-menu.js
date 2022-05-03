const { Permissions, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');
const moment = require('moment');

module.exports = {
    name: "role-menu",
    aliases: ['roles-menu'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    const menu = new MessageButton({
        customId: "create",
        label: "",
        style: "SECONDARY",
        emoji: "➕",
    })
    const menu_1 = new MessageButton({
        customId: "remove",
        label: "",
        style: "SECONDARY",
        emoji: "➖",
    })
    const menu_2 = new MessageButton({
        customId: "edit",
        label: "",
        style: "SECONDARY",
        emoji: "✏️",
    })
    const menu_3 = new MessageButton({
        customId: "list",
        label: "",
        style: "SECONDARY",
        emoji: "📑",
    })
    const row = new MessageActionRow({
        components: [ menu, menu_1, menu_2, menu_3 ],
    })

    switch(arr[0]) {
        case 'FR_fr': {
            message.channel.send({
                content: `${message.author}`,
                embeds: [{
                    color: `#f71b2e`,
                    title: `Rôles-menu`,
                    description: "`📑` **Voir les rôles-menus**\n\n`➕` **Créer un rôle-menu**\n`➖` **Supprimer un rôle-menu**\n\n`✏️` **Editer un rôle-menu**",
                }],
                components: [ row ]
            }).then(async (msg) => {
                let arrayComponents = [];

                const filter = (interaction) => interaction.user.id === message.author.id && interaction.isButton();
                awaitButtons()

                async function awaitButtons() {
                    let collected;
                    try {
                        collected = await msg.awaitMessageComponent({ filter: filter, time: 30e3 });
                    } catch (err) {
                        if (err.code === "INTERACTION_COLLECTOR_ERROR") {
                            return msg.delete()
                        }
                    }
                
                    if (!collected.deffered) await collected.deferUpdate();

                    switch(collected.customId) {
                        case 'create': {
                            const menu = new MessageButton({
                                customId: "message",
                                label: "",
                                style: "SECONDARY",
                                emoji: "📄",
                            })
                            const menu_1 = new MessageButton({
                                customId: "role",
                                label: "",
                                style: "SECONDARY",
                                emoji: "📌",
                            })
                            const row = new MessageActionRow({
                                components: [ menu, menu_1 ],
                            })

                            msg.edit({
                                content: `${message.author}, création d'un nouveau rôle-menu`,
                                embeds: [{
                                    color: `#f71b2e`,
                                    title: `Créer un rôle-menu`,
                                    description: "`📄` **Message du rôle-menu (ID)**\n`📌` **Rôle à attribuer**"
                                }],
                                components: [ row ]
                            }).then(async (m) => {
                            })
                            awaitButtons();
                            break;
                        }

                        case 'remove': {
                            awaitButtons();
                            break;
                        }

                        case 'edit': {
                            awaitButtons();
                            break;
                        }

                        case 'list': {
                            awaitButtons();
                            break;
                        }

                        // <! -- Création du rôle-menu -->

                        case 'message': {
                            
                            awaitButtons();
                            break;
                        }
                    }
                }
            })
        }

        case 'EN_en': {

        }
    }

    }
}