const socket = io(); // instancio socket.io
let user; //Este 'user' será con el que el cliente se identificará para saber quien escribió el mensaje.
const chatBox = document.getElementById('chatBox'); // Obtenemos la referencia del cuadro donde se escribirá, la cual vendrá de index.handlebars.

Swal.fire({
  title: 'Identifícate',
  input: 'text', // Indicamos que el cliente necesita escribir un texto para poder abanzar de esta alerta.
  text: 'Ingresa el nombre de usuario para identificarte en el chat',
  inputValidator: (value) => {
    return (
      !value &&
      '¡Necesitas escribir un nombre de usuario para comenzar a chatear!'
    );
    // Esta validación ocurre si el usuario decide dar en 'continuar' sin haber colocado un nombre de usuario.
  },
  allowOutsideClick: false, //impide que el usuario salga de la alerta al der click fuera de la alerta
}).then((result) => {
  user = result.value;
  //Una vez que el usuario se identifica lo asignamos a la variable user.
  socket.emit('authenticated', user);
});

chatBox.addEventListener('keyup', (evt) => {
  if (evt.key === 'Enter') {
    //Con esta línea se enviará el mensaje cuando el usuario apriete 'Enter' en la caja de chat.
    if (chatBox.value.trim().length > 0) {
      //Corroboramos que el mensaje no esté vacio o solo contenga espacios.
      socket.emit('message', { user: user, message: chatBox.value }); //Emitimos el evento
      chatBox.value = ''; // Vaciar el chatBox
    }
  }
});

// SOCKET LISTENNERS
socket.on('messageLogs', (data) => {
  //Pone al socket a escuchar cuando haya un cambio en mesageLogs y toma la data
  let log = document.getElementById('messageLogs'); // Guarda en la variable log el messageLogs que viene del cliente
  let messages = ''; // Se inicializa la variable messages como una cadena vacía. Esta variable se utilizará para almacenar los mensajes que se mostrarán en el elemento log.
  data.forEach((message) => {
    //se recorre cada elemento del arreglo "data", y se almacena temporalmente ese elemento, el cual representa un mensaje, en la variable message
    messages = messages + `${message.user} dice: ${message.message}</br>`; //A cada mensaje se le concatena el nombre se usuario de dicho mensage, el contenido del mensaje y un salto de linea para separarlo del proximo mensaje.
  });
  log.innerHTML = messages; //Finalmente, se actualiza el contenido del elemento log en el documento HTML con el valor de la variable messages. Esto reemplaza el contenido anterior con los mensajes generados en el paso anterior.
});
socket.on('newUserConnected', (data) => {
  if (!user) return;
  Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    title: `${data} se ha unido al chat`,
    icon: 'success',
  });
});
