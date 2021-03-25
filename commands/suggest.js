module.exports = {
    name: 'suggest',
    description: 'Suggests a new thing for Volcano.',
    execute(message, args, client){
        if(!args.length) return
        console.log(message.author.avatarURL)
        var embed = {
            embed: {
                color: 0xff0033,
                author:{
                    name: message.author.username,
                    icon_url: message.author.avatarURL
                },
                title: "Volcano Suggestion",
                description: args[0],
                footer: {
                    text: "If you find this suggestion to be disrespectful, please report it."
                }
            }
        }

        client.channels.fetch('822520079462826024').then(channel => {
            var suggestionMsg
            async function beginInput(){
                suggestionMsg = await channel.send(embed)
            }
            beginInput()
            console.log(channel)
            suggestionMsg.react('👍')
            .then(() => suggestionMsg.react('👎'))
            .then(() => suggestionMsg.react('❗'))
            .catch(() => console.error('One of the emojis failed to react.'));
        })
    }
}