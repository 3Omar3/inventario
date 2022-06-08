const { getConnection } = require("../database/connection");

// validation when the code was not found
const validateConsult = (res, msg = "") => {
  if (res == 0) throw new Error(msg);
};

const consult = async (sql, ...data) => {
  try {
    const conn = await getConnection();
    const res = await conn.query(sql, [...data]);
    return res;
  } catch (e) {
    throw e;
  }
};

// get products
const getProducts = async () => {
  const res = await consult("SELECT * FROM products");
  return res;
};

// get product by code
const getProduct = async (code) => {
  const res = await consult("SELECT * FROM products WHERE code = ?", code);
  validateConsult(res[0].length, "Producto no encontrado");
  return res[0];
};

// search product
const searchProduct = async (search) => {
  const res = await consult("CALL `search_products`(?)", search);
  validateConsult(res[0].length, "Sin resultados");
  return res;
};

// insert product
const insertProduct = async (data) => {
  const res = await consult("INSERT INTO product SET ?", data);
  validateConsult(res.affectedRows, "Error al registrar el producto");
};

// update product
const updateProduct = async (data, code) => {
  const res = await consult("UPDATE product SET ? WHERE code = ?", data, code);
  validateConsult(res.affectedRows, "Error al actualizar el producto");
};

// delete product
const deleteProduct = async (code) => {
  const res = await consult("DELETE FROM product WHERE code = ?", code);
  validateConsult(res.affectedRows, "Error al eliminar el producto");
};

// add amount, entry
const addAmount = async (code, amount) => {
  const res = await consult("CALL `add_amount`(?,?)", code, amount);
  validateConsult(res.affectedRows, "Producto no encontrado");
};

// decrement amount, out
const decrementAmount = async (code, amount) => {
  const res = await consult("CALL `decrement_amount`(?,?)", code, amount);
  validateConsult(res.affectedRows, "Producto no encontrado");
};

module.exports = {
  insertProduct,
  deleteProduct,
  updateProduct,
  searchProduct,
  getProduct,
  getProducts,
  addAmount,
  decrementAmount,
};
