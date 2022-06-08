// prototypes
const Product = require("../schemes/product");
const dbProduct = require("../database/dbProduct");
const productElements = require("../js/productElements");
const alert = require("../js/alert");

// popups
const popups = document.getElementsByClassName("ctn-popup");

// buttons that opens popups
const btnAdd = document.getElementById("btn-add");
const btnStock = document.getElementById("btn-stock");

// table
const tbSearch = document.getElementById("tb-search");
const tbBody = document.getElementById("tb-body");

let tbReload = false; // to know when recharge the table content
let rowSelected = null; // to know what row reload

// Your code to run since DOM is loaded and ready
document.addEventListener("DOMContentLoaded", async () => {
  await loadProducts();
});

// return new node | element html
const createElement = (element = "", ...options) => {
  return (node = Object.assign(document.createElement(element), ...options));
};

// modals
btnAdd.onclick = async () => {
  // show popup stock
  await alert.popupForm({
    title: "Producto",
    form: productElements.add(),
    formHandle: addProduct,
  });
  await loadProducts();
};

btnStock.onclick = async () => {
  // show popup stock
  await alert.popupForm({
    title: "Stock",
    form: productElements.stock(),
    formHandle: stockProduct,
  });
};

// When the user clicks anywhere outside of the modal or the button, close it
for (const popup of popups) {
  popup.onclick = (e) => {
    // container popup or button close
    const srcClass = e.srcElement.className;

    if (srcClass == "ctn-popup" || srcClass == "close-popup") {
      popup.style.display = "none";

      tbReload && loadProducts();
      tbReload = false;
    }
  };
}

// load table with products
const loadProducts = async () => {
  const res = await dbProduct.getProducts(); // get data
  setTable(res);
};

// search in table by code or name
tbSearch.onkeyup = async (e) => {
  try {
    if (e.keyCode !== 13) return;

    const search = tbSearch.value;
    if (!search.length) return loadProducts();

    const res = await dbProduct.searchProduct(tbSearch.value);
    setTable(res[0]);
  } catch (e) {
    alert.toast(e.message, false);
  }
};

// set data to table
const setTable = (data = []) => {
  if (!data.length) return; // validation for empty value

  tbBody.innerHTML = ""; // reset data

  const createSvg = (classSvg = "", href = "") => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", classSvg);
    svg.setAttribute("height", 25);
    svg.setAttribute("width", 25);
    svg.setAttribute("fill", "currentColor");

    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", href);
    svg.appendChild(use);

    return svg;
  };

  data.forEach((p) => {
    const tr = createElement("tr", { id: p.code });

    const tdCode = createElement("td", {
      className: "th-code hide-overflow-text",
      textContent: p.code,
    });

    const tdName = createElement("td", {
      className: "th-name hide-overflow-text",
      textContent: p.name,
    });

    const tdDes = createElement("td", {
      className: "th-des hide-overflow-text",
      textContent: p.description,
    });

    const tdPrice = createElement("td", {
      textContent: p.price.toFixed(2),
    });

    const tdAmount = createElement("td");
    tdAmount.appendChild(
      createElement("div", {
        textContent: p.amount,
        className:
          p.amount > 9
            ? "chip-green"
            : p.amount > 0
            ? "chip-yellow"
            : "chip-red",
      })
    );

    const tdAction = createElement("td", { className: "th-actions" });
    const container = createElement("div", {
      className: "flex-row ctn-actions",
    });

    const svgStock = createSvg(
      "text-gray hover-text-blue",
      "../public/assets/stock.svg#stock"
    );

    const svgEdit = createSvg(
      "text-gray hover-text-orange",
      "../public/assets/edit.svg#edit"
    );

    const svgDelete = createSvg(
      "text-gray hover-text-red",
      "../public/assets/delete.svg#delete"
    );

    container.appendChild(svgStock);
    container.appendChild(svgEdit);
    container.appendChild(svgDelete);
    tdAction.appendChild(container);

    tr.appendChild(tdCode);
    tr.appendChild(tdName);
    tr.appendChild(tdDes);
    tr.appendChild(tdPrice);
    tr.appendChild(tdAmount);
    tr.appendChild(tdAction);
    tbBody.appendChild(tr);
  });

  // set actions
  const actions = document.getElementsByClassName("ctn-actions");

  for (const a of actions) {
    const row = a.parentNode.parentNode;
    a.children[0].addEventListener("click", () => rowStock(row));
    a.children[1].addEventListener("click", () => rowEdit(row));
    a.children[2].addEventListener("click", () => rowDelete(row));
  }
};

