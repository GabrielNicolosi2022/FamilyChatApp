// Importaciones
import express from 'express';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import __dirname from './utils.js';

// Configuración de Server
const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log(`Listen on port ${PORT}`));

const io = new Server(server);

// Configutración de Plantillas
app.engine('handlebars', engine()); //creo instancia de engine
app.set('views', __dirname + '/views'); //seteo en dónde van a estar la vistas
app.set('view engine', 'handlebars'); //configuro handlebars como motor de vistas
/* Le decimos que nuestros views engines van a tener como extensión de archivo '.handlebars' */

app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use('/', viewsRouter);

let messages = []; //Los mensajes se elmacenaran aqui

io.on('connection', (socket) => {
  console.log('Socket connected');
  socket.on('message', (data) => {
    //Nótese cómo escucha el evento con el mismo nombre que el emit del cliente: 'message'
    messages.push(data); //Guardamos el objeto (data) en la base (let messages)
    io.emit('messageLogs', messages); //Reenviamos instantáneamente los logs actualizados.
    // (Nótese que el evento "messageLogs" no está programado del lado del cliente, lo agregamos mas adelante)
  });
  socket.on('authenticated', (data) => {
    socket.broadcast.emit('newUserConnected', data);
  });
});
