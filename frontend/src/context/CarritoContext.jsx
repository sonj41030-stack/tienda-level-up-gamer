import { createContext, useContext, useState, useEffect } from 'react'

const CarritoContext = createContext()

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem('carrito')
    return guardado ? JSON.parse(guardado) : []
  })

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito))
  }, [carrito])

  const agregar = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id)
      if (existe) {
        return prev.map(item => 
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  const eliminar = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id))
  }

  const actualizarCantidad = (id, cantidad) => {
    if (cantidad <= 0) {
      eliminar(id)
      return
    }
    setCarrito(prev => prev.map(item => 
      item.id === id ? { ...item, cantidad } : item
    ))
  }

  const vaciarCarrito = () => setCarrito([])

  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0)
  const totalPrecio = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)

  return (
    <CarritoContext.Provider value={{ carrito, agregar, eliminar, actualizarCantidad, vaciarCarrito, totalItems, totalPrecio }}>
      {children}
    </CarritoContext.Provider>
  )
}

export function useCarrito() {
  return useContext(CarritoContext)
}
