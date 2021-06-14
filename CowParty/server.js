/*
 * Importaciones
 */
const fs = require('fs');
const Discord = require('discord.js');

const { prefix, token } = require('./config.json');

/*
 * Inicialización
 */
// Instancia del Bot
const client = new Discord.Client();

// Instancias de los Comandos
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

// Instancias de los Cooldowns
const cooldowns = new Discord.Collection();
const estadoBump = new Discord.Collection();

// Exportciones
const exp = new Array();
exp['estadoBump'] = estadoBump;
exp['prefix'] = prefix;

// Cuando el Bot ya está listo
client.once('ready', () => {
    // Mensaje de que el Bot está listo
    console.log('[Info] El Bot "General Cow" está listo!');
});

/*
 * Lectura de Comandos
 */
client.on('message', message => {
    // Evitamos bucles inecesarios
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Leemos el comando introducido
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Comprovación de que el comando existe y está inicializado
    if (!client.commands.has(commandName)) return;
    
    // Obtenemos el comando o sus alias
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    
    // Comprovamos que el Comando no se ejecuta en un MD
    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('No puedo ejecutar este comando en Mensajes Directos!');
    }
    // Comprovamos que el Comando no requiere de Argumentos Extra
    if (command.args && !args.length) {
        let reply = `No has ecrito ningun argumento para el comando ${command.name}, ${message.author}!`;

        if (command.usage) {
            reply += `\nLa manera correcta de usar el comando es: \`${prefix}${command.name} ${command.usage}\``
        }

        return message.channel.send(reply);
    }

    // Comprovación de que el Usuario que ejecuta el Comando no tenga un Cooldown activo
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    // Ejecución segura del Comando
    try {
        console.log(`${message.author.username} con la id (${message.author.id}) ejecuto el comando: ${message.content}`)
        command.execute(exp, message, args);
    } catch (error) {
        console.error(error);
        message.reply('Ha ocurrido un error con el comando: ' + command);
    }

});

// Final del Bot
client.login(token);
