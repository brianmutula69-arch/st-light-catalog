/* ==========================================================
   ST LIGHT Digital Catalogue
   Version 1.0
   Author: ST LIGHT

   Part 1
   - Load catalog.json
   - Render categories
   - Render products
   ========================================================== */

const categoryContainer = document.getElementById("categories");
const searchInput = document.getElementById("searchInput");

const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const closeModal = document.getElementById("closeModal");

let catalog = [];
let currentCategory = null;
let currentProduct = null;

/* ===============================
   Initialize
================================ */

document.addEventListener("DOMContentLoaded", init);

async function init() {

    try {

        const response = await fetch("catalog.json");

        if (!response.ok)
            throw new Error("Unable to load catalog.");

        const data = await response.json();

        catalog = data.categories;

        renderCategories();

    }

    catch (error) {

        categoryContainer.innerHTML = `
            <div style="
                background:white;
                padding:40px;
                border-radius:18px;
                text-align:center;">
                <h2>Unable to load catalogue.</h2>
                <p>Please check catalog.json</p>
            </div>
        `;

        console.error(error);

    }

}

/* ===============================
   Render Categories
================================ */

function renderCategories() {

    categoryContainer.innerHTML = "";

    catalog.forEach(category => {

        const card = document.createElement("div");

        card.className = "category";

        card.innerHTML = `

            <img src="${category.image}"
                 alt="${category.name}">

            <div class="category-info">

                <h2>${category.icon} ${category.name}</h2>

                <p>

                ${category.items.length} Products

                </p>

            </div>

        `;

        card.addEventListener("click", () => {

            renderProducts(category);

        });

        categoryContainer.appendChild(card);

    });

}

/* ===============================
   Render Products
================================ */

function renderProducts(category) {

    currentCategory = category;

    categoryContainer.innerHTML = "";

    const title = document.createElement("h1");

    title.textContent = category.name;

    title.style.marginBottom = "30px";

    categoryContainer.appendChild(title);

    const grid = document.createElement("div");

    grid.className = "products";

    category.items.forEach(product => {

        const card = document.createElement("div");

        card.className = "product";

        card.innerHTML = `

            <img src="${product.image}"
                 alt="${product.name}">

            <h3>

            ${product.name}

            </h3>

        `;

        card.addEventListener("click", () => {

            openProduct(product);

        });

        grid.appendChild(card);

    });

    categoryContainer.appendChild(grid);

}

/* ===============================
   Product Viewer
================================ */

function openProduct(product) {

    currentProduct = product;

    modalImage.src = product.image;

    modalTitle.textContent = product.name;

    imageModal.style.display = "flex";

}

/* ===============================
   Close Viewer
================================ */

closeModal.onclick = () => {

    imageModal.style.display = "none";

};

window.onclick = (event) => {

    if (event.target === imageModal)

        imageModal.style.display = "none";

};

/* ===============================
   Search Placeholder
================================ */

searchInput.addEventListener("keyup", function () {

    console.log(this.value);

});

/* ===============================
   Favorites Placeholder
================================ */

document
.getElementById("favoriteProduct")
.addEventListener("click", () => {

    console.log("Favorite clicked.");

});

/* ===============================
   Share Placeholder
================================ */

document
.getElementById("shareProduct")
.addEventListener("click", () => {

    console.log("Share clicked.");

});
