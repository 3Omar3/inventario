// return new node | element html
const createElement = (element = "", ...options) => {
  return (node = Object.assign(document.createElement(element), ...options));
};

// return new element svg
const createSvg = (classUse = "", href = "", height = 40, width = 40) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("height", height);
  svg.setAttribute("width", width);
  svg.setAttribute("fill", "currentColor");

  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("class", classUse);
  use.setAttribute("href", href);
  svg.appendChild(use);

  return svg;
};

const toast = (title = "", type = true) => {
  if (document.getElementById("toast") !== null) return;

  // to style the component
  const config = type
    ? {
        toastClass: "toast border-green",
        class: "text-green",
        href: "../public/assets/check.svg#check",
      }
    : {
        toastClass: "toast border-red",
        class: "text-red",
        href: "../public/assets/delete.svg#delete",
      };

  // creation of a new toast
  const toast = createElement("div", {
    className: config.toastClass,
    id: "toast",
  });
  const content = createElement("div", { className: "toast-content" });
  content.appendChild(createSvg(config.class, config.href));

  content.appendChild(
    createElement("span", { className: "text-white-200", textContent: title })
  );

  toast.appendChild(content);
  document.body.insertAdjacentElement("afterbegin", toast);

  setTimeout(() => {
    toast.remove();
  }, 1800);
};

// close methods
const closeEvents = (container = HTMLElement, close = HTMLElement) => {
  return new Promise((resolve) => {
    close.onclick = () => {
      container.remove();
      resolve(true);
    };

    container.onclick = (e) => {
      // container popup or button close
      const target = e.target.className;
      if (target == "ctn-popup" || target == "close-popup") {
        container.remove();
        resolve(true);
      }
    };
  });
};

// creation of a popup with a form
const popupForm = async (
  params = {
    title: "",
    form: HTMLElement,
    formHandle: () => {},
  }
) => {
  const container = createElement("div", { className: "ctn-popup" });
  const popup = createElement("div", { className: "popup" });
  const close = createElement("span", {
    className: "close-popup",
    textContent: "\u00D7",
  });
  const card = createElement("div", {
    className: "card",
  });
  const ctnTitle = createElement("div", { className: "title" });
  ctnTitle.appendChild(createElement("span", { textContent: params.title }));
  const popupBody = createElement("div", { className: "body" });

  popup.appendChild(close);
  popup.appendChild(card);
  card.appendChild(ctnTitle);
  card.appendChild(popupBody);
  popupBody.appendChild(params.form);
  container.appendChild(popup);

  document.body.insertAdjacentElement("afterbegin", container);

  params.formHandle(params.form);
  return await closeEvents(container, close);
};

module.exports = { toast, popupForm };
