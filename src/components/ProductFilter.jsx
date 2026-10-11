function ProductFilter({
  busqueda,
  setBusqueda,
  categoria,
  setCategoria,
  productos = [],
}) {
  // Obtener las categorías disponibles en el catálogo.
  // Set permite eliminar las categorías repetidas.
  const categoriasDisponibles = [
    ...new Set(
      productos
        .map((producto) => producto.categoria)
        .filter(Boolean)
    ),
  ].sort((a, b) => a.localeCompare(b, 'es'))

  return (
    <div className="filtro-productos">

      {/* Filtro de videojuegos mediante texto de búsqueda */}
      <div className="filtro-busqueda">
        <label
          htmlFor="busqueda"
          className="form-label"
        >
          Buscar videojuego
        </label>

        <input
          type="search"
          id="busqueda"
          className="form-control"
          placeholder="Ej: Minecraft"
          value={busqueda}
          onChange={(evento) =>
            setBusqueda(evento.target.value)
          }
        />
      </div>

      {/* Filtro de videojuegos por categoría */}
      <div className="filtro-categoria">
        <label
          htmlFor="categoria"
          className="form-label"
        >
          Categoría
        </label>

        <select
          id="categoria"
          className="form-select"
          value={categoria}
          onChange={(evento) =>
            setCategoria(evento.target.value)
          }
        >
          {/* Opción para mostrar todos los videojuegos */}
          <option value="Todas">
            Todas
          </option>

          {/* Generación dinámica de categorías */}
          {categoriasDisponibles.map((categoriaDisponible) => (
            <option
              key={categoriaDisponible}
              value={categoriaDisponible}
            >
              {categoriaDisponible}
            </option>
          ))}
        </select>
      </div>

    </div>
  )
}

export default ProductFilter