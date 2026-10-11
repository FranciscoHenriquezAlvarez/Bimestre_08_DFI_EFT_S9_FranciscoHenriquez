import { useEffect, useState } from 'react'

// Componentes de la aplicación
import Header from './components/Header'
import Navbar from './components/Navbar'
import HeroCarousel from './components/HeroCarousel'
import ProductList from './components/ProductList'
import ProductFilter from './components/ProductFilter'
import Cart from './components/Cart'
import InfoSection from './components/InfoSection'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'

// Funciones reutilizables
import { calcularTotalProductos } from './utils/cartUtils'

// Estilos
import './App.css'

// Clave utilizada para guardar el carrito
const CLAVE_CARRITO = 'carritoMortalStore'

// =====================================================
// VALIDACIÓN DE LOS DATOS DE LOS VIDEOJUEGOS
// =====================================================

function esProductoValido(producto) {
  return (
    producto !== null &&
    typeof producto === 'object' &&
    Number.isInteger(producto.id) &&
    typeof producto.nombre === 'string' &&
    typeof producto.categoria === 'string' &&
    typeof producto.descripcion === 'string' &&
    typeof producto.imagen === 'string' &&
    Number.isFinite(producto.precioNormal) &&
    Number.isFinite(producto.precioOferta)
  )
}

// =====================================================
// RECUPERAR EL CARRITO DESDE LOCALSTORAGE
// =====================================================

function recuperarCarrito() {
  try {
    const carritoGuardado = localStorage.getItem(
      CLAVE_CARRITO
    )

    if (!carritoGuardado) {
      return []
    }

    const datos = JSON.parse(carritoGuardado)

    if (!Array.isArray(datos)) {
      return []
    }

    return datos.filter(
      (producto) =>
        esProductoValido(producto) &&
        Number.isInteger(producto.cantidad) &&
        producto.cantidad > 0
    )
  } catch (error) {
    console.error(
      'No se pudo recuperar el carrito:',
      error
    )

    return []
  }
}

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

