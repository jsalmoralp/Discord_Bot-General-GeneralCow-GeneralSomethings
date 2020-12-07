module.exports = {
    name: 'reload',
    aliases: ['recargar', 'recarga'],
    cooldown: 5,
    description: 'Recarga un comando.',
    guildOnly: true,
    args: false,
    usage: '<comando>',
    execute(exp, message, args) {
        if (!args.length) return message.channel.send(`No has pasado ningún comando que recargar, ${message.author}!`);
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        
        if (!command) return message.channel.send(`No hay ningún comando con nombre o alias \`${commandName}\`, ${message.author}!`);

        delete require.cache[require.resolve(`./${command.name}.js`)];

        try {
            const newCommand = require(`./${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`El comando \`${command.name}\` ha sido recargado!`);
        } catch (error) {
            console.error(error);
            message.channel.send(`Hubo un error al volver a cargar el comando: \`${command.name}\`:\n\`${error.message}\``);
        }
    },
};