const API_DETALLE = "/api";

async function iniciarDetalleAutor() {
  const select = document.getElementById("detalle-autor-select");
  const contenedor = document.getElementById("detalle-autor-resultado");

  const autores = await (await fetch(`${API_DETALLE}/autores`)).json();
  autores.forEach((a) => {
    const op = document.createElement("option");
    op.value = a._id;
    op.textContent = a.nombre;
    select.appendChild(op);
  });

  select.addEventListener("change", async () => {
    contenedor.innerHTML = "";
    if (!select.value) return;

    const comics = await (await fetch(`${API_DETALLE}/comics?autor=${select.value}`)).json();

    if (comics.length === 0) {
      contenedor.textContent = "Este autor no tiene cómics registrados.";
      return;
    }

    comics.forEach((c) => {
      const card = document.createElement("div");
      card.style.cssText = "border:1px solid #ccc;border-radius:8px;padding:12px;margin:8px 0;";
      card.innerHTML = `
        <h3>${c.titulo}</h3>
        <p><strong>Autor:</strong> ${c.autor?.nombre ?? "-"} (${c.autor?.nacionalidad ?? "-"})</p>
        <p><strong>Editorial:</strong> ${c.editorial ?? "-"}</p>
        <p><strong>Año:</strong> ${c.anioPublicacion ?? "-"}</p>
        <p><strong>Precio:</strong> $${Number(c.precio).toLocaleString("es-CO")}</p>
        <p><strong>Stock:</strong> ${c.stock}</p>
      `;
      contenedor.appendChild(card);
    });
  });
}

iniciarDetalleAutor();
