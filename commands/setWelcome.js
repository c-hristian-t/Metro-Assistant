const { cache } = require('../welcome');
const mongo = require('../mongo');
const welcomeSchema = require('../schemas/welcome-schema.js');

module.exports = {
    commands: 'setwelcome',
    expectedArgs: '<message>',
    permissionError: 'You need administrator permissions to run this command',
    minArgs: 1,
    maxArgs: null,
    callback: async (message, arguments, text) => {
        const {member, channel, content, guild} = message
        await mongo().then( async (mongoose) => {
            const cache = {}
            cache[guild.id] = [channel.id, text]

            try {  
                await welcomeSchema.findOneAndUpdate({
                    _id: guild.id
                }, {
                    _id: guild.id,
                    channelId: channel.id,
                    text,
                }, {
                    upsert: true
                })
            } finally {
                mongoose.connection.close()
            }
        })
    },
    permissions: ['ADMINISTRATOR'],
}