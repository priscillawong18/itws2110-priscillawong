document.addEventListener("DOMContentLoaded", () => {
    const menuGrid = document.getElementById("menu-grid");
    
    fetch("data/menu.json").then(response => {
        if (!response.ok) throw new Error("Network response error");
        return response.json();
    })
    .then(data => {
        data.menu.forEach(item => {
            const card = document.createElement("div");
            
            // Display card details (image, name, description, category, cuisine, ingredients, price)
            card.classList.add("menu-card");
            card.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-info">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p class="menu-tags">Category: ${item.category}</p>
            <p class="menu-tags">Cuisine: ${item.cuisine}</p>
            <p class="menu-tags">Ingredients: ${item.ingredients.join(", ")}</p>
            <p class="menu-price">$${item.price.toFixed(2)}</p>
            </div>
            `;menuGrid.appendChild(card);
        });
    })
    .catch(error => {
        console.error("Error loading menu:", error);
        menuGrid.innerHTML = `<p>Failed to load menu</p>`;
    });
});
