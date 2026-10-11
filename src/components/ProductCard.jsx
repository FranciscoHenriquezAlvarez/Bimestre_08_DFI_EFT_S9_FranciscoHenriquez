import { formatearPrecio } from '../utils/formatters'

function ProductCard({
  producto,
  agregarAlCarrito,
  estaEnCarrito,
  cantidadEnCarrito,
}) {
  return (
    <div className="card h-100 product-card">

      {/* Imagen del videojuego */}
      <img
        src={`${import.meta.env.BASE_URL}${producto.imagen}`}
        className="card-img-top product-image"
        alt={producto.nombre}
      />

      <div className="card-body d-flex flex-column">

        {/* Nombre del videojuego */}
        <h3 className="card-title h5">
          {producto.nombre}
        </h3>

        {/* Categoría */}
        <span className="badge text-bg-secondary align-self-start mb-3">
          {producto.categoria}
        </span>

        {/* Descripción */}
        <p className="card-text product-description">
          {producto.descripcion}
        </p>

        <div className="mt-auto">

          {/* Precios */}
          <div className="product-prices mb-3">
            <span className="precio-normal">
              {formatearPrecio(producto.precioNormal)}
            </span>

            <span className="precio-oferta">
              {formatearPrecio(producto.precioOferta)}
            </span>
          </div>

          {/* Información del carrito */}
          {estaEnCarrito && (
            <p className="text-success fw-semibold mb-2">
              ✓ En el carrito ({cantidadEnCarrito})
            </p>
          )}

          {/* Botón para agregar al carrito */}
          <button
            type="button"
            className={
              estaEnCarrito
                ? 'btn btn-outline-danger w-100'
                : 'btn btn-danger w-100'
            }
            onClick={() => agregarAlCarrito(producto)}
          >
            {estaEnCarrito
              ? 'Agregar otra unidad'
              : 'Agregar al carrito'}
          </button>

        </div>
      </div>
    </div>
  )
}

export default ProductCard