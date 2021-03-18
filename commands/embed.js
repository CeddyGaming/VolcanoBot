module.exports = {
    name: 'embed',
    description: 'Creates an embed.',
    execute(message, args, client, Discord){
        var sentToUser = {
            embed: {
                title: "Volcano Embed Maker (because we want to look good)",
                description: "Using this helps you create an awesome embed thats 10x better than Air Canadia. Say 'yes' to get started.",
                footer: {
                    text: "You can always cancel this embed by saying 'cancel'."
                }
            }
        }
    
        var botMsg = message.channel.send(sentToUser)
        var filter = m => !m.author.bot
        var collector = new Discord.MessageCollector(message.channel, filter)
        var page = 1
        var status = 'ok'
        var createdEmbed = {embed: {}}
        collector.on('collect', (eachMsg, col) => {
            if(eachMsg.content.toLowerCase() == 'cancel'){
                status = 'canceled'
                collector.stop();
            }
            switch(page){
                case 1:
                    if(eachMsg.content.toLowerCase() == 'yes'){
                        sentToUser.embed.description = '**Please provide a title.**'
                        console.log(botMsg.editable)
                        page = page + 1
                    } 
                case 2:
                    page = page + 1
                    createdEmbed.embed.title = eachMsg
                    break
                case 3:
                    console.log('3213213123')
                    break
            }
        })
        collector.on('end', collected => {
            if(status == 'canceled'){
                var canceledEmbed = {
                    color: 0xff0033,
                    title: 'Embed Canceled'
                }
                message.channel.send({embed: canceledEmbed})
            } else if(status == 'done'){
                //make embed
            }
        })
    }
}