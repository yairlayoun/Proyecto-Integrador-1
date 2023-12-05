import Products from '../../models/product.model.js' // Importar el modelo de Producto definido con Mongoose

// Función para obtener todos los productos desde la base de datos con Mongoose
export const getProducts = async () => {
  try {
    const products = await Products.find(); // Consulta a la base de datos para obtener todos los productos
    return products;
  } catch (error) {
    return [];
  }
};

// Función para obtener un producto por su ID desde la base de datos con Mongoose
export const getProductById = async (productId) => {
  try {
    const products = await Products.findById(productId); // Consulta a la base de datos para obtener un producto por su ID
    return products;
  } catch (error) {
    return null;
  }
};

// Función para agregar un nuevo producto a la base de datos con Mongoose
export const addProduct = async (newProduct) => {
  try {
    const createdProducts = await Products.create(newProduct); // Crear un nuevo producto en la base de datos
    return createdProducts;
  } catch (error) {
    throw new Error('Error al agregar el producto', error);
  }
};

// Función para actualizar un producto por su ID en la base de datos con Mongoose
export const updateProduct = async (productId, updatedProductData) => {
  try {
    const updatedProducts = await Products.findByIdAndUpdate(productId, updatedProductData, { new: true }); // Actualizar un producto en la base de datos
    return updatedProducts;
  } catch (error) {
    throw new Error('Error al actualizar el producto', error);
  }
};

// Función para eliminar un producto por su ID de la base de datos con Mongoose
export const deleteProducts = async (productId) => {
  try {
    const deletedProducts = await Products.findByIdAndDelete(productId); // Eliminar un producto de la base de datos
    return deletedProducts !== null;
  } catch (error) {
    throw new Error('Error al eliminar el producto', error);
  }
};