function App() {

  // =====================================================
  // 1. ESTADOS DEL CATÁLOGO
  // =====================================================

  // Almacena los videojuegos cargados desde el JSON
  const [productos, setProductos] = useState([])

  // Controla el estado de carga
  const [cargando, setCargando] = useState(true)

  // Almacena los errores de carga
  const [error, setError] = useState(null)

  // Permite volver a intentar la carga
  const [intentoCarga, setIntentoCarga] = useState(0)

  // =====================================================
  // 2. ESTADO DEL CARRITO
  // =====================================================

  const [carrito, setCarrito] = useState(recuperarCarrito)

  // =====================================================
  // 3. ESTADOS DE LOS FILTROS
  // =====================================================

  const [busqueda, setBusqueda] = useState('')

  const [categoria, setCategoria] = useState('Todas')

  // =====================================================
  // 4. CARGA DINÁMICA DE VIDEOJUEGOS
  // =====================================================

  useEffect(() => {
    const controlador = new AbortController()

    const cargarProductos = async () => {
      setCargando(true)
      setError(null)

      try {
        // Obtiene los videojuegos desde el archivo JSON
        const respuesta = await fetch(
          `${import.meta.env.BASE_URL}data/productos.json`,
          {
            signal: controlador.signal,
          }
        )

        // Comprueba la respuesta del servidor
        if (!respuesta.ok) {
          throw new Error(`HTTP ${respuesta.status}`)
        }

        // Convierte el JSON en un arreglo de JavaScript
        const datos = await respuesta.json()

        // Verifica la estructura del catálogo
        if (
          !Array.isArray(datos) ||
          !datos.every(esProductoValido)
        ) {
          throw new Error('FORMATO_INVALIDO')
        }

        // Actualiza el estado de React
        setProductos(datos)

      } catch (errorCarga) {

        // Ignora las peticiones canceladas
        if (errorCarga.name === 'AbortError') {
          return
        }

        console.error(
          'Error al cargar los videojuegos:',
          errorCarga
        )

        setProductos([])

        // Distingue los diferentes tipos de error
        if (
          errorCarga instanceof SyntaxError ||
          errorCarga.message === 'FORMATO_INVALIDO'
        ) {
          setError(
            'El archivo del catálogo está corrupto o contiene datos inválidos.'
          )

        } else if (
          errorCarga.message.startsWith('HTTP ')
        ) {
          setError(
            `El servidor no pudo entregar el catálogo (${errorCarga.message}).`
          )

        } else {
          setError(
            'No se pudo conectar para cargar el catálogo. Comprueba tu conexión.'
          )
        }

      } finally {

        if (!controlador.signal.aborted) {
          setCargando(false)
        }
      }
    }

    cargarProductos()

    // Cancela la petición si el componente se desmonta
    return () => {
      controlador.abort()
    }

  }, [intentoCarga])

  // =====================================================
  // 5. GUARDAR EL CARRITO EN LOCALSTORAGE
  // =====================================================

  useEffect(() => {
    localStorage.setItem(
      CLAVE_CARRITO,
      JSON.stringify(carrito)
    )
  }, [carrito])

  // =====================================================
  // 6. AGREGAR VIDEOJUEGOS AL CARRITO
  // =====================================================

  const agregarAlCarrito = (producto) => {
    setCarrito((carritoActual) => {

      // Comprueba si el producto ya está en el carrito
      const productoExiste = carritoActual.find(
        (item) => item.id === producto.id
      )

      // Si existe, aumenta su cantidad
      if (productoExiste) {
        return carritoActual.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
              }
            : item
        )
      }

      // Si no existe, agrega una unidad
      return [
        ...carritoActual,
        {
          ...producto,
          cantidad: 1,
        },
      ]
    })
  }

  // =====================================================
  // 7. AUMENTAR CANTIDAD EN EL CARRITO
  // =====================================================

  const aumentarCantidad = (id) => {
    setCarrito((carritoActual) =>
      carritoActual.map((item) =>
        item.id === id
          ? {
              ...item,
              cantidad: item.cantidad + 1,
            }
          : item
      )
    )
  }

  // =====================================================
  // 8. DISMINUIR CANTIDAD EN EL CARRITO
  // =====================================================

  const disminuirCantidad = (id) => {
    setCarrito((carritoActual) =>
      carritoActual
        .map((item) =>
          item.id === id
            ? {
                ...item,
                cantidad: item.cantidad - 1,
              }
            : item
        )
        .filter(
          (item) => item.cantidad > 0
        )
    )
  }

  // =====================================================
  // 9. ELIMINAR PRODUCTOS DEL CARRITO
  // =====================================================

  const eliminarProducto = (id) => {
    setCarrito((carritoActual) =>
      carritoActual.filter(
        (item) => item.id !== id
      )
    )
  }

  // =====================================================
  // 10. CALCULAR TOTAL DE PRODUCTOS DEL CARRITO
  // =====================================================

  const totalProductos = calcularTotalProductos(
    carrito
  )

  // =====================================================
  // 11. FILTRAR VIDEOJUEGOS
  // =====================================================

  const productosFiltrados = productos.filter(
    (producto) => {

      // Comprueba la búsqueda por nombre
      const coincideBusqueda = producto.nombre
        .toLowerCase()
        .includes(
          busqueda.trim().toLowerCase()
        )

      // Comprueba la categoría seleccionada
      const coincideCategoria =
        categoria === 'Todas' ||
        producto.categoria === categoria

      // Deben cumplirse ambas condiciones
      return (
        coincideBusqueda &&
        coincideCategoria
      )
    }
  )

  // =====================================================
  // 12. INTERFAZ DE LA APLICACIÓN
  // =====================================================

  return (
    <>

      {/* Encabezado */}
      <Header />

      {/* Barra de navegación */}
      <Navbar
        totalProductos={totalProductos}
        setCategoria={setCategoria}
      />

      {/* Carrusel principal */}
      <HeroCarousel />

      <main className="contenedor contenido-principal">

        {/* ==========================================
            CATÁLOGO DE VIDEOJUEGOS
        ========================================== */}

        <section
          id="catalogo"
          className="seccion-productos"
          aria-labelledby="titulo-productos"
        >

          <h2 id="titulo-productos">
            Productos destacados
          </h2>

          {/* Filtros de búsqueda y categoría */}
          <ProductFilter
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            categoria={categoria}
            setCategoria={setCategoria}
            productos={productos}
          />

          {/* Contenido dinámico del catálogo */}
          {cargando ? (

            <div
              className="alert alert-info text-center"
              role="status"
            >
              Cargando productos...
            </div>

          ) : error ? (

            <div
              className="alert alert-danger text-center"
              role="alert"
            >

              <p className="mb-3">
                {error}
              </p>

              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() =>
                  setIntentoCarga(
                    (intentoAnterior) =>
                      intentoAnterior + 1
                  )
                }
              >
                Reintentar carga
              </button>

            </div>

          ) : (

            <ProductList
              productos={productosFiltrados}
              carrito={carrito}
              agregarAlCarrito={agregarAlCarrito}
            />

          )}

        </section>

        {/* ==========================================
            CARRITO DE COMPRAS
        ========================================== */}

        <section
          id="carrito"
          className="seccion-carrito"
        >

          <Cart
            carrito={carrito}
            aumentarCantidad={aumentarCantidad}
            disminuirCantidad={disminuirCantidad}
            eliminarProducto={eliminarProducto}
          />

        </section>

        {/* Información adicional */}
        <InfoSection />

        {/* Formulario de contacto */}
        <ContactForm />

      </main>

      {/* Pie de página */}
      <Footer />

    </>
  )
}

export default App