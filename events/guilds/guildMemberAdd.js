const db = require('quick.db');

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    execute: async (member, client) => {        
        const arr = db.get(`global_settings_${client.user.id}`)
        const bot_settings = db.get(`bot_settings_${client.user.id}`)

        if(member.guild.id !== bot_settings[3]) return;

        const logs = db.get(`client_${client.user.id}_logs`)
        if(!logs) return;

        await checkingBlacklist();
        await antiBot();
        //await antiJoin();
        await captchaSystem();

        async function checkingBlacklist() {
            const blacklist = db.get(`client_${client.user.id}_blacklist`)
            if(blacklist) {
                if(arr[0] == 'FR_fr') {
                    if(blacklist.includes(member.user.id)) {
                        await member.ban({ reason: `Blacklist` })
                        const channel = client.channels.cache.get(logs[0])
        
                        return channel.send({
                            embeds: [{
                                color: `RED`,
                                description: `[\`BLACKLIST\`] ${member.user.tag} (\`${member.id}\`) à essayer de rejoindre le serveur.`,
                                author: {
                                    name: `${member.user.tag}`,
                                    icon_url: `${member.user.avatarURL()}`,
                                },
                            }]
                        })
                    }
                } else {
                    if(blacklist.includes(member.id)) {
                        await member.ban({ reason: `Blacklist` })
                        const channel = client.channels.cache.get(logs[0])
        
                        return channel.send({
                            embeds: [{
                                color: `RED`,
                                description: `[\`BLACKLIST\`] ${member.user.tag} (\`${member.id}\`) trying to join the server.`,
                                author: {
                                    name: `${member.user.tag}`,
                                    icon_url: `${member.user.avatarURL()}`,
                                },
                            }]
                        })
                    }
                }
            }
        }

        async function antiBot() {
            const antiBotSettings = db.get(`client_${client.user.id}_security`)
            if(antiBotSettings[6] == 'enable') {
                if(member.user.bot) {
                    if(arr[0] == 'FR_fr') {
                        await member.kick({ reason: `[AUTO-MOD] Anti-Bot activé` })
                        console.log('execute bot')
                    } else {
                        await member.kick({ reason: `[AUTO-MOD] Anti-bot enable` })
                    }  
                }
            }
        }

        async function antiJoin() {
            const antiJoinSettings = db.get(`client_${client.user.id}_security`)
            if(antiJoinSettings[5] == 'FR_fr') {
                await member.kick({ reason: `[ATUO-MOD] Anti-join activé` })
                console.log('execute member')
            } else {
                await member.kick({ reason: `[AUTO-MOD] Anti-join enable` })   
            }
        }

        async function captchaSystem() {
            const captchaSettings = db.get(`captcha_settings_${client.user.id}`)
            if(captchaSettings[0] == 'enable') {
                if(arr[0] == 'FR_fr') {
                    const channel = client.channels.cache.get(captchaSettings[1])
                    function makeid() {
                        var text = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                      
                        for (var i = 0; i < 7; i++)
                          text += possible.charAt(Math.floor(Math.random() * possible.length));
                      
                        return text;
                      }
                      
                      const canvas = Canvas.createCanvas(700, 250);
                      const context = canvas.getContext('2d');
                
                      const background = await Canvas.loadImage('./addons/wallpapers/bg6.png');
                
                      context.drawImage(background, 0, 0, canvas.width, canvas.height);
                      context.strokeStyle = '#0099ff';
                      context.strokeRect(0, 0, canvas.width, canvas.height);
                
                      context.font = '60px Comic Sans';
                      context.fillStyle = '#3d3d3d';
                
                      const text = makeid()
            
                      const x = canvas.width / 2;
                      const align = ["left", "right", "center", "start", "end"]
                      const textAlign = align[Math.floor(align.length * Math.random())]
                      context.textAlign = textAlign
                      context.fillText(`${text}`, x, 85);
                
                      const attachment = new MessageAttachment(canvas.toBuffer(), 'captcha.png');
                
                      channel.send({
                          content: `${member} veuillez saisir le captcha sur l'image ci-dessous pour avoir accès au serveur.`,
                          files: [ attachment ]
                        }).then(async (msg) => {
                            const filter = (m) => m.author.id === member.id;
                            message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                                collected.first().delete()
            
                                const captchaPin = collected.first().content
                                if(captchaPin == `${text}`) {
                                    member.roles.add(captchaSettings[2])
                                    const channel = client.channels.cache.get(logs[0])
                                    return channel.send({
                                        content: `\`[CAPTCHA]\` ${member} (\`${member.id}\`) à compléter le captcha`
                                    })
                                } else {
                                    member.kick({ reason: 'Captcha incorrect.' })
                                    return channel.send({
                                        content: `\`[CAPTCHA]\` ${member} (\`${member.id}\`) n'a pas compléter le captcha`
                                    })
                                }
                            })
                        })
                } else {
                    const channel = client.channels.cache.get(captchaSettings[1])
                    function makeid() {
                        var text = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                      
                        for (var i = 0; i < 7; i++)
                          text += possible.charAt(Math.floor(Math.random() * possible.length));
                      
                        return text;
                      }
                      
                      const canvas = Canvas.createCanvas(700, 250);
                      const context = canvas.getContext('2d');
                
                      const background = await Canvas.loadImage('./addons/wallpapers/bg6.png');
                
                      context.drawImage(background, 0, 0, canvas.width, canvas.height);
                      context.strokeStyle = '#0099ff';
                      context.strokeRect(0, 0, canvas.width, canvas.height);
                
                      context.font = '60px Comic Sans';
                      context.fillStyle = '#3d3d3d';
                
                      const text = makeid()
            
                      const x = canvas.width / 2;
                      const align = ["left", "right", "center", "start", "end"]
                      const textAlign = align[Math.floor(align.length * Math.random())]
                      context.textAlign = textAlign
                      context.fillText(`${text}`, x, 85);
                
                      const attachment = new MessageAttachment(canvas.toBuffer(), 'captcha.png');
                
                      channel.send({
                          content: `${member} please enter the captcha on the image below to access the server.`,
                          files: [ attachment ]
                        }).then(async (msg) => {
                            const filter = (m) => m.author.id === member.id;
                            message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] }).then(async (collected) => {
                                collected.first().delete()
            
                                const captchaPin = collected.first().content
                                if(captchaPin == `${text}`) {
                                    member.roles.add(captchaSettings[2])
                                } else {
                                    member.kick({ reason: 'Captcha invalid.' })
                                }
                            })
                        })
                }
            }
        }

            const welcomeSettings = db.get(`welcome_settings_${client.user.id}`)
            if(welcomeSettings[0] == 'enable') {
                const moment = require('moment');
    
                const created = moment(member.user.createdAt).format('DD/MM/YYYY');
                const joined = moment(member.joinedTimestamp).format('DD/MM/YYYY')
    
                const channel = member.guild.channels.cache.get(welcomeSettings[1])
                if(!channel) return;
                member.guild.invites.fetch().then(newInvites => {
                    
                    const oldInvites = client.invites.get(member.guild.id);
                    const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));
                    if(!invite) return;
                    const inviter = client.users.cache.get(invite.inviter.id); 
                    
                    var variables = {
                        "{username}" : `${member.user.username}`,
                        "{tag}" : `${member.user.discriminator}`,
                        "{user}" : `${member}`,
                        "{id}" : `${member.user.id}`,
                        "{guild}" : `${member.guild.name}`,
                        "{guildId}" : `${member.guild.id}`,
                        "{guildCount}" : `${member.guild.memberCount}`,
                        "{userCreate}" : `${created}`,
                        "{userJoin}" : `${joined}`,
                        "{inviterName}" : `${inviter ? `${inviter.username}` : `<undefined>`}`,
                        "{inviterTag}" : `${inviter ? `${inviter.tag}` : `<undefined>`}`,
                        "{inviter}" : `${inviter ? `${inviter}` : `<undefined>`}`,
                        "{inviterId}" : `${inviter ? `${inviter.id}` : `<undefined>`}`,
                        "{inviterCount}" : `${invite.uses}`,
                    }

                    var new_str = welcomeSettings[2];
    
                    for(var key in variables) {
                        if (!variables.hasOwnProperty(key)) {
                            continue;
                        }
                    
                        new_str = new_str.replace(key, variables[key]);
                    }

                    return channel.send({
                        content: `${new_str}`
                    }).then(async () => {
                        if(member.guild.roles.cache.get(welcomeSettings[3])) {
                            await member.roles.add(welcomeSettings[3])
                                .catch((err) => { return; })
                        }
                    })
                })
    
            }

    }
}