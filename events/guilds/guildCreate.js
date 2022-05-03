const db = require('quick.db');

module.exports = {
    name: 'guildCreate',
    once: false,
    execute: async (guild, client) => {
        const arr = db.get(`global_settings_${client.user.id}`)
        const bot_settings = db.get(`bot_settings_${client.user.id}`)

        if(guild.id !== bot_settings[3]) {
                    const dmChannel = await client.users.cache.get(bot_settings[2]);
                    switch(arr[0]) {
                        case 'FR_fr': {
                            dmChannel.send({
                                content: `
                                ⛔ > ${client.users.cache.get(bot_settings[2])},
                                Nous avons remarquer une activité suspecte à propos de **${client.user.tag}**. Votre robot à rejoins un sevreur dont l'identifiant n'est pas inscrit dans la base de données du système.
                                C'est pour cela que ${client.user.tag} à directement quitter le serveur.
                                • Vous pouvez utiliser la commande \`transfert <guildID>\` pour changer l'identifiant du serveur inscrit dans la base de données.
                                `
                            })
                            break;
                        }

                        case 'EN_en': {
                            dmChannel.send({
                                content: `
                                ⛔ > ${client.users.cache.get(bot_settings[2])},
                                Nous avons remarquer une activité suspecte à propos de **${client.user.tag}**. Votre robot à rejoins un sevreur dont l'identifiant n'est pas inscrit dans la base de données du système.
                                C'est pour cela que ${client.user.tag} à directement quitter le serveur.
                                • Vous pouvez utiliser la commande \`transfert <guildID>\` pour changer l'identifiant du serveur inscrit dans la base de données.
                                `
                            })
                            break;
                        }
                    }
        }

        guild.invites.fetch().then(guildInvites => {
            client.invites.set(guild.id, new Map(guildInvites.map((invite) => [invite.code, invite.uses])));
        })

    }
}