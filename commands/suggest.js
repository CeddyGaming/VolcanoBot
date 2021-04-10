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
                description: args,
                footer: {
                    text: "If you find this suggestion to be disrespectful, please report it."
                }
            }
        }
        var suggestionMsg
        client.channels.fetch('822520079462826024').then(function(channel){
            async function beginInput(){
                suggestionMsg = await channel.send(embed)
                setTimeout(() => {
                    suggestionMsg.react('👍')
                    .then(() => suggestionMsg.react('👎'))
                    .catch(() => console.error('One of the emojis failed to react.'));
                }, 2000);
            }
            beginInput()
        })
    }
}