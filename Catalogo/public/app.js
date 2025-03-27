document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("/api/productos");
    const productos = await response.json();

    const contenedor = document.getElementById("productos");
    productos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `<h2>${producto.nombre}</h2><p>Precio: Q${producto.precio}</p>`;
        contenedor.appendChild(div);
    });
});
