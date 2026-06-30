/* ==========================================================
   ST LIGHT DIGITAL CATALOGUE
   FULL APPLICATION LOGIC
   Features:
   - Load catalog.json
   - Render categories
   - Render products
   - Search
   - Product viewer modal
   - Favorites (localStorage)
   - Share (Web Share API + fallback)
   - Simple routing (#category / #product)
========================================================== */

const categoryContainer = document.getElementById("categories");
const searchInput = document.getElementById("searchInput");

const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");

const closeModal = document.getElementById("closeModal");
const favoriteBtn = document.getElementById("favoriteProduct");
const shareBtn = document.getElementById("shareProduct");

let catalog = [];
let flatProducts = [];
let currentProduct = null;

/* =========================
   INIT APP
========================= */

document.addEventListener("DOMContentLoaded", init);

async function init() {
    await loadCatalog();
    buildFlatProducts();
    renderCategories();
    handleRouting();
}

/* =========================
   LOAD DATA
========================= */

async function loadCatalog() {
    try {
        const res = await fetch("catalog.json");
        const data = await res.json();
        catalog = data.categories;
    } catch (err) {
        categoryContainer.innerHTML = "<h2>Error loading catalog</h2>";
        console.error(err);
    }
}

/* =========================
   FLATTEN PRODUCTS
========================= */

function buildFlatProducts() {
    flatProducts = [];

    catalog.forEach(cat => {
        cat.items.forEach(item => {
            flatProducts.push({
                ...item,
                category: cat.name
            });
        });
    });
}

/* =========================
   RENDER CATEGORIES
========================= */

function renderCategories() {
    categoryContainer.innerHTML = "";

    catalog.forEach(cat => {
        const card = document.createElement("div");
        card.className = "category";

        card.innerHTML = `
            <img src="${cat.image}" alt="${cat.name}">
            <div class="category-info">
                <h2>${cat.icon} ${cat.name}</h2>
                <p>${cat.items.length} Products</p>
            </div>
        `;

        card.onclick = () => {
            renderProducts(cat);
            location.hash = cat.name.toLowerCase();
        };

        categoryContainer.appendChild(card);
    });
}

/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts(category) {
    categoryContainer.innerHTML = "";

    const title = document.createElement("h1");
    title.textContent = category.name;
    title.style.marginBottom = "20px";

    const back = document.createElement("button");
    back.textContent = "⬅ Back";
    back.style.marginBottom = "20px";
    back.onclick = renderCategories;

    const grid = document.createElement("div");
    grid.className = "products";

    category.items.forEach(item => {
        const card = document.createElement("div");
        card.className = "product";

        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
        `;

        card.onclick = () => {
            openProduct(item);
            location.hash = item.id;
        };

        grid.appendChild(card);
    });

    categoryContainer.appendChild(back);
    categoryContainer.appendChild(title);
    categoryContainer.appendChild(grid);
}

/* =========================
   OPEN PRODUCT MODAL
========================= */

function openProduct(product) {
    currentProduct = product;

    modalImage.src = product.image;
    modalTitle.textContent = product.name;

    modal.style.display = "flex";
}

/* =========================
   CLOSE MODAL
========================= */

closeModal.onclick = () => modal.style.display = "none";

window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
};

/* =========================
   SEARCH
========================= */

searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();

    if (!value) {
        renderCategories();
        return;
    }

    const results = flatProducts.filter(p =>
        p.name.toLowerCase().includes(value)
    );

    categoryContainer.innerHTML = "<h2>Search Results</h2>";

    const grid = document.createElement("div");
    grid.className = "products";

    results.forEach(item => {
        const card = document.createElement("div");
        card.className = "product";

        card.innerHTML = `
            <img src="${item.image}">
            <h3>${item.name}</h3>
        `;

        card.onclick = () => openProduct(item);

        grid.appendChild(card);
    });

    categoryContainer.appendChild(grid);
});

/* =========================
   FAVORITES (LOCAL STORAGE)
========================= */

function getFavorites() {
    return JSON.parse(localStorage.getItem("st_favs") || "[]");
}

function saveFavorites(list) {
    localStorage.setItem("st_favs", JSON.stringify(list));
}

function toggleFavorite(product) {
    let favs = getFavorites();

    const exists = favs.find(f => f.id === product.id);

    if (exists) {
        favs = favs.filter(f => f.id !== product.id);
    } else {
        favs.push(product);
    }

    saveFavorites(favs);
}

/* =========================
   FAVORITE BUTTON
========================= */

favoriteBtn.onclick = () => {
    if (!currentProduct) return;
    toggleFavorite(currentProduct);
    alert("Saved to Favorites ❤️");
};

/* =========================
   SHARE PRODUCT
========================= */

shareBtn.onclick = async () => {
    if (!currentProduct) return;

    const shareData = {
        title: currentProduct.name,
        text: "Check this ST LIGHT product",
        url: location.href
    };

    try {
        await navigator.share(shareData);
    } catch {
        navigator.clipboard.writeText(location.href);
        alert("Link copied!");
    }
};

/* =========================
   ROUTING (#product or #category)
========================= */

function handleRouting() {
    const hash = location.hash.replace("#", "");

    if (!hash) return;

    const product = flatProducts.find(p => p.id === hash);

    if (product) {
        openProduct(product);
        return;
    }

    const category = catalog.find(c =>
        c.name.toLowerCase() === hash.toLowerCase()
    );

    if (category) {
        renderProducts(category);
    }
}