// selecciona el tr
tbBody.onclick = (e) => {
  e.target.tagName == "TD" && rowView(e.target.parentNode);
};

// set the data in the form
const setDataForm = async (r, form, formHandle = () => {}) => {
  try {
    const res = await dbProduct.getProduct(r.id); // get data

    rowSelected = r; // set the selected row
    form[0].value = res.code; // code
    form[1].value = res.name; // name
    form[2].value = res.price.toFixed(2); // price
    form[3].value = res.amount; // amount
    form[4].value = res.description; // description

    alert.popupForm({ title: "Producto", form, formHandle });
  } catch (e) {
    alert.toast(e.message, false);
  }
};

// view product
const rowView = async (r) => {
  await setDataForm(r, productElements.body("", "", { readOnly: true }));
};

// edit product
const rowEdit = async (r) => {
  await setDataForm(r, productElements.edit(), editProduct);
};

// delete product
const rowDelete = async (r) => {
  const form = productElements.drop();
  form[0].value = r.children[0].innerText; // set the code to delete product

  await alert.popupForm({
    title: "Eliminar Producto",
    form,
    formHandle: deleteProduct,
  });
};

// stock product
const rowStock = (r) => {
  const form = productElements.stock(); // get the form stock
  form[0].value = r.children[0].innerText; // set code in form stock
  form[0].readOnly = true; // readOnly

  alert.popupForm({ title: "Stock", form: form, formHandle: stockProduct });
};

// reload row
const reloadRow = async (r, p = Product) => {
  try {
    r.id = p.code; // code is used as id
    r.children[0].innerText = p.code; // code
    r.children[1].innerText = p.name; // name
    r.children[2].innerText = p.description; // description
    r.children[3].innerText = parseFloat(p.price).toFixed(2); // price
    r.children[4].innerHTML = `<div class=${
      p.amount > 9 ? "chip-green" : p.amount > 0 ? "chip-yellow" : "chip-red"
    }>
      ${p.amount}
    </div>`; // amount
  } catch (e) {
    alert.toast(e.message, false);
  }
};

// prototype new product
const addProduct = (form = HTMLElement) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const product = new Product(
        form[0].value, // code
        form[1].value, // name
        form[2].value, // value
        form[3].value, // amount
        form[4].value // description
      );

      await dbProduct.insertProduct(product); // register new product
      tbReload = true;
      form.reset();
      alert.toast("Producto agregado");
    } catch (e) {
      e.code === "ER_DUP_ENTRY"
        ? alert.toast("Error codigo registrado", false)
        : alert.toast(e.message, false);
    }
  });
};

// form stock
const stockProduct = (form = HTMLElement) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const data = { code: form[0].value, amount: form[1].value };

      e.submitter.id == "btn-in"
        ? await dbProduct.addAmount(data.code, data.amount)
        : await dbProduct.decrementAmount(data.code, data.amount);

      const row = document.getElementById(data.code); // get the row that wanna by reloaded
      const res = await dbProduct.getProduct(data.code); // get new data of the product
      const product = new Product(
        res.code,
        res.name,
        res.price,
        res.amount,
        res.description
      );

      await reloadRow(row, product); // reload the specific row in the table
      form[0].select(); // select the first input that is code
      form[1].value = ""; // empty code

      alert.toast("Registro realizado"); // alert confirmation
    } catch (e) {
      alert.toast(e.message, false);
    }
  });
};

// from edit
const editProduct = (form = HTMLElement) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const product = new Product(
        form[0].value, // code
        form[1].value, // name
        form[2].value, // value
        form[3].value, // amount
        form[4].value // description
      );

      await dbProduct.updateProduct(product, rowSelected.id);
      reloadRow(rowSelected, product);

      alert.toast("Cambios guardados"); // alert confirmation
    } catch (e) {
      e.code === "ER_DUP_ENTRY"
        ? alert.toast("Error codigo registrado", false)
        : alert.toast(e.message, false);
    }
  });
};

// form delete
const deleteProduct = (form = HTMLElement) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const code = form[0].value;
      await dbProduct.deleteProduct(code); // delete product from db

      const r = document.getElementById(code); // row
      tbBody.removeChild(r); // remove the table(tr)
      alert.toast("Producto eliminado");
    } catch (e) {
      alert.toast(e.message, false);
    }
  });
};
