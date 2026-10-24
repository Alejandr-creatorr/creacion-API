const BASE = "/api";

async function pedir(ruta, opciones = {}) {
  const res = await fetch(`${BASE}${ruta}`, {
    headers: { "Content-Type": "application/json" },
    ...opciones
  });
  const datos = await res.json();
  if (!res.ok) throw new Error(datos.mensaje || "Error en la petición");
  return datos;
}

export const listarAutores = () => pedir("/autores");

export const crearAutor = (autor) =>
  pedir("/autores", { method: "POST", body: JSON.stringify(autor) });

export const listarComics = (filtros = {}) => {
  const params = new URLSearchParams();
  if (filtros.editorial) params.set("editorial", filtros.editorial);
  if (filtros.autor) params.set("autor", filtros.autor);
  const query = params.toString();
  return pedir(`/comics${query ? "?" + query : ""}`);
};

export const crearComic = (comic) =>
  pedir("/comics", { method: "POST", body: JSON.stringify(comic) });
