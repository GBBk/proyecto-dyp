import React, { useState, useEffect } from "react";
import "../stylesheets/contenidoFitness.css";
import NavBar from "../components/NavBar";
import { useAuth } from "../auth/useAuth";
import NavBarAdmin from "../components/NavBarAdmin";

const ContenidoFitness: React.FC = () => {
  const [articulos, setArticulos] = useState<any[]>([]);
  const [palabraClave, setPalabraClave] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [articlesPerPage] = useState<number>(5); // Número de artículos por página
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (palabraClave.trim() !== "") {
      fetchArticulos();
    }
  }, [palabraClave, currentPage]); // Agregar currentPage como dependencia

  const fetchArticulos = async () => {
    const apiKey = "299b4f9542fd426faf6942fe86bcd443";
    const palabrasClave = [
      "fitness",
      "culturismo",
      "nutrición",
      "ejercicio",
      "gimnasio",
      "físico",
      "ejercitación",
      "deporte",
    ];
    const palabrasQuery = palabrasClave.join(" OR ");
    const url = `https://newsapi.org/v2/everything?q=(${palabrasQuery})${
      palabraClave ? ` AND ${palabraClave}` : ""
    }&language=es&apiKey=${apiKey}&page=${currentPage}&pageSize=${articlesPerPage}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Error al obtener los artículos para la palabra ${palabraClave}.`
        );
      }
      const data = await response.json();
      setArticulos(data.articles);
    } catch (error) {
      console.error(
        `Error al obtener los artículos para la palabra ${palabraClave}:`,
        error
      );
    }
  };

  const handleChangePalabraClave = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPalabraClave(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCurrentPage(1); // Reiniciar a la primera página al hacer una nueva búsqueda
    fetchArticulos();
  };

  return (
    <>
      <header>
        {isAdmin ? <NavBarAdmin></NavBarAdmin> : <NavBar></NavBar>}
      </header>
      <main>
        <div className="subtitle">
          <h2 className="subtitle-h2">Deporte y Salud</h2>
        </div>

        {/* Formulario de búsqueda */}
        <form onSubmit={handleSubmit} className="form-busqueda center">
          <label htmlFor="palabraClave">Buscar noticias:</label>
          <input
            type="text"
            id="palabraClave"
            value={palabraClave}
            onChange={handleChangePalabraClave}
            placeholder="Introduce una palabra clave..."
          />
        </form>

        {/* Lista de artículos */}
        <div className="articulos-fitness">
          <ul>
            {articulos.map((articulo, index) => (
              <li key={index}>
                <h3>{articulo.title}</h3>
                <p>{articulo.description}</p>
                <a
                  href={articulo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Leer más
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Controles de paginación */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <button
            className=""
            onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
          >
            Siguiente
          </button>
        </div>
      </main>
    </>
  );
};

export default ContenidoFitness;
