import React, { useEffect, useState, useRef } from "react";
import { API_URL } from "../../auth/constants";
import "../../stylesheets/ejercicios.css";
import NavBarAdmin from "../../components/NavBarAdmin";
import { type Ejercicios } from "../../types/types.ts";
import SuccessMessage from "../../components/SuccessMessage.tsx";
import ErrorMessage from "../../components/ErrorMessage.tsx";
import ModalHU from "../../components/ModalHU.tsx";

export default function Ejercicios() {
  const [nombreEjercicio, setNombreEjercicio] = useState("");
  const [urlImg, setUrlImg] = useState("");
  const [ejercicios, setEjercicios] = useState<Ejercicios[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const exercisesPerPage = 10;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEjercicio, setSelectedEjercicio] = useState<Ejercicios | null>(
    null
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const imagenContainerRef = useRef<HTMLDivElement>(null);
  const imagenEjercicioRef = useRef<HTMLImageElement>(null);

  const fetchEjercicios = async () => {
    try {
      let url = `${API_URL}/ejercicios?page=${currentPage}&limit=${exercisesPerPage}`;
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      const options = {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      };
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Hubo un problema al obtener los datos.");
      }
      const data = await response.json();
      setEjercicios(data.body.ejercicios);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const handleModificarEjercicio = async (
    id: number,
    nuevoNombre: string,
    nuevaUrl: string
  ) => {
    try {
      const response = await fetch(`${API_URL}/ejercicios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          nombreEjercicio: nuevoNombre,
          imgUrl: nuevaUrl,
        }),
      });
      if (response.ok) {
        fetchEjercicios();
        closeModal();
        setErrorMessage("");
        setSuccessMessage("Ejercicio modificado con éxito!");
      } else {
        setSuccessMessage("");
        setErrorMessage("Hubo un problema al modificar el ejercicio.");
        throw new Error("Hubo un problema al modificar el ejercicio.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleOpenModal = (ejercicio: Ejercicios) => {
    setSelectedEjercicio(ejercicio);
    setNombreEjercicio(ejercicio.nombreEjercicio);
    setUrlImg(ejercicio.imgUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedEjercicio(null);
    setModalIsOpen(false);
  };

  useEffect(() => {
    fetchEjercicios();
  }, [currentPage, searchTerm]);

  const handleEjercicioClick = (imgUrl: string | null) => {
    if (imgUrl && imagenEjercicioRef.current && imagenContainerRef.current) {
      imagenEjercicioRef.current.src = imgUrl;
      imagenContainerRef.current.style.display = "block";
    }
  };

  const handleImagenContainerClick = () => {
    if (imagenContainerRef.current) {
      imagenContainerRef.current.style.display = "none";
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <header>
        <NavBarAdmin />
      </header>
      <main>
        <div className="subtitle">
          <h2 className="subtitle-h2">Ejercicios</h2>
        </div>
        <div className="contenido-container">
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar ejercicio"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div id="currentPageDisplay" className="pagination-buttons">
            <button
              id="prevPage"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span id="currentPage">{currentPage}</span>
            <button id="nextPage" onClick={handleNextPage}>
              Siguiente
            </button>
          </div>

          <ul id="ejercicios-list">
            {ejercicios.map((ejercicio, index) => (
              <li
                className="ej__item"
                key={`${ejercicio.idEjercicio}+${index}`}
                onClick={() => handleEjercicioClick(ejercicio.imgUrl)}
              >
                <h3>{ejercicio.nombreEjercicio}</h3>
                <div className="crud-buttons">
                  <a
                    id="modificarBtn"
                    onClick={() => handleOpenModal(ejercicio)}
                  >
                    Modificar
                  </a>
                </div>
              </li>
            ))}
          </ul>

          <div
            id="imagen-container"
            className="imagen-container"
            ref={imagenContainerRef}
            onClick={handleImagenContainerClick}
          >
            <img id="imagen-ejercicio" ref={imagenEjercicioRef} />
          </div>

          <ModalHU isOpen={modalIsOpen} onClose={closeModal}>
            <h2 className="center mb9">Modificar Ejercicio</h2>
            <div>
              {selectedEjercicio && (
                <form
                  className="modal-ejercicio-container"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleModificarEjercicio(
                      selectedEjercicio.idEjercicio,
                      nombreEjercicio,
                      urlImg
                    );
                  }}
                >
                  <label>Nombre del ejercicio:</label>
                  <input
                    type="text"
                    className="form__input"
                    placeholder="Nuevo nombre de ejercicio"
                    value={nombreEjercicio}
                    onChange={(e) => setNombreEjercicio(e.target.value)}
                  />
                  <label>URL de la imagen del ejercicio</label>
                  <input
                    type="url"
                    className="form__input ej__file"
                    placeholder="Nueva URL de la imagen"
                    onChange={(e) => setUrlImg(e.target.value)}
                  />

                  <button type="submit" className="form__submit fz center">
                    Guardar cambios
                  </button>
                </form>
              )}
            </div>
          </ModalHU>
        </div>
      </main>
    </>
  );
}
