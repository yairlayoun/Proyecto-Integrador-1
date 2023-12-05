import Messages from ('../../dao/models/messages.model.js')
import socket from io();
let user;
let chatBox = document.getElementById('chatBox');

// Ruta para renderizar chat.handlebars bajo la dirección api/chat
app.get('/api/chat', (req, res) => {
    res.render('chat'); // Renderizar la vista chat.handlebars
});

socket.on('messagesLogs', data => {
    let log = document.getElementById('messagesLogs');
    let messages = "";
    data.forEach(message => {
        messages = `${messages} ${message.user} dice: ${messages.messages} </br>`;
    });
    log.innerHTML = messages;
});

socket.on("userConnected", function (username) {
    Swal.fire({
        text: `${username} se ha unido al chat`,
        toast: true,
        position: 'top-right'
    });
});

socket.on('messages', async (data) => {
	try {
		const newMessages = new Messages({
			user: data.user,
			messages: data.messages
		});
		await newMessages.save(); // Guardar el mensaje en la base de datos usando Mongoose
		io.emit('messages', { user: data.user, messages: data.messages }); // Enviar el mensaje a todos los clientes
	} catch (error) {
		console.error('Error al guardar el mensaje:', error);
	}
});


Swal.fire({
    title: 'Identifícate',
    input: 'text',
    text: 'Ingresa tu nombre de usuario para identificarte en el chat',
    inputValidator: (value) => {
        if (!value) {
            return 'Debes ingresar tu nombre de usuario para continuar';
        }
    },
    allowOutsideClick: false,
}).then((result) => {
    user = result.value;
    socket.emit('auth', user);
});

chatBox.addEventListener('keyup', evt => {
    if (evt.key === 'Enter') {
        if (chatBox.value.trim().length > 0) {
            socket.emit('messages', { user: user, messages: chatBox.value });
            chatBox.value = '';
        }
    }
});

// Modificar la lógica de los eventos en el lado del servidor (index.js)
// Deberás ajustar el código del lado del servidor para manejar correctamente estos eventos y guardar los mensajes en la base de datos.
