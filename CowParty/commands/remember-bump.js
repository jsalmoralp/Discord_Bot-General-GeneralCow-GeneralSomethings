module.exports = {
    name: 'remember-bump',
    aliases: ['bumpeo', 'bump'],
    cooldown: 5,
    description: 'Recuerdo del Bump del Servidor.',
    guildOnly: true,
    args: true,
    usage: '<start/stop>',
    execute(exp, message, args) {
        // Comprovación de si el comando/bucle ya se está ejecutando
        if (!exp['estadoBump'].has(message.guild.id,)) {
            exp['estadoBump'].set(message.guild.id, false);
        }

        // Funciones para el bucle
        function enviar1() {
            message.channel.send(`<@&777567490448031784> <@&777567157021704213> <@&778333705282387969> <@&779412975458320395> Se debería hacer un BUMP!!!`);
            if (exp['estadoBump'].get(message.guild.id)){
                setTimeout(() => enviar2(), 2*60*60*1000 + 2*60*1000);
            }
        }
        function enviar2() {
            message.channel.send(`<@&777567490448031784> <@&777567157021704213> <@&778333705282387969> <@&779412975458320395> Se debería hacer un BUMP!!!`);
            if (exp['estadoBump'].get(message.guild.id)) {
                setTimeout(() => enviar1(), 2*60*60*1000 + 2*60*1000);
            }
        }
        
        // Argumento "start"
        if (args[0] == 'start') {
            /*
             * Poner este codigo activo para ver los id's reales de los roles que quieres poner,
             * una vez vistos por consola copiar y pegar en los mensajes de enviar1() y enviar2().
             * 
             * Código:
                const rolesMencionados = message.mentions.roles.get();
                console.log(rolesMencionados);
             */
            
            exp['estadoBump'].set(message.guild.id, true);
            enviar1();
        }

        // Argumento "stop"
        if (args[0] == 'stop') {
            exp['estadoBump'].set(message.guild.id, false);
        }

        // Argumento "status"
        if (args[0] == 'status') {
            const estado = exp['estadoBump'].get(message.guild.id);
            if (estado) {
                return message.channel.send('El AutoBump esta ACTIVADO !!');
            }
            return message.channel.send('El AutoBump esta DESACTIVADO !!');
        }
    },
};