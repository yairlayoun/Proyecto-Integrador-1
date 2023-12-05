import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://YairLayoun:coderhouse@ecommerce.yldejct.mongodb.net/?retryWrites=true&w=majority', {});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a la base de datos:'));
db.once('open', () => {
  console.log('Conectado a la base de datos');
});

export { mongoose, db };
