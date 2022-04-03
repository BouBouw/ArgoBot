const db = require('quick.db');

module.exports = {
    name: 'guildUpdate',
    once: false,
    execute: async (oldGuild, newGuild, client) => {
        const arr = db.get(`global_settings_${client.user.id}`)

        const array = db.get(`client_${client.user.id}_logs`)
        if(!array) return;
        const logs = client.channels.cache.get(array[0])

        const settings = db.get(`client_${client.user.id}_security`)

        const onwerlist = db.get(`client_${client.user.id}_ownerlist`)
        const whitelist = db.get(`client_${client.user.id}_whitelist`)

        const entry = await newGuild.fetchAuditLogs({type: 'guildUpdate'}).then(audit => audit.entries.first())

        if(entry.executor.id === client.user.id) return;
        if(entry.executor.id === newGuild.ownerId) return;

        await guildUpdate(); 

        async function guildUpdate() {
            if(settings[7] == 'enable') {
                switch(arr[0]) {
                    case 'FR_fr': {
                        if(onwerlist.includes(entry.executor.id) && whitelist.includes(entry.executor.id)) {
                            if(oldGuild.name !== newGuild.name) {
                                await newGuild.setName(oldGuild.name).then(async () => {
                                    logs.send({
                                        embeds: [{
                                            color: '#32a88b',
                                            description: `[\`SERVEUR\`] ${entry.executor} (\`${entry.executor.id}\`) vient de changer un paramètre du serveur.`,
                                            author: {
                                                name: `${entry.executor.tag}`,
                                                icon_url: `${entry.executor.avatarURL()}`,
                                            },
                                            fields: [
                                                {
                                                    name: `Paramètre changer:`,
                                                    value: `> Nom du serveur`
                                                }
                                            ] 
                                        }]
                                    })
                                })
                            }
            
                            if(oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
                                await console.log('changement du vanityURL')
                            }
        
                            if(oldGuild.icon !== newGuild.icon) {
                                await newGuild.setIcon(oldGuild.iconURL()).then(async () => {
                                    logs.send({
                                        embeds: [{
                                            color: '#32a88b',
                                            description: `[\`SERVEUR\`] ${entry.executor} (\`${entry.executor.id}\`) vient de changer un paramètre du serveur.`,
                                            author: {
                                                name: `${entry.executor.tag}`,
                                                icon_url: `${entry.executor.avatarURL()}`,
                                            },
                                            fields: [
                                                {
                                                    name: `Paramètre changer:`,
                                                    value: `> Avatar du serveur`
                                                }
                                            ] 
                                        }]
                                    })
                                })
                            }
                        } else {
                            if(oldGuild.name !== newGuild.name) {
                                await newGuild.setName(oldGuild.name).then(async () => {
                                    logs.send({
                                        embeds: [{
                                            color: '#32a88b',
                                            description: `[\`SERVEUR\`] ${entry.executor} (\`${entry.executor.id}\`) vient de changer un paramètre du serveur.`,
                                            author: {
                                                name: `${entry.executor.tag}`,
                                                icon_url: `${entry.executor.avatarURL()}`,
                                            },
                                            fields: [
                                                {
                                                    name: `Paramètre changer:`,
                                                    value: `> Nom du serveur`
                                                },
                                                {
                                                    name: `Sécurité`,
                                                    value: "`✅` Le serveur à correctement été remis à jour."
                                                }
                                            ] 
                                        }]
                                    })
                                })
                                .catch((err) => {
                                    logs.send({
                                        embeds: [{
                                            color: '#32a88b',
                                            description: `[\`SERVEUR\`] ${entry.executor} (\`${entry.executor.id}\`) vient de changer un paramètre du serveur.`,
                                            author: {
                                                name: `${entry.executor.tag}`,
                                                icon_url: `${entry.executor.avatarURL()}`,
                                            },
                                            fields: [
                                                {
                                                    name: `Paramètre changer:`,
                                                    value: `> Nom du serveur`
                                                },
                                                {
                                                    name: `Sécurité`,
                                                    value: "`❌` Le sevreur n'a pas été réinitaliser."
                                                }
                                            ] 
                                        }]
                                    })
                                })
    
                                if(oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
                                    await console.log('changement du vanityURL')
                                }
            
                                if(oldGuild.icon !== newGuild.icon) {
                                    await newGuild.setIcon(oldGuild.iconURL()).then(async () => {
                                        logs.send({
                                            embeds: [{
                                                color: '#32a88b',
                                                description: `[\`SERVEUR\`] ${entry.executor} (\`${entry.executor.id}\`) vient de changer un paramètre du serveur.`,
                                                author: {
                                                    name: `${entry.executor.tag}`,
                                                    icon_url: `${entry.executor.avatarURL()}`,
                                                },
                                                fields: [
                                                    {
                                                        name: `Paramètre changer:`,
                                                        value: `> Avatar du serveur`
                                                    },
                                                    {
                                                        name: `Sécurité`,
                                                        value: "`✅` Le serveur à correctement été remis à jour."
                                                    }
                                                ] 
                                            }]
                                        })
                                    })
                                    .cacth((err) => {
                                        logs.send({
                                            embeds: [{
                                                color: '#32a88b',
                                                description: `[\`SERVEUR\`] ${entry.executor} (\`${entry.executor.id}\`) vient de changer un paramètre du serveur.`,
                                                author: {
                                                    name: `${entry.executor.tag}`,
                                                    icon_url: `${entry.executor.avatarURL()}`,
                                                },
                                                fields: [
                                                    {
                                                        name: `Paramètre changer:`,
                                                        value: `> Avatar du serveur`
                                                    },
                                                    {
                                                        name: `Sécurité`,
                                                        value: "`❌` Le sevreur n'a pas été réinitaliser."
                                                    }
                                                ] 
                                            }]
                                        })
                                    })
                                }
                            }
                        }
                        guildUpdate()
                        break;
                    }
        
                    case 'EN_en': {
                        if(onwerlist.includes(entry.executor.id) && whitelist.includes(entry.executor.id)) {
                            if(oldGuild.name !== newGuild.name) {
                                await newGuild.setName(oldGuild.name).then(async () => {
                                    logs.send({
                                        embeds: [{
                                            color: '#32a88b',
                                            description: `[\`SERVER\`] ${entry.executor} (\`${entry.executor.id}\`) just edited server setting.`,
                                            author: {
                                                name: `${entry.executor.tag}`,
                                                icon_url: `${entry.executor.avatarURL()}`,
                                            },
                                            fields: [
                                                {
                                                    name: `Edit setting:`,
                                                    value: `> Server name`
                                                }
                                            ] 
                                        }]
                                    })
                                })
                            }
            
                            if(oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
                                await console.log('changement du vanityURL')
                            }
        
                            if(oldGuild.icon !== newGuild.icon) {
                                await newGuild.setIcon(oldGuild.iconURL()).then(async () => {
                                    logs.send({
                                        embeds: [{
                                            color: '#32a88b',
                                            description: `[\`SERVER\`] ${entry.executor} (\`${entry.executor.id}\`) just edited server setting.`,
                                            author: {
                                                name: `${entry.executor.tag}`,
                                                icon_url: `${entry.executor.avatarURL()}`,
                                            },
                                            fields: [
                                                {
                                                    name: `Edit setting:`,
                                                    value: `> Server avatar`
                                                }
                                            ] 
                                        }]
                                    })
                                })
                            }
                        } else {
                            if(oldGuild.name !== newGuild.name) {
                                await newGuild.setName(oldGuild.name).then(async () => {
                                    logs.send({
                                        embeds: [{
                                            color: '#32a88b',
                                            description: `[\`SERVER\`] ${entry.executor} (\`${entry.executor.id}\`) just edited server setting.`,
                                            author: {
                                                name: `${entry.executor.tag}`,
                                                icon_url: `${entry.executor.avatarURL()}`,
                                            },
                                            fields: [
                                                {
                                                    name: `Edit setting:`,
                                                    value: `> Server name`
                                                },
                                                {
                                                    name: `Security`,
                                                    value: "`✅` The server has correctly updated."
                                                }
                                            ] 
                                        }]
                                    })
                                })
                                .catch((err) => {
                                    logs.send({
                                        embeds: [{
                                            color: '#32a88b',
                                            description: `[\`SERVER\`] ${entry.executor} (\`${entry.executor.id}\`) just edited server setting.`,
                                            author: {
                                                name: `${entry.executor.tag}`,
                                                icon_url: `${entry.executor.avatarURL()}`,
                                            },
                                            fields: [
                                                {
                                                    name: `Edit setting:`,
                                                    value: `> Server name`
                                                },
                                                {
                                                    name: `Security`,
                                                    value: "`❌` The server has not been reset."
                                                }
                                            ] 
                                        }]
                                    })
                                })
    
                                if(oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
                                    await console.log('changement du vanityURL')
                                }
            
                                if(oldGuild.icon !== newGuild.icon) {
                                    await newGuild.setIcon(oldGuild.iconURL()).then(async () => {
                                        logs.send({
                                            embeds: [{
                                                color: '#32a88b',
                                                description: `[\`SERVER\`] ${entry.executor} (\`${entry.executor.id}\`) just edited server setting.`,
                                                author: {
                                                    name: `${entry.executor.tag}`,
                                                    icon_url: `${entry.executor.avatarURL()}`,
                                                },
                                                fields: [
                                                    {
                                                        name: `Edit setting:`,
                                                        value: `> Server avatar`
                                                    },
                                                    {
                                                        name: `Security`,
                                                        value: "`✅` The server has been updated."
                                                    }
                                                ] 
                                            }]
                                        })
                                    })
                                    .cacth((err) => {
                                        logs.send({
                                            embeds: [{
                                                color: '#32a88b',
                                                description: `[\`SERVER\`] ${entry.executor} (\`${entry.executor.id}\`) just edited server setting.`,
                                                author: {
                                                    name: `${entry.executor.tag}`,
                                                    icon_url: `${entry.executor.avatarURL()}`,
                                                },
                                                fields: [
                                                    {
                                                        name: `Edit setting:`,
                                                        value: `> Server avatar`
                                                    },
                                                    {
                                                        name: `Sécurité`,
                                                        value: "`❌` The server has not been reset."
                                                    }
                                                ] 
                                            }]
                                        })
                                    })
                                }
                            }
                        }
                        guildUpdate();
                        break;
                    }
                } 
            }
        }

    }
}
    