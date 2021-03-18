module.exports = {
    name: 'info',
    description: 'Information about the group and the bot.',
    execute(message, args, client){
        var information = {
            color: 0x0099ff,
            title: 'Volcano Restaruant',
            description: `A Japanese/Hawaiian restaurant that specializes in foods from the japanese and hawaiian areas. We encourage our staff to follow traditions from those regions and ensure quality is always served.`,
            fields: [
                {
                    "name": "Roblox group",
                    "value": "https://www.roblox.com/groups/10009360/Volcano-Restaurant-RBLX#!",
                    "inline": true
                },
                {
                    "name": "Roblox group",
                    "value": "https://www.roblox.com/groups/10009360/Volcano-Restaurant-RBLX#!",
                    "inline": true
                },
                {
                    "name": "Roblox group",
                    "value": "https://www.roblox.com/groups/10009360/Volcano-Restaurant-RBLX#!",
                    "inline": true
                },
                {
                    "name": "Roblox group",
                    "value": "https://www.roblox.com/groups/10009360/Volcano-Restaurant-RBLX#!",
                    "inline": true
                },
                {
                    "name": "Roblox group",
                    "value": "https://www.roblox.com/groups/10009360/Volcano-Restaurant-RBLX#!",
                    "inline": true
                },
                {
                    "name": "Roblox group",
                    "value": "https://www.roblox.com/groups/10009360/Volcano-Restaurant-RBLX#!",
                    "inline": true
                },
                {
                    "name": "Roblox group",
                    "value": "https://www.roblox.com/groups/10009360/Volcano-Restaurant-RBLX#!",
                    "inline": true
                }
            ],
        }
        message.channel.send({embed: information})
    }
}