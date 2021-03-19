module.exports = {
    name: 'ping',
    description: 'Pong!',
    execute(message, args){
        var ping = {
            color: 0x0099ff,
            title: 'Pong!',
            description: `Took ${Math.floor(message.createdTimestamp - Date.now()) % 1000}ms.`
        }
        message.channel.senfd({embed: ping})
    }
}