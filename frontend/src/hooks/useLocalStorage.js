import { useEffect, useState } from 'react'

// Hook personalizado: funciona como useState, pero además guarda el valor
// en localStorage cada vez que cambia y lo recupera al cargar la página.
export function useLocalStorage(clave, valorInicial) {
  const [valor, setValor] = useState(() => {
    const guardado = localStorage.getItem(clave)
    return guardado ? JSON.parse(guardado) : valorInicial
  })

  useEffect(() => {
    localStorage.setItem(clave, JSON.stringify(valor))
  }, [clave, valor])

  return [valor, setValor]
}
