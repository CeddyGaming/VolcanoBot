module.exports = {
    name: 'embed',
    description: 'Creates an embed.',
    execute(message, args, client, discord){
        var sentToUser = {
            embed: {
                title: "Volcano Embed Maker (because we want to look good)",
                description: "Using this helps you create an awesome embed thats 10x better than Air Canadia. Please provide if you will be editing a embed by saying 'edit' or creating a new one by saying 'new'",
                footer: {
                    text: "You can always cancel this embed by saying 'cancel'."
                }
            }
        }
        var botMsg
        async function beginInput(){
            botMsg = await message.channel.send(sentToUser)
        }
        beginInput()
        var filter = m => !m.author.bot
        var collector = new discord.MessageCollector(message.channel, filter)
        var page = 1
        var status = 'ok'
        var createdEmbed = {embed: {}}
        var editing = false
        var previousMsgId
        var embedChannel
        collector.on('collect', (eachMsg, col) => {
            if(eachMsg.content.toLowerCase() == 'cancel'){
                status = 'canceled'
                collector.stop();
            }
            switch(page){
                case 1:
                    if(eachMsg.content.toLowerCase() == 'new'){
                        sentToUser.embed.description = '**Please provide a channel to send the message to.**'
                        botMsg.edit(sentToUser)
                        eachMsg.delete()
                        page++
                    } else if(eachMsg.content.toLowerCase() == 'edit'){
                        sentToUser.embed.description = '**Please provide a channel to send the message to.**'
                        botMsg.edit(sentToUser)
                        eachMsg.delete()
                        editing = true
                        page++
                    } else if(eachMsg.content.toLowerCase() == 'no'){
                        eachMsg.delete()
                        status = 'canceled'
                        collector.stop();
                    }
                    break
                case 2:
                    client.channels.fetch(eachMsg.content.replace('<', "").replace('>', "").replace('#', ""))
                        .then(channel => {
                            channel = embedChannel
                            console.log(channel)
                            if(!editing){
                                sentToUser.embed.description = '**Please provide a title.**'
                                botMsg.edit(sentToUser)
                                eachMsg.delete()
                                page++
                            } else if(editing){
                                sentToUser.embed.description = '**Please provide the message ID of the embed we had made. You can do this by enabling Developer Mode in your settings.**'
                                botMsg.edit(sentToUser)
                                eachMsg.delete()
                                page = 5
                            }
                        })
                        .catch(error => {
                            eachMsg.delete()
                            console.log(error)
                            status = 'channelNotFound'
                            collector.stop();
                        })
                    break
                case 3:
                    createdEmbed.embed.title = eachMsg.content
                    sentToUser.embed.footer.text = "You can skip the description by saying 'skip'."
                    sentToUser.embed.description = '**Please provide a description.**'
                    eachMsg.delete()
                    botMsg.edit(sentToUser)
                    page++
                    break
                case 4:
                    if(eachMsg.content.toLowerCase() == 'skip'){
                        eachMsg.delete()
                        status = 'done'
                        collector.stop();
                    } else {
                        createdEmbed.embed.description = eachMsg.content
                        eachMsg.delete()
                        status = 'done'
                        collector.stop();
                    }
                    break
                case 5:
                    //editing msg
                    sentToUser.embed.description = '**Please provide the message ID of the embed we had made. You can do this by enabling Developer Mode in your settings.**'
                    botMsg.edit(sentToUser)
                    eachMsg.delete()
                    editing = true
                    page++

                }
        })
        collector.on('end', collected => {
            if(status == 'canceled'){
                sentToUser = {
                    color: 0xff0033,
                    title: 'Embed Canceled'
                }
                botMsg.edit(sentToUser)
                setTimeout(() => {
                    botMsg.delete()
                }, 5000);
            } else if(status == 'done'){
                //make embed
                embedChannel.send(createdEmbed)
                 sentToUser = {
                    color: 0x00ff00,
                    title: 'Embed Created.'
                }
                botMsg.edit(sentToUser)
                setTimeout(() => {
                    botMsg.delete()
                }, 5000);
            }
        })
        message.delete()
    }
}