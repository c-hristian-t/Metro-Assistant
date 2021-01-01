/*
    Copyright (C) 2019
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const path = require('path');
const fs = require('fs');
const Discord = require ("discord.js");
const client = new Discord.Client();
const col = require("colors");
const config = require("./config.json");
const mongo = require('./mongo');
let prefix = config.prefix;

console.log("Process started, current time: " + new Date().toString());

client.on('ready', async () => {
    console.log(`logged in as ${client.user.tag}`.green);

    await mongo().then(mongoose => {
        try {
            console.log('connected to mongo');
        } finally {
            mongoose.connection.close();
        }
    })

    const baseFile = 'command-base.js'
    const commandBase = require(`./commands/${baseFile}`)

    const readCommands = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir));
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file));
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file));
            } else if (file !== baseFile) {
                const option = require(path.join(__dirname, dir, file));
                commandBase(client, option)
            }
        }
    }
    readCommands('commands')
});

client.login(config.token).catch(function() {
    console.log('login failed');
    process.exit(0);
});