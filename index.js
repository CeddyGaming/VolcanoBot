//Constants
const Discord = require('discord.js')
const fs = require('fs')
const { description } = require('./commands/embed')
const {prefix, token} = require('./config.json')

//Initalize
const client = new Discord.Client()
client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

//Events
client.on('ready', () => {
    console.log(`Client logged in as ${client.user}`)
})

client.on('message', (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.channel.send({
            embed: {
                title: "Haha, looks like Cedric made a mistake in his code again.",
                description: "Don't worry, it's all good. He has already been notified and will probably take about 2-3 business years to fix the problem.",
                footer:{
                    text: 'DM @CedricT.#2006 if the issue persists.',
                    icon_url: "https://cdn.discordapp.com/avatars/215430126677131264/b36bb5d86e559040374110f6c2942912.png?size=128"
                }
            }
        })
    }
})

client.login(token)