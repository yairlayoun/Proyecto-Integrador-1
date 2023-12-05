import express from 'express';
import http from 'http';
import path from 'path';
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import { Server } from "socket.io";
import __dirname from './utils.js';
import { fileURLToPath } from 'url';
import { db } from './config/database.js';

const __filename = fileURLToPath(import.meta.url);

const app = express();
app.use(express.urlencoded({extended:true}))
const port = 8080;

// Creación del servidor HTTP utilizando Server de Socket.IO
const server = http.createServer(app);
const io = new Server(server);

// Configuración del motor de plantillas Handlebars
app.engine('handlebars', handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configuración de la carpeta public
app.use(express.static(__dirname + "/public"));

app.use(express.json());

// Rutas para productos
app.use('/api/products', productsRouter);

// Rutas para carritos
app.use('/api/carts', cartsRouter);

// Rutas para vistas
app.use('/', viewsRouter);

// Lista global de productos
export let products = [];

// Manejo de conexiones de Socket.IO
io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    // Emitir la lista de productos al cliente cuando se conecte
    socket.emit('updateProducts', products);

    socket.on('newProduct', (product) => {
        // Agregar el nuevo producto a la lista
        products.push(product);

        // Emitir la lista actualizada a todos los clientes
        io.emit('updateProducts', products);
    });

    socket.on('deleteProduct', (productId) => {
        // Eliminar el producto de la lista
        products = products.filter((product) => product.id !== productId);

        // Emitir la lista actualizada a todos los clientes
        io.emit('updateProducts', products);
    });
});

// Endpoint para agregar un producto vía HTTP POST
app.post('/api/products', (req, res) => {
    const { name, price } = req.body;

    // Agregar el nuevo producto a la lista
    const newProduct = { id: products.length + 1, name, price };
    products.push(newProduct);

    // Emitir el nuevo producto a través de socket
    io.emit('newProduct', newProduct);

    res.status(201).send('Producto agregado correctamente');
});

// Endpoint para eliminar un producto vía HTTP POST
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;

    // Eliminar el producto de la lista
    products = products.filter((product) => product.id !== parseInt(id));

    // Emitir el ID del producto eliminado a través de socket
    io.emit('deleteProduct', parseInt(id));

    res.status(200).send('Producto eliminado correctamente');
});


app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
