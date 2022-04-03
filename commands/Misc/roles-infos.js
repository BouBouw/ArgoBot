const fetch = require('node-fetch')
const moment = require('moment');
const db = require('quick.db');

module.exports = {
    name: "roles-infos",
    aliases: ['roles-info', 'ri'],
    description: "",
execute: async (client, message, args) => {
    const arr = db.get(`global_settings_${client.user.id}`)

    const role = message.mentions.roles.first()

    switch(arr[0]) {
        case 'FR_fr': {
            const x = Date.now() - role.createdAt;
            const created = Math.floor(x / 86400000);

            let perms = {
                "ADMINISTRATOR": "`Adminstrateur`",
                "VIEW_GUILD_INSIGHTS": "`Voir les informations du serveur`",
                "VIEW_AUDIT_LOG": "`Voir les logs du serveur`",
                "MANAGE_GUILD": "`Gérer le serveur`",
                "MANAGE_ROLES": "`Gérer les rôles`",
                "MANAGE_CHANNELS": "`Gérer les salons`",
                "KICK_MEMBERS": "`Expulser des membres`",
                "BAN_MEMBERS": "`Bannir des membres`",
                "CREATE_INSTANT_INVITE": "`Créer une invitation`",
                "CHANGE_NICKNAME": "`Changer le pseudo`",
                "MANAGE_NICKNAMES": "`Gérer les pseudos`",
                "MANAGE_EMOJIS": "`Gérer les émojis`",
                "MANAGE_WEBHOOKS": "`Gérer les webhooks`",
                "READ_MESSAGES": "`Lires les messages des salons textuels`",
                "VIEW_CHANNEL": "`Voir les salons textuels et vocaux`",
                "SEND_MESSAGES": "`Envoyer des messages`",
                "SEND_TTS_MESSAGES": "`Envoyer des messages TTS`",
                "MANAGE_MESSAGES": "`Gérer les messages`",
                "EMBED_LINKS": "`Intégrer des liens`",
                "ATTACH_FILES": "`Joindre des fichiers`",
                "READ_MESSAGE_HISTORY": "`Voir les anciens messages`",
                "MENTION_EVERYONE": "`Mentionner @everyone, @here et tous les rôles`",
                "USE_EXTERNAL_EMOJIS": "`Utiliser des émojis externes`",
                "ADD_REACTIONS": "`Ajouter des réactions`",
                "CONNECT": "`Se connecter`",
                "SPEAK": "`Parler`",
                "STREAM": "`Vidéo`",
                "MUTE_MEMBERS": "`Couper le micro des membres`",
                "DEAFEN_MEMBERS": "`Mettre en sourdine des membres`",
                "MOVE_MEMBERS": "`Déplacer les membres`",
                "USE_VAD": "`Utiliser la détection de la voix`",
                "PRIORITY_SPEAKER": "`Voix prioritaire`"
            };
            const allowed = Object.entries(role.permissions.serialize()).filter(([perm, allowed]) => allowed).map(([perm]) => perms[perm]).join('; ');

            message.channel.send({
                embeds: [{
                    color: `#326e2f`,
                    title: `Informations de ${role.name}`,
                    fields: [
                        {
                            name: `↬ Informations temporelle`,
                            value: `> Crée le ${moment(role.createdAt).format('DD/MM/YYYY')} (Il y a **${created}** jours)`
                        },
                        {
                            name: `↬ Informations serveur`,
                            value: `> Mention: ${role}\n> Nom: **${role.name}**\n> Identifiant: \`${role.id}\`\n> Couleur: \`${role.hexColor}\``
                        },
                        {
                            name: `↬ Informations membres`,
                            value: `> Membre ayant le rôle: ${role.members.size}\n> Mentionnable: ${role.mentionable ? '**Oui**' : '**Non**'}`
                        },
                        {
                            name: `↬ Permissions`,
                            value: `${allowed || 'Aucune'}`
                        }
                    ]
                }]
            })
            break;
        }

        case 'EN_en': {
            const x = Date.now() - role.createdAt;
            const created = Math.floor(x / 86400000);

            let perms = {
                "ADMINISTRATOR": "`Administrator`",
                "VIEW_GUILD_INSIGHTS": "`View guild insights`",
                "VIEW_AUDIT_LOG": "`View audit logs`",
                "MANAGE_GUILD": "`Manage guild`",
                "MANAGE_ROLES": "`Manage roles`",
                "MANAGE_CHANNELS": "`Manage channels`",
                "KICK_MEMBERS": "`Kick members`",
                "BAN_MEMBERS": "`Ban members`",
                "CREATE_INSTANT_INVITE": "`Create instant invite`",
                "CHANGE_NICKNAME": "`Change nickname`",
                "MANAGE_NICKNAMES": "`Manage nickname`",
                "MANAGE_EMOJIS": "`Manage emojis`",
                "MANAGE_WEBHOOKS": "`Manage webhooks`",
                "READ_MESSAGES": "`Read messages`",
                "VIEW_CHANNEL": "`View channel`",
                "SEND_MESSAGES": "`Send messages`",
                "SEND_TTS_MESSAGES": "`Send TTS messages`",
                "MANAGE_MESSAGES": "`Manage messages`",
                "EMBED_LINKS": "`Embed links`",
                "ATTACH_FILES": "`Attach files`",
                "READ_MESSAGE_HISTORY": "`Read message history`",
                "MENTION_EVERYONE": "`Mention @everyone & @here`",
                "USE_EXTERNAL_EMOJIS": "`Use external emojis`",
                "ADD_REACTIONS": "`Add reaction`",
                "CONNECT": "`Connect`",
                "SPEAK": "`Speak`",
                "STREAM": "`Stream`",
                "MUTE_MEMBERS": "`Mute members`",
                "DEAFEN_MEMBERS": "`Deafen members`",
                "MOVE_MEMBERS": "`Move members`",
                "USE_VAD": "`Use voice detection`",
                "PRIORITY_SPEAKER": "`Priority speaker`"
            };
            const allowed = Object.entries(role.permissions.serialize()).filter(([perm, allowed]) => allowed).map(([perm]) => perms[perm]).join('; ');

            message.channel.send({
                embeds: [{
                    color: `#326e2f`,
                    title: `Information of ${role.name}`,
                    fields: [
                        {
                            name: `↬ Time information`,
                            value: `> Created at ${moment(role.createdAt).format('DD/MM/YYYY')} (ago **${created}** days)`
                        },
                        {
                            name: `↬ Guild information`,
                            value: `> Mention: ${role}\n> Name: **${role.name}**\n> Identifiant: \`${role.id}\`\n> Color: \`${role.hexColor}\``
                        },
                        {
                            name: `↬ Members information`,
                            value: `> Member with role: ${role.members.size}\n> Mentionable: ${role.mentionable ? '**Yes**' : '**No**'}`
                        },
                        {
                            name: `↬ Permission`,
                            value: `${allowed || 'None'}`
                        }
                    ]
                }]
            })
            break;
        }   
    }

    }
}