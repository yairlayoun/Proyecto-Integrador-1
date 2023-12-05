import Cart from '../../models/carts.model.js'; // Importar el modelo de Carrito definido con Mongoose

// Función para obtener todos los carritos desde la base de datos con Mongoose
export const getCarts = async () => {
  try {
    const carts = await Cart.find(); // Consulta a la base de datos para obtener todos los carritos
    return carts;
  } catch (error) {
    return [];
  }
};

// Función para obtener un carrito por su ID desde la base de datos con Mongoose
export const getCartById = async (cartId) => {
  try {
    const cart = await Cart.findById(cartId); // Consulta a la base de datos para obtener un carrito por su ID
    return cart;
  } catch (error) {
    return null;
  }
};

// Función para crear un nuevo carrito en la base de datos con Mongoose
export const createCart = async () => {
  try {
    const newCart = await Cart.create({ products: [] }); // Crear un nuevo carrito en la base de datos
    return newCart;
  } catch (error) {
    throw new Error('Error al crear el carrito', error);
  }
};

// Función para agregar un producto a un carrito en la base de datos con Mongoose
export const addProductToCart = async (cartId, productId, quantity) => {
  try {
    const cart = await Cart.findById(cartId); // Encontrar el carrito por su ID
    if (!cart) {
      return false;
    }

    const existingProduct = cart.products.find((item) => item.productId == productId);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await cart.save(); // Guardar el carrito actualizado en la base de datos
    return true;
  } catch (error) {
    throw new Error('Error al agregar producto al carrito', error);
  }
};
