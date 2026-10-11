import { useState } from 'react'

function ContactForm() {
  // Estado que almacena los datos del formulario.
  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    mensaje: '',
  })

  // Estado que almacena los errores de validación.
  const [errores, setErrores] = useState({})

  // Estado que controla el mensaje de confirmación.
  const [mensajeEnviado, setMensajeEnviado] = useState(false)

  // Actualiza los campos mientras el usuario escribe.
  const manejarCambio = (evento) => {
    const { name, value } = evento.target

    setFormulario((datosActuales) => ({
      ...datosActuales,
      [name]: value,
    }))

    // Elimina el error del campo que se está modificando.
    setErrores((erroresActuales) => ({
      ...erroresActuales,
      [name]: '',
    }))

    // Oculta la confirmación anterior.
    setMensajeEnviado(false)
  }

  // Valida los datos ingresados en el formulario.
  const validarFormulario = () => {
    const nuevosErrores = {}

    // Validación del nombre.
    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = 'Debes ingresar tu nombre.'
    }

    // Validación del correo electrónico.
    if (!formulario.correo.trim()) {
      nuevosErrores.correo =
        'Debes ingresar tu correo electrónico.'
    } else {
      const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!expresionCorreo.test(formulario.correo.trim())) {
        nuevosErrores.correo =
          'Ingresa un correo electrónico válido.'
      }
    }

    // Validación del mensaje.
    if (!formulario.mensaje.trim()) {
      nuevosErrores.mensaje =
        'Debes escribir un mensaje.'
    }

    return nuevosErrores
  }

  // Procesa el formulario después de validar los datos.
  const manejarEnvio = (evento) => {
    evento.preventDefault()

    const erroresValidacion = validarFormulario()

    setErrores(erroresValidacion)
    setMensajeEnviado(false)

    // Si existen errores, se detiene el proceso.
    if (Object.keys(erroresValidacion).length > 0) {
      return
    }

    // Simulación de envío exitoso.
    setMensajeEnviado(true)

    // Limpia los campos del formulario.
    setFormulario({
      nombre: '',
      correo: '',
      mensaje: '',
    })
  }

  return (
    <section
      id="contacto"
      className="seccion-contacto"
      aria-labelledby="titulo-contacto"
    >
      <div className="contacto-contenido">

        <div className="contacto-informacion">
          <h2 id="titulo-contacto">
            Contacto
          </h2>

          <p>
            ¿Tienes alguna consulta?
          </p>

          <p>
            Completa el formulario y estaremos felices
            de ayudarte.
          </p>

          <p>
            <strong>Correo:</strong>{' '}
            contacto@mortalstore.cl
          </p>
        </div>

        <form
          className="formulario-contacto"
          onSubmit={manejarEnvio}
          noValidate
        >

          {/* Campo nombre */}
          <div className="mb-3">
            <label
              htmlFor="nombre"
              className="form-label"
            >
              Nombre
            </label>

            <input
              type="text"
              id="nombre"
              name="nombre"
              className={`form-control ${
                errores.nombre ? 'is-invalid' : ''
              }`}
              value={formulario.nombre}
              onChange={manejarCambio}
              placeholder="Ingresa tu nombre"
              aria-invalid={Boolean(errores.nombre)}
              aria-describedby={
                errores.nombre ? 'error-nombre' : undefined
              }
              required
            />

            {errores.nombre && (
              <div
                id="error-nombre"
                className="invalid-feedback"
              >
                {errores.nombre}
              </div>
            )}
          </div>

          {/* Campo correo electrónico */}
          <div className="mb-3">
            <label
              htmlFor="correo"
              className="form-label"
            >
              Correo electrónico
            </label>

            <input
              type="email"
              id="correo"
              name="correo"
              className={`form-control ${
                errores.correo ? 'is-invalid' : ''
              }`}
              value={formulario.correo}
              onChange={manejarCambio}
              placeholder="nombre@correo.cl"
              aria-invalid={Boolean(errores.correo)}
              aria-describedby={
                errores.correo ? 'error-correo' : undefined
              }
              required
            />

            {errores.correo && (
              <div
                id="error-correo"
                className="invalid-feedback"
              >
                {errores.correo}
              </div>
            )}
          </div>

          {/* Campo mensaje */}
          <div className="mb-3">
            <label
              htmlFor="mensaje"
              className="form-label"
            >
              Mensaje
            </label>

            <textarea
              id="mensaje"
              name="mensaje"
              className={`form-control ${
                errores.mensaje ? 'is-invalid' : ''
              }`}
              rows="5"
              value={formulario.mensaje}
              onChange={manejarCambio}
              placeholder="Escribe tu consulta"
              aria-invalid={Boolean(errores.mensaje)}
              aria-describedby={
                errores.mensaje ? 'error-mensaje' : undefined
              }
              required
            ></textarea>

            {errores.mensaje && (
              <div
                id="error-mensaje"
                className="invalid-feedback"
              >
                {errores.mensaje}
              </div>
            )}
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            className="btn btn-danger"
          >
            Enviar mensaje
          </button>

          {/* Confirmación de validación exitosa */}
          {mensajeEnviado && (
            <div
              className="alert alert-success mt-3 mb-0"
              role="status"
            >
              Mensaje registrado correctamente
              (simulación).
            </div>
          )}

        </form>
      </div>
    </section>
  )
}

export default ContactForm