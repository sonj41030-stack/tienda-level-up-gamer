import { render, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react'
import BlogCard from '../src/components/BlogCard.jsx'
import Blogs from '../src/pages/Blogs.jsx'
import { articulos } from '../src/data/blogs.js'

const articulo = articulos[1]

describe('BlogCard', () => {
  it('muestra la imagen, categoría, fecha, título y resumen que recibe por props', () => {
    render(<BlogCard articulo={articulo} onLeer={() => {}} />)
    expect(screen.getByRole('heading', { name: articulo.titulo })).toBeTruthy()
    expect(screen.getByText(`${articulo.categoria} • ${articulo.fecha}`)).toBeTruthy()
    expect(screen.getByText(articulo.resumen)).toBeTruthy()
    expect(screen.getByAltText(articulo.titulo).getAttribute('src')).toBe(articulo.imagen)
  })

  it('al apretar "Leer artículo" llama a onLeer con ese artículo', () => {
    // jasmine.createSpy crea una función falsa que registra cómo fue llamada
    const onLeer = jasmine.createSpy('onLeer')
    render(<BlogCard articulo={articulo} onLeer={onLeer} />)

    fireEvent.click(screen.getByRole('button', { name: 'Leer artículo' }))

    expect(onLeer).toHaveBeenCalledOnceWith(articulo)
  })
})

describe('Página Blogs', () => {
  it('muestra una tarjeta por cada artículo', () => {
    render(<Blogs />)
    expect(screen.getByRole('heading', { name: 'Novedades y Noticias' })).toBeTruthy()
    expect(screen.getAllByRole('button', { name: 'Leer artículo' }).length).toBe(articulos.length)
  })

  it('el modal está cerrado al entrar a la página', () => {
    render(<Blogs />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('al leer un artículo abre un modal con su contenido completo', () => {
    render(<Blogs />)
    fireEvent.click(screen.getAllByRole('button', { name: 'Leer artículo' })[1])

    const modal = screen.getByRole('dialog')
    expect(modal.textContent).toContain(articulo.titulo)
    expect(modal.textContent).toContain(articulo.contenido)
    expect(modal.textContent).toContain(`${articulo.categoria} • ${articulo.fecha}`)
  })

  it('el botón Cerrar oculta el modal', async () => {
    render(<Blogs />)
    fireEvent.click(screen.getAllByRole('button', { name: 'Leer artículo' })[0])
    expect(screen.getByRole('dialog')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }))

    // El modal se cierra con una animación, por eso se espera a que desaparezca
    await waitForElementToBeRemoved(() => screen.queryByRole('dialog'))
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
