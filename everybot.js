const Discord = require("discord.js");

const config = require("./config");

const client = new Discord.Client();

let chatChannel = '';

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
};

client.on("ready", () => {
	console.clear();
	console.log(`Success: ${client.user.username} is now connected.\nGuilds: ${client.guilds.size}\nChannels: ${client.channels.size}\nUsers: ${client.users.size}\n`);
	client.user.setActivity(`on ${client.guilds.size} servers`);
});

client.on("disconnect", () => {
	console.log(`Terminated`);

	process.exit();
});


client.on("guildCreate", guild => {
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	client.user.setActivity(`on ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	client.user.setActivity(`on ${client.guilds.size} servers`);
});

client.on('guildMemberAdd', member => {
	if (member.guild.id === '415884730953891849') member.guild.channels.find('name', 'welcome').send(`Welcome ${member.user}!`);
});

client.on('guildMemberRemove', member => {
	if (member.guild.id === '415884730953891849') member.guild.channels.find('name', 'welcome').send(`Looks like ${member.user.username} couldn't handle the split. Now they're in the gutter where they belong.`);
});

client.on("message", async message => {
	if (message.author.bot) return;


	let args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	let command = args.shift().toLowerCase();

	if (command === "ping") {
		let m = await message.channel.send(`What do you want me to say? The ping? here yah go! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
		console.log(`Latency is: ${Math.round(client.ping)}ms`);
		let ava = client.guilds.find('name', config.sname).available;
		console.log(`Server available: ${ava}`);
	}

	if (command === "kick") {
		if (!message.guild.member(message.author).hasPermission("KICK_MEMBERS")) return message.reply("You don't have permissions to do that.")
		if (!message.guild.member(client.user).hasPermission("KICK_MEMBERS")) return message.reply("I don't have permissions to do that.")
		let user = message.mentions.users.first();
		let reason = message.content.split(" ").slice(2).join(" ");
		let modlog = client.channels.find("name", "mod-log");

		if (!modlog) return message.reply("There is no mod-log channel.")
		if (message.mentions.users.size < 1) return message.reply("Please define a user to kick");
		if (!reason) return message.reply("Please state a reason for your kick.")
		if (!message.guild.member(user)
			.kickable) return message.reply("I can't kick a user with a higher role than me");

		message.guild.member(user).kick();

		const kickembed = new Discord.RichEmbed()
			.setAuthor(`I kicked ${user.username}`, user.displayAvatarURL)
			.addField("Kick Information", `*Kicked User:* ${user.tag}\n*Moderator:* ${message.author.tag}\n*Reason:* ${reason}`);
		modlog.send({
			embed: kickembed
		})
	};
	if (command === "ban") {
		if (!message.guild.member(message.author).hasPermission("BAN_MEMBERS")) return message.reply("You don't have permissions to do that.")
		if (!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) return message.reply("I don't have permissions to do that.")
		let user = message.mentions.users.first();
		let reason = message.content.split(" ").slice(2).join(" ");
		let modlog = client.channels.find("name", "mod-log");

		if (!modlog) return message.reply("There is no mod-log channel.")
		if (message.mentions.users.size < 1) return message.reply("Please define a user to ban");
		if (!reason) return message.reply("Please state a reason for your ban.")
		if (!message.guild.member(user)
			.bannable) return message.reply("I can't ban a user with a higher role than me");

		message.guild.member(user).ban();

		const banembed = new Discord.RichEmbed()
			.setAuthor(`I banned ${user.username}`, user.displayAvatarURL)
			.addField("Ban Information", `*banned User:* ${user.tag}\n*Moderator:* ${message.author.tag}\n*Reason:* ${reason}`);
		modlog.send({
			embed: banembed
		})
	};
	if (command === "shoo") {
		if (!message.member.roles.some(r => ["Admin", "Staff"].includes(r.name)))
			return message.reply("Sorry, you don't have permissions to use this!");
		client.user.setStatus('invisible');
		message.channel.send("shhh im not watching :wink:");
		let modlog = client.channels.find("name", "mod-log");
		if (!modlog) return message.reply("There is no mod-log channel.")

	}
	if (command === "online") {
		if (!message.member.roles.some(r => ["Admin", "Staff"].includes(r.name)))
			return message.reply("Sorry, you don't have permissions to use this!");
		client.user.setStatus('online');
		message.channel.send("Im back its okay");
		let modlog = client.channels.find("name", "mod-log");
		if (!modlog) return message.reply("There is no mod-log channel.")
	}
	if (command === "idle") {
		if (!message.member.roles.some(r => ["Admin", "Staff"].includes(r.name)))
			return message.reply("Sorry, you don't have permissions to use this!");
		client.user.setStatus('idle');
		message.channel.send("Brb im gonna go wank");
		let modlog = client.channels.find("name", "mod-log");
		if (!modlog) return message.reply("There is no mod-log channel.")

	}
	if (command === "annoy") {
		if (!message.member.roles.some(r => ["Admin", "Staff"].includes(r.name)))
			return message.reply("Sorry, you don't have permissions to use this!");
		client.user.setStatus('dnd');
		message.channel.send("Dont annoy me");
		let modlog = client.channels.find("name", "mod-log");
		if (!modlog) return message.reply("There is no mod-log channel.")

	}
	if (command === "offline") {
		if (!message.member.roles.some(r => ["Owner"].includes(r.name)))
			if (!message.member.roles.some(r => ["Head Dev"].includes(r.name)))
			return message.reply("Sorry, you don't have permissions to use this!");
		await client.user.setStatus('invisible');
		await message.channel.send("But why?");
		client.destroy();
		let modlog = client.channels.find("name", "mod-log");
		if (!modlog) return message.reply("There is no mod-log channel.")

	}

	if (message.content === "oof") {
		message.channel.send("```oof```");
		let modlog = client.channels.find("name", "mod-log");
		if (!modlog) return message.reply("There is no mod-log channel.")

	}
	if (message.content === "lol") {
		message.channel.send("```Im not jesus i dont *lol*```");
		let modlog = client.channels.find("name", "mod-log");
		if (!modlog) return message.reply("There is no mod-log channel.")

	}
	if (message.content === "xD") {
		message.channel.send("```Im not Dean winchester I dont *xD*```");
		let modlog = client.channels.find("name", "mod-log");
		if (!modlog) return message.reply("There is no mod-log channel.")

	}

	if (message.content === "tableflip") {
		message.channel.send("┬─┬ ノ( ゜-゜ノ)");
		message.channel.send("(╯°□°）╯︵ ┻━┻ ")
		let modlog = client.channels.find("name", "mod-log");
		if (!modlog) return message.reply("There is no mod-log channel.")

	}
	if (message.content === "lennyface") {
		message.channel.send("(ಥ ͜ʖಥ)");
		let modlog = client.channels.find("name", "mod-log");
		if (!modlog) return message.reply("There is no mod-log channel.")

	}
	if (message.content === "despacito") {
	message.channel.send("Ay Fonsi DY Oh Oh no, oh no Oh yeah Diridiri, dirididi Daddy Go Sí, sabes que ya llevo un rato mirándote Tengo que bailar contigo hoy (DY) Vi que tu mirada ya estaba llamándome Muéstrame el camino que yo voy (Oh) Tú, tú eres el imán y yo soy el metal Me voy acercando y voy armando el plan Solo con pensarlo se acelera el pulso (Oh yeah) Ya, ya me está gustando más de lo normal Todos mis sentidos van pidiendo más Esto hay que tomarlo sin ningún apuro Despacito Quiero respirar tu cuello despacito Deja que te diga cosas al oído Para que te acuerdes si no estás conmigo Despacito Quiero desnudarte a besos despacito Firmo en las paredes de tu laberinto Y hacer de tu cuerpo todo un manuscrito (sube, sube, sube)(Sube, sube)Quiero ver bailar tu pelo Quiero ser tu ritmo Que le enseñes a mi boca Tus lugares favoritos ");
	message.channel.send("(favoritos, favoritos baby)Déjame sobrepasar tus zonas de peligro Hasta provocar tus gritos Y que olvides tu apellido (Diridiri, dirididi Daddy)Si te pido un beso ven dámelo Yo sé que estás pensándolo Llevo tiempo intentándolo Mami, esto es dando y dándolo Sabes que tu corazón conmigo te hace bom, bom Sabes que esa beba está buscando de mi bom, bom Ven prueba de mi boca para ver cómo te sabe Quiero, quiero, quiero ver cuánto amor a ti te cabe Yo no tengo prisa, yo me quiero dar el viaje Empecemos lento, después salvajePasito a pasito, suave suavecito Nos vamos pegando poquito a poquito Cuando tú me besas con esa destreza Veo que eres malicia con delicadeza Pasito a pasito, ")
	message.channel.send("suave suavecito Nos vamos pegando, poquito a poquito Y es que esa belleza es un rompecabezas Pero pa montarlo aquí tengo la pieza Despacito Quiero respirar tu cuello despacito Deja que te diga cosas al oído Para que te acuerdes si no estás conmigo Despacito Quiero desnudarte a besos despacito Firmo en las paredes de tu laberinto Y hacer de tu cuerpo todo un manuscrito (sube, sube, sube)(Sube, sube)Quiero ver bailar tu pelo Quiero ser tu ritmo Que le enseñes a mi boca Tus lugares favoritos (favoritos, favoritos baby)Déjame sobrepasar tus zonas de peligro Hasta provocar tus gritos Y que olvides tu apellido Despacito Vamos a hacerlo en una playa en Puerto Rico Hasta que las olas griten ¡ay, bendito! Para que mi sello se quede contigo Pasito a pasito, suave suavecito Nos vamos pegando, poquito a poquito Que le enseñes a mi boca Tus lugares favoritos (favoritos, favoritos baby)Pasito a pasito, suave suavecito Nos vamos pegando, poquito a poquito Hasta provocar tus gritos Y que olvides tu apellido (DY)Despacito")
	}
	if (command === "help") {
		if (!args[0]) {
			return message.reply("Who?");
		}
		if (args[0] === "me") {
			message.reply("ping: bot will respond and give you the ping.");
		}
	}
	if (message.content === "why you no work") {
		let m = await message.channel.send("My Creator is a bad dev.");
	}
	if (command === "creator") {
		let m = await message.channel.send("My Creator is Sean Jassenoff");
	}
	if (command === "purge") {

		let deleteCount = parseInt(args[0], 10);

		if (!deleteCount) {
			return message.reply('You didn\'t member to pick a number between 1 and 99. (\`purge \[1-99\]\`)');
		} else if (deleteCount < 1 || deleteCount > 99) {
			return message.reply('You didn\'t member to pick a number between 1 and 99. (\`purge \[1-99\]\`)');
		};

		deleteCount++;

		let fetched = await message.channel.fetchMessages({
			limit: deleteCount
		});
		message.channel.bulkDelete(fetched)
			.catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
		let modlog = client.channels.find("name", "mod-log");
		if (!modlog) return message.reply("There is no mod-log channel.")

	}
	if (command === "say") {
		const sayMessage = args.join(" ");
		message.delete().catch(O_o => {});
		message.channel.send(sayMessage);
		let modlog = client.channels.find("name", "mod-log");
		if (!modlog) return message.reply("There is no mod-log channel.")

	}

	if (command === 'addrole') {
		console.log(args[1]);
        if (!message.member.roles.some(r => ["Admin", "Staff"].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!");
        let user = message.mentions.members.first();
		if (args[2]) args[1] = args.slice(1).join(" ")
		let role = message.member.guild.roles.find('name', args[1]);
		if (message.mentions.members.size < 1) return message.reply("Please define a user for me to role");
		user.addRole(role);
		message.reply(`I have given the role, ${role.name}, to ${user.displayName}`);
	}
	if (command === 'member') {
		let role = message.member.guild.roles.find('name', 'Member');
		message.member.addRole(role);
		message.reply(`I have given the role, ${role.name}, to ${message.member.displayName}`);
	}
});
client.login(config.creds.discord.token);
