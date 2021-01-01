const mongo = require("./mongo")
const { cache } = require('./commands/setWelcome')
const welcomeSchema = require("./schemas/welcome-schema")

module.exports = (client) => {
    const onJoin = async member => {
        const { guild } = member
        let data = cache[guild.id]
        if(!data) {
            console.log("FETCHING FROM DATABASE")
            await mongo(),then( async mongoose => {
                try {
                    const result = await welcomeSchema.findOne({ _id: guild.id })
                    cache[guild.id] = data = [result.channel.id, result.text]
                } finally {
                    mongoose.connection.close()
                }
            })
        }

        const channelId = data[0]
        const text = data [1]
        const channel = guild.channels.cache.get(channelId)
        channel.send(text)
    }
       
    client.on('guildMemberAdd', member => {
        onJoin(member)
    })
}