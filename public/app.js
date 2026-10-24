import { listarAutores, crearAutor, listarComics, crearComic } from "./api.js";

const $ = (id) => document.getElementById(id);

const escapar = (t) =>
  String(t).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));

function mostrarMensaje(el, texto, ok = true) {
  el.textContent = texto;
  el.className = "mensaje " + (ok ? "ok" : "error");
}

function llenarAutores(select, autores, textoInicial) {
  const actual = select.value;
  select.innerHTML =
    `<option value="">${textoInicial}</option>` +
    autores.map((a) => `<option value="${a._id}">${escapar(a.nombre)}</option>`).join("");
  select.value = actual;
}

async function cargarAutores() {
  const autores = await listarAutores();
  llenarAutores($("filtro-autor"), autores, "Todos");
  llenarAutores($("comic-autor"), autores, "Selecciona un autor");
}

async function cargarEditoriales() {
  const todos = await listarComics();
  const editoriales = [...new Set(todos.map((c) => c.editorial).filter(Boolean))].sort();
  const select = $("filtro-editorial");
  const actual = select.value;
  select.innerHTML =
    '<option value="">Todas</option>' +
    editoriales.map((e) => `<option value="${escapar(e)}">${escapar(e)}</option>`).join("");
  select.value = actual;
}

function tarjeta(c) {
  const detalle = [c.editorial, c.anioPublicacion].filter(Boolean).join(" · ");
  return `
    <article class="card">
      <h3>${escapar(c.titulo)}</h3>
      <p class="autor">${escapar(c.autor?.nombre ?? "Autor desconocido")}</p>
      <p>${escapar(detalle)}</p>
      <p class="precio">$${Number(c.precio).toLocaleString("es-CO")}</p>
      <p>Stock: ${c.stock}</p>
    </article>`;
}

async function cargarComics() {
  const lista = $("lista-comics");
  try {
    const comics = await listarComics({
      editorial: $("filtro-editorial").value,
      autor: $("filtro-autor").value
    });
    lista.innerHTML = comics.length
      ? comics.map(tarjeta).join("")
      : "<p>No hay cómics para mostrar.</p>";
  } catch (error) {
    lista.innerHTML = `<p class="error">${escapar(error.message)}</p>`;
  }
}

$("filtro-editorial").addEventListener("change", cargarComics);
$("filtro-autor").addEventListener("change", cargarComics);

$("form-autor").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const autor = await crearAutor({
      nombre: $("autor-nombre").value,
      nacionalidad: $("autor-nacionalidad").value,
      fechaNacimiento: $("autor-fecha").value || undefined
    });
    mostrarMensaje($("msg-autor"), `Autor creado: ${autor.nombre}`);
    e.target.reset();
    await cargarAutores();
  } catch (error) {
    mostrarMensaje($("msg-autor"), error.message, false);
  }
});

$("form-comic").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const comic = await crearComic({
      titulo: $("comic-titulo").value,
      autor: $("comic-autor").value,
      editorial: $("comic-editorial").value,
      anioPublicacion: $("comic-anio").value ? Number($("comic-anio").value) : undefined,
      precio: Number($("comic-precio").value),
      stock: Number($("comic-stock").value || 0)
    });
    mostrarMensaje($("msg-comic"), `Cómic creado: ${comic.titulo}`);
    e.target.reset();
    await cargarEditoriales();
    await cargarComics();
  } catch (error) {
    mostrarMensaje($("msg-comic"), error.message, false);
  }
});

async function iniciar() {
  try {
    await cargarAutores();
    await cargarEditoriales();
    await cargarComics();
  } catch (error) {
    $("lista-comics").innerHTML = `<p class="error">${escapar(error.message)}</p>`;
  }
}

iniciar();
