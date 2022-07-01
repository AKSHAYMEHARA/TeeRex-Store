async function productList() {
  try {
    const res = await fetch(
      "https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/catalogue.json"
    );
    const data = await res.json();
    return data;
  } catch (error) {
    return null;
  }
}

function injectToDOM(data) {
  const productListDOM = document.getElementById("product-list");
  while (productListDOM.hasChildNodes()) {
    productListDOM.removeChild(productListDOM.firstChild);
  }
  data.forEach((ele) => {
    const div = document.createElement("div");
    div.classList = "col-lg-4 col-md-6 my-2 ";
    div.innerHTML = `
            <div class="card">
              <img src="${ele.imageURL}" class="card-img-top" alt="${ele.name}" />
              <div class="card-body">
                <h5 class="card-title">${ele.name}</h5>
                <div class="d-flex justify-content-between align-items-baseline w-100 px-1">
                  <p class="card-text fw-semibold">Rs ${ele.price}</p>
                  <button type="button" class="btn btn-dark" onclick="addToCart(${ele.id})">Add To Cart</button>
                </div>
              </div>
            </div>
  `;
    productListDOM.appendChild(div);
  });
}

function filterMenu(data) {
  const color = [...new Set(data.map((x) => x.color))];
  const gender = [...new Set(data.map((x) => x.gender))];
  const price = [...new Set(data.map((x) => x.price))];
  const type = [...new Set(data.map((x) => x.type))];
  const allFilters = [color, gender, price, type];

  allFilters.forEach((element, ind) => {
    element.forEach((attrib) => {
      const ele = document.createElement("div");
      ele.classList = "col-lg-12";
      ele.innerHTML = ` 
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" onchange=${checkMapping(
                          ind
                        )} value="${attrib}" id="${attrib}">
                        <label class="form-check-label" for="${attrib}">
                          ${attrib}
                        </label>
                      </div>
                      `;
      document.querySelectorAll(".filter-attribute")[ind].append(ele);
    });
  });
}

function checkMapping(index) {
  switch (index) {
    case 0:
      return "checkColor(this)";
    case 1:
      return "checkGender(this)";
    case 2:
      return "checkPrice(this)";
    case 3:
      return "checkType(this)";
    default:
      break;
  }
}

function applyFilter(list, name, keyword) {
  let filteredList = [];
  if (keyword === "color") {
    name.map((ele) => {
      list.map((key) => {
        if (key.color === ele) {
          filteredList.push(key);
        }
      });
    });
  } else if (keyword === "gender") {
    name.map((ele) => {
      list.map((key) => {
        if (key.gender === ele) {
          filteredList.push(key);
        }
      });
    });
  } else if (keyword === "type") {
    name.map((ele) => {
      list.map((key) => {
        if (key.type === ele) {
          filteredList.push(key);
        }
      });
    });
  } else {
    name.map((ele) => {
      list.map((key) => {
        if (key.price === parseFloat(ele)) {
          filteredList.push(key);
        }
      });
    });
  }
  return filteredList;
}

function filterFunction(list, filters) {
  let filteredList = [];
  let newList = list;

  for (let i in filters) {
    if (filters[i].length > 0) {
      filteredList = applyFilter(newList, filters[i], i);
      newList = filteredList;
    } else {
      filteredList = newList;
    }
  }
  return filteredList;
}

function saveFiltersToLocalStorage(filters) {
  localStorage.setItem("filters", JSON.stringify(filters));
}
function getFiltersFromLocalStorage() {
  var data = JSON.parse(localStorage.getItem("filters"));
  if (data != undefined) {
    return data;
  } else {
    return null;
  }
}
function getCartItemsFromLocalStorage() {
  var data = JSON.parse(localStorage.getItem("cartItems"));
  if (data != undefined) {
    return data;
  } else {
    return null;
  }
}

function checkedStatus() {
  var data = JSON.parse(localStorage.getItem("filters"));
  if (data != undefined) {
    for (let i in data) {
      if (data[i].length > 0) {
        data[i].forEach((ele) => {
          document.getElementById(`${ele}`).checked = true;
        });
      }
    }
  }
}

function cartItemPageDom(list) {
  const cartItemDOM = document.getElementById("item-list");
  while (cartItemDOM.hasChildNodes()) {
    cartItemDOM.removeChild(cartItemDOM.firstChild);
  }
  list.forEach((ele) => {
    const div = document.createElement("div");
    div.classList = "row cart-item";
    div.innerHTML = `
                      <div class="col-lg-2 col-md-2">
                        <img src="${ele.imageURL}" class="rounded float-start img-fluid" alt="${ele.name}">
                      </div>
                      <div class="col-lg-3 col-md-3 col-4">
                        <p class="h5">${ele.name}</p>
                        <p class="h6">Rs ${ele.price}</p>
                      </div>
                      <div class="col-lg-2 col-md-2 col-4">
                        <select class="form-select" id="${ele.id}" onchange="subTotal()">
                        </select>
                      </div>
                      <div class="col-lg-2 col-md-2 col-4">
                        <button type="button" class="btn btn-outline-dark" onclick="removeFromCart(${ele.id})">Delete</button>
                      </div>
                    `;
    cartItemDOM.appendChild(div);
    quantitySelect(ele.quantity, ele.id);
  });
}

function quantitySelect(total, id) {
  const quantityArray = [...Array(total).keys()];
  const rec_mode = document.getElementById(id);
  quantityArray.forEach(
    (qty) =>
      (rec_mode.innerHTML += `<option value="${qty + 1}">${qty + 1}</option>`)
  );
}

function alertFunction(message, type) {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");

  const alert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  alert(message, type);
}

export {
  productList,
  filterMenu,
  injectToDOM,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  getCartItemsFromLocalStorage,
  checkedStatus,
  cartItemPageDom,
  alertFunction,
};
