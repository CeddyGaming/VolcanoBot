module.exports = {
    name: 'reactionrole',
    description: 'Creates a reaction role embed.',
    execute(message, args, client){
        if(!message.member.hasPermission('ADMINISTRATOR')) return;
        var sentToUser = {
            embed: {
                title: "Volcano Reaction Role Embed Creator",
                description: "I'm did this command at like 3 AM so expect it not to work. Also, I don't believe Air Canada has this so, har har Air Canada. So first, either say new or the message ID of the old embed to get us started.",
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
        var filter = m => m.author.id == message.author.id
        var collector = message.channel.createMessageCollector(filter, {time: 60000})
        var page = 0
        var status = 'timeout'
        var createdEmbed = {embed: {}}
        var editing = false
        var previousMsgId
        var embedChannel
        var emojiToRoleObject = {}
        collector.on('collect', (eachMsg, col) => {
            switch(page){
                case 0:
                    //We now have their option, lets go for the new one first.
                    if(eachMsg.content.toLowerCase() == 'new'){
                        sentToUser.embed.description = '**Please provide a channel to send the message to.**'
                        botMsg.edit(sentToUser)
                        eachMsg.delete()
                        page++
                    } else if(eachMsg.content.toLowerCase() == 'no'){
                        eachMsg.delete()
                        status = 'canceled'
                        collector.stop();
                    } else {
                        sentToUser.embed.description = '**Please provide a channel of the previous message. (gotta check if it exisits bub).**'
                        botMsg.edit(sentToUser)
                        eachMsg.delete()
                        editing = true
                        previousMsgId = eachMsg.content.toLowerCase()
                        page++
                    }
                    break
                case 1:
                    //great now we got a channel woo....
                    client.channels.fetch(eachMsg.content.replace('<', "").replace('>', "").replace('#', ""))
                        .then(channel => {
                            embedChannel = channel
                            if(!editing){
                                sentToUser.embed.description = '**Please provide a title.**'
                                botMsg.edit(sentToUser)
                                eachMsg.delete()
                                page++
                            } else if(editing){
                                channel.messages.fetch(previousMsgId)
                                .then(msg => {
                                    sentToUser.embed.description = '**Please provide a title.**'
                                    botMsg.edit(sentToUser)
                                    eachMsg.delete()
                                    page++
                                })
                                .catch(error => {
                                    eachMsg.delete()
                                    console.log(error)
                                    status = 'messageNotFound'
                                    collector.stop();
                                })
                            }
                        })
                        .catch(error => {
                            eachMsg.delete()
                            console.log(error)
                            status = 'channelNotFound'
                            collector.stop();
                        })
                        break
                    case 2:
                        createdEmbed.embed.title = eachMsg.content
                        sentToUser.embed.footer.text = "You can skip the description by saying 'skip'."
                        sentToUser.embed.description = '**Please provide a description.**'
                        eachMsg.delete()
                        botMsg.edit(sentToUser)
                        page++
                        break
                    case 3:
                        if(eachMsg.content.toLowerCase() == 'skip'){
                            sentToUser.embed.description = '**Please provide a footer image.**'
                            eachMsg.delete()
                            botMsg.edit(sentToUser)
                            page++
                        } else {
                            createdEmbed.embed.description = eachMsg.content
                            sentToUser.embed.description = '**Please provide a footer image.**'
                            eachMsg.delete()
                            botMsg.edit(sentToUser)
                            page++
                        }
                        break
                    case 4: 
                        if(eachMsg.content.toLowerCase() == 'skip'){
                            sentToUser.embed.description = '**Now is the hard part, and that is to create the roles. This took way to long to code btw, but hope sure it works. here is the exact format you need to put this in for it to work. `:Emoji: @Role` Once you are complete, say done.**'
                            eachMsg.delete()
                            botMsg.edit(sentToUser)
                            page++
                        } else {
                            createdEmbed.embed.image = {url: eachMsg.content}
                            sentToUser.embed.description = '**Now is the hard part, and that is to create the roles. This took way to long to code btw, but hope sure it works. here is the exact format you need to put this in for it to work. `:Emoji: @Role` Once you are complete, say done.**'
                            eachMsg.delete()
                            botMsg.edit(sentToUser)
                            page++
                        }
                        break
                    case 5:
                        if(eachMsg.content.toLowerCase() != 'done'){
                            var splitMessage = eachMsg.content.split(' ')
                            emojiToRoleObject[splitMessage[0]]= splitMessage[1]
                            eachMsg.delete()
                        } else {
                            eachMsg.delete()
                             status = 'done'
                            collector.stop()
                        }

            }
        })
        const handleReaction = (reaction, user, add) => {
            if(user.id == '821763301503139891') return;
            console.log(emojiToRoleObject)
            if(emojiToRoleObject[reaction._emoji.name]){
                const { guild } = reaction.message
                const role = guild.roles.fetch(emojiToRoleObject[reaction._emoji.name].replace('<@&', '').replace('>', ''))
                const member = guild.members.cache.find((member) => member.id == user.id)
                if(add){
                    role.then(function(brr){
                        member.roles.add(brr)
                    })
                } else {
                    role.then(function(brr){
                        member.roles.remove(brr)
                    })
                }
            }
        }
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
                if(!editing){
                    async function createEmbedMessage(){
                        createdEmbed = await embedChannel.send(createdEmbed)
                    }
                    createEmbedMessage()
                    
                    for(const emoji in emojiToRoleObject){
                        setTimeout(() => {
                            createdEmbed.react(emoji)
                            if(emoji.includes(':')){
                                var edfds = emoji.replace('<', '').replace('>', '').split(':')
                                emojiToRoleObject[edfds[1]] = emojiToRoleObject[emoji]
                                delete emojiToRoleObject[emoji]
                            }
                        }, 5000);
                    }
                    
                    client.on('messageReactionAdd', (reaction, user) => {
                        if(reaction.message.channel.id == embedChannel.id){
                            handleReaction(reaction, user, true)
                        }
                    })
                    client.on('messageReactionRemove', (reaction, user) => {
                        if(reaction.message.channel.id == embedChannel.id){
                            handleReaction(reaction, user, false)
                        }
                    })
                    sentToUser = {
                        color: 0x00ff00,
                        title: 'Embed Created.'
                    }
                    botMsg.edit(sentToUser)
                    setTimeout(() => {
                        botMsg.delete()
                    }, 5000);
                } else {
                    embedChannel.messages.fetch(previousMsgId)
                    .then(msg => {
                        msg.edit(createdEmbed)
                        sentToUser = {
                            color: 0x00ff00,
                            title: 'Embed Edited.'
                        }
                        botMsg.edit(sentToUser)
                        setTimeout(() => {
                            botMsg.delete()
                        }, 5000);
                    })
                }   
            } else if(status == 'channelNotFound'){
                sentToUser = {
                    color: 0xff0033,
                    title: 'Error: Channel not found.'
                }
                botMsg.edit(sentToUser)
                setTimeout(() => {
                    botMsg.delete()
                }, 5000);
            } else if(status == 'messageNotFound'){
                sentToUser = {
                    color: 0xff0033,
                    title: 'Error: Message not found.'
                }
                botMsg.edit(sentToUser)
                setTimeout(() => {
                    botMsg.delete()
                }, 5000);
            }
        })
    }
}