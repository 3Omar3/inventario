class Product {
  constructor(code = "", name = "", price = 0, amount = 0, description = "") {
    this.setCode(code);
    this.setName(name);
    this.setPrice(price);
    this.setAmount(amount);
    this.setDescription(description);
  }

  setCode(code) {
    if (typeof code !== "string")
      throw new Error("codigo necesita ser un string");
    if (code == "" || code.length <= 0) throw new Error("codigo es requerido");
    if (code.length > 12) throw new Error("El codigo es demasiado largo");

    this.code = code;
  }

  setName(name) {
    if (typeof name !== "string")
      throw new Error("nombre necesita ser un string");
    if (name == "" || name.length <= 0) throw new Error("nombre es requerido");
    if (name.length > 50) throw new Error("El nombre es demasiado largo");

    this.name = name;
  }

  setPrice(price = 0) {
    // only integers and decimals are accepted
    if (!/^(([0-9]*[.])?[0-9])+/.test(price) || price < 0 || price > 99999)
      throw new Error("precio invalido");

    this.price = price;
  }

  
  setAmount(amount = 0) {
    // only integers are accepted
    if (!/^([0-9])+/.test(amount) || amount < 0 || amount > 99999)
      throw new Error("cantidad invalida");

    this.amount = amount;
  }

  setDescription(txt = "") {
    if (typeof txt !== "string")
      throw new Error("descripcion necesita ser un string");
    if (txt.length > 350)
      throw new Error("descripcion solo debe contener 350 caracteres");

    this.description = txt;
  }
}

module.exports = Product;
