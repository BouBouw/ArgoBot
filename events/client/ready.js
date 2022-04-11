const { Collection } = require('discord.js')
var { useState, useEffect } = require('react');
const db = require('quick.db');

module.exports = {
	name: 'ready',
	once: false,
	execute: async (client) => {
		const arr = db.get(`global_settings_${client.user.id}`)
		const bot_settings = db.get(`bot_settings_${client.user.id}`)

		const invites = new Map();

        await synchDatabases();
		await coinsSetup();
		await counterSetup();

		await updateSatut();

		await synchInvites();

		await startWebServer();

		async function synchDatabases() {
			console.log('[!] | Await to synch. all databases'.bold.yellow)

			// ownerlist & whitelist
			const ownerlist = await db.get(`client_${client.user.id}_ownerlist`)
			const whitelist = await db.get(`client_${client.user.id}_whitelist`)
			
			if(!ownerlist) {
				await db.set(`client_${client.user.id}_ownerlist`, [`${bot_settings[2]}`])
			} else {
				if(ownerlist.includes(bot_settings[2])) return;
				await db.push(`client_${client.user.id}_ownerlist`, bot_settings[2])
			}

			if(!whitelist) {
				await db.set(`client_${client.user.id}_whitelist`, [`${bot_settings[2]}`])
			} else {
				if(whitelist.includes(bot_settings[2])) return;
				await db.push(`client_${client.user.id}_whitelist`, bot_settings[2])
			}

			// security
			const security = await db.get(`client_${client.user.id}_security`)

			// Pattern: ['anti-channels', 'anti-roles', 'anti-spam', 'anti-links', 'anti-webhooks', 'anti-joins', 'anti-bots', 'anti-update']
			if(!security) {
				await db.set(`client_${client.user.id}_security`, ['disable', 'disable', 'disable', 'disable', 'disable', 'disable', 'disable', 'disable'])
			}

			// welcome & leave
			const welcomeSettings = await db.get(`welcome_settings_${client.user.id}`)
			const leaveSettings = await db.get(`leave_settings_${client.user.id}`)

			if(!welcomeSettings) {
				await db.set(`welcome_settings_${client.user.id}`, ['disable', 'x', 'x', 'x'])
			}
			if(!leaveSettings) {
				await db.set(`leave_settings_${client.user.id}`, ['disable', 'x', 'x'])
			}

			// modmails
			const modmailsSettings = await db.get(`client_${client.user.id}_modmails`)
			if(!modmailsSettings) {
				await db.set(`client_${client.user.id}_modmails`, ['disable', 'x'])
			}

			// counters
			const counterSettings = await db.get(`client_${client.user.id}_counters`)
			if(!counterSettings) {
				await db.set(`client_${client.user.id}_counters`, ['disable', 'x'])
			}

			// presence
			const presenceSettings = await db.get(`client_${client.user.id}_presence`)
			if(!presenceSettings) {
				await db.set(`client_${client.user.id}_presence`, ['disable', 'x', 'x'])
			}
		}

		async function coinsSetup() {
			setInterval(async () => {
				client.guilds.cache.forEach(async (guild) => {
					if(db.get(`client_${client.user.id}_coins`) == 'enable') {
						let array = db.get(`client_${client.user.id}_coinsSettings`)
						if(!array) {
							array = 1;
						}

						setInterval(async () => {
							const channels = guild.channels.cache.filter(c => c.type === 'GUILD_VOICES');
			
							channels.forEach(async (c) => {
								c.members.forEach(async (m) => {
									if(m.bot) return;
			
									if(m.voice.channel) {
										if(db.fetch(`guild_${guild.id}_users_${m.user.id}_coins`) == null) { db.set(`guild_${guild.id}_users_${m.user.id}_coins`, array[0]) } else { db.add(`guild_${guild.id}_users_${m.user.id}_coins`, array[0]) }
										console.log(`Adding coins to ${m.user.tag}`)
									}
			
									if(m.voice.streaming) {
										db.add(`guild_${guild.id}_users_${m.user.id}_coins`, array[1])
									}
			
									if(m.voice.selfDeaf ||m.voice.selfMute) {
										db.subtract(`guild_${guild.id}_users_${m.user.id}_coins`, array[2])
									}
								})
							})
						   }, 60000)
					}
				})
			}, 60000)
		}

		async function updateSatut() {
			const { Client, Intents } = require('discord.js');
			const bot = new Client({
				intents: Object.keys(Intents.FLAGS),
				partials: ['MESSAGE', 'CHANNEL', 'REACTION']
			})
			bot.login('OTM4NTM5MTAyMTEzMDAxNTQz.Yfrwpw.S0k6BvPY93Tg5o_8sva0T3cMagE')

			bot.on('ready', async () => {
				const bot_settings = db.get(`bot_settings_${client.user.id}`)
				const channel = await bot.channels.cache.get('938538432869842985')

				await channel.send({

					embeds: [{
						color: `#5fff03`,
						description: `[\`🟢\`] Restart in progress of **${client.user.tag}** (\`${client.user.id}\`)`,
						fields: [
							{
								name: `👑 ↬ Owner`,
								value: `> ${client.users.cache.get(bot_settings[2])} (\`${bot_settings[2]}\`)`
							},
							{
								name: `🌐 ↬ Website (Panel)`,
								value: `> http://185.142.53.79:8080/client/${client.user.id}`
							}
						],
						thumbnail: {
							url: `${client.user.avatarURL()}`,
						},
					}]
				}).then(async () => {
					await bot.destroy();
				})
			})
		}

		async function counterSetup() {
			const counterSettings = db.get(`client_${client.user.id}_counters`)
			if(!counterSettings) return;
			if(counterSettings[0] == 'enable') {
				const channel = await client.channels.cache.get(counterSettings[1])
				const guild = await client.guilds.cache.get(bot_settings[3])

				//console.log(guild.members.cache.filter(member => member.user.presence.status === 'online'))
				
				setInterval(async () => {
					switch(arr[0]) {
						case 'FR_fr': {
							const channels = guild.channels.cache.filter(c => c.type === 'GUILD_VOICE')
							channels.forEach(async (c) => {
								const countersText = [
									`↬ Membre(s) - ${guild.members.cache.filter(member => !member.user.bot).size}`,
									`↬ Boost(s) - ${guild.premiumSubscriptionCount}`,
									`↬ En ligne - ${guild.members.cache.filter(m => m.presence?.status === 'online').size}`,
									`↬ En vocal - ${c.members.size}`,
								]

								let text = countersText[Math.floor(countersText.length * Math.random())]
								channel.setName(`${text}`)
							})
							break;
						}
	
						case 'EN_en': {
							const channels = guild.channels.cache.filter(c => c.type === 'GUILD_VOICE')
							channels.forEach(async (c) => {
								const countersText = [
									`↬ Member(s) - ${guild.members.cache.filter(member => !member.user.bot).size}`,
									`↬ Boost(s) - ${guild.premiumSubscriptionCount}`,
									`↬ Online - {x}`,
									`↬ In voice - ${c.members.size}`,
								]
	
								let text = countersText[Math.floor(countersText.length * Math.random())]
								channel.setName(`${text}`)
							})
							break;
						}
					}
				}, 120000)
			}
		}

		async function synchInvites() {
			client.guilds.cache.forEach(async (guild) => {
				const firstInvites = await guild.invites.fetch();
				client.invites.set(guild.id, new Collection(firstInvites.map((invite) => [invite.code, invite.uses])));
			})
		}

		async function startWebServer() {
			const Dashboard = require("../../dashboard/dashboard");
			Dashboard(client)

			const DiscordInformations = require('../../dashboard/App/discord-get');
			DiscordInformations(client)

			console.log(`[!] Starting server web on: http://185.142.53.79:8080/client/${client.user.id}`.bold.yellow)
		}
    }
}