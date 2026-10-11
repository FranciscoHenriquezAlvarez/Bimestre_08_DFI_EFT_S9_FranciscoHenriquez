import ProductCard from './ProductCard'

function ProductList({
  productos,
  carrito,
  agregarAlCarrito,
}) {
  // Mostrar un mensaje cuando no existan resultados.
  if (productos.length === 0) {
    return (
      <div
        className="alert alert-info text-center"
        role="status"
      >
        No se encontraron videojuegos para mostrar.
      </div>
    )
  }

  return (
    <div className="row g-4">
      {productos.map((producto) => {
        // Comprobar si el videojuego está en el carrito.
        const productoEnCarrito = carrito.find(
          (item) => item.id === producto.id
        )

        return (
          <div
            className="col-12 col-sm-6 col-lg-4"
            key={producto.id}
          >
            <ProductCard
              producto={producto}
              agregarAlCarrito={agregarAlCarrito}
              estaEnCarrito={Boolean(productoEnCarrito)}
              cantidadEnCarrito={
                productoEnCarrito?.cantidad ?? 0
              }
            />
          </div>
        )
      })}
    </div>
  )
}

export default ProductList