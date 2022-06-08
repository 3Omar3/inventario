// return new node | element html
const createElement = (element = "", ...options) => {
  return (node = Object.assign(document.createElement(element), ...options));
};

// creates a container to show the name and input
const containerInput = (title = "", input = HTMLElement) => {
  const container = createElement("div", { className: "ctn-input" }); // container
  container.appendChild(createElement("span", { textContent: title })); // span title
  container.appendChild(input); // input
  return container;
};

// inputs elements
const inputCode = (params) => {
  return createElement("input", {
    type: "text",
    name: "txtCode",
    minLength: 1,
    maxLength: 12,
    autofocus: true,
    required: true,
    ...params,
  });
};

const inputName = (params) => {
  return createElement("input", {
    type: "text",
    name: "txtName",
    minLength: 1,
    maxLength: 50,
    required: true,
    ...params,
  });
};

const inputPrice = (params) => {
  return createElement("input", {
    type: "number",
    name: "txtPrice",
    step: 0.01,
    min: 0,
    required: true,
    ...params,
  });
};

const inputAmount = (params) => {
  return createElement("input", {
    type: "number",
    name: "txtAmount",
    min: 0,
    max: "99999",
    required: true,
    ...params,
  });
};

const textDes = (params) => {
  return createElement("textarea", {
    name: "txtDes",
    className: "txtArea",
    maxLength: 350,
    ...params,
  });
};

const body = (formClass = "", formId = "", inputs) => {
  const form = createElement("form", { className: formClass, id: formId });
  const container = createElement("div", { className: "ctn-input-grid" });

  container.appendChild(containerInput("Codigo", inputCode(inputs)));
  container.appendChild(containerInput("Nombre", inputName(inputs)));
  container.appendChild(containerInput("Precio", inputPrice(inputs)));
  container.appendChild(containerInput("Cantidad", inputAmount(inputs)));
  form.appendChild(container);
  form.appendChild(containerInput("Descripcion", textDes(inputs)));

  return form;
};

const stock = () => {
  const form = createElement("form", {
    className: "formStock",
    id: "formStock",
  });

  form.appendChild(containerInput("Codigo", inputCode()));
  form.appendChild(containerInput("Cantidad", inputAmount()));
  const buttons = createElement("div", { className: "flex-row" });
  buttons.appendChild(
    createElement("button", {
      className: "btn popup-btn bg-black hover-blue",
      type: "submit",
      id: "btn-in",
      textContent: "Entrada",
    })
  );
  buttons.appendChild(
    createElement("button", {
      className: "btn popup-btn bg-black hover-orange",
      type: "submit",
      id: "btn-out",
      textContent: "Salida",
    })
  );

  form.appendChild(buttons);
  return form;
};

const add = () => {
  const form = body("formRegistro", "formRegistro");
  const button = createElement("button", {
    className: "btn popup-btn bg-black hover-green",
    type: "submit",
    textContent: "Confirmar",
  });
  form.appendChild(button);

  return form;
};

const edit = () => {
  const form = body("formEdit", "formEdit");
  const button = createElement("button", {
    className: "btn popup-btn bg-black hover-orange",
    type: "submit",
    textContent: "Guardar",
  });
  form.appendChild(button);

  return form;
};

const drop = () => {
  const form = createElement("form", {
    className: "formDelete",
    id: "formDelete",
  });

  form.appendChild(containerInput("Codigo", inputCode()));
  form.appendChild(
    createElement("button", {
      className: "btn popup-btn bg-black hover-red",
      type: "submit",
      id: "btn-delete",
      textContent: "Confirmar",
    })
  );

  return form;
};

module.exports = { body, add, edit, drop, stock };
