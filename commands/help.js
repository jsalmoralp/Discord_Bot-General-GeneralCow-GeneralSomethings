module.exports = {
    name: 'help',
    aliases: ['ayuda', 'h'],
    cooldown: 5,
    description: 'Lista de todos los comandos e información sobre un comando en específico.',
    guildOnly: true,
    args: false,
    usage: '<comando>',
    execute(exp, message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('Lista de Comandos disponibles:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nPuedes ejecutar \`${exp['prefix']} help [command name]\` para obtener información de un comando en especifico!`);

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('Te he enviado un MD con la lista de Comandos!');
                })
                .catch(error => {
                    console.error(`No se pudo enviar un MD a ${message.author.tag}.\n`, error);
                    message.reply('¡Parece que no puedo enviarte un MD! ¿Tiene DM desactivados?');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('ese no es un comando válido!');
        }

        data.push(`**Nombre:** ${command.name}`);

        if (command.aliases) data.push(`**Alias:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Descripción:** ${command.description}`);
        if (command.usage) data.push(`**Uso:** ${exp['prefix']} ${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} segundo(s)`);

        message.channel.send(data, { split: true });
    },
};