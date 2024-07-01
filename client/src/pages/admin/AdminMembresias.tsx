import React, { useState, useEffect } from "react";
import NavBarAdmin from "../../components/NavBarAdmin";
import { API_URL } from "../../auth/constants";
import { FormGroup } from "../../components/FormGroup";
import "../../stylesheets/membresias.css";
import { Membresia } from "../../types/types";
import SuccessMessage from "../../components/SuccessMessage";
import ErrorMessage from "../../components/ErrorMessage.tsx";
import ModalHU from "../../components/ModalHU"; // Importar el Modal
import { fetchUsuarios } from "../../services/constants.ts";

interface SearchUsarios {
  idUsuario: number;
  nombreUsuario: string;
}

export default function AdminMembresias() {
  const [membresias, setMembresias] = useState<Membresia[]>([]);
  const [usuarios, setUsuarios] = useState<SearchUsarios[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<number>(0);
  const [membresiaSeleccionada, setMembresiaSeleccionada] = useState<number>(0);
  const [nombreMembresia, setNombreMembresia] = useState("");
  const [descripcionMembresia, setDescripcionMembresia] = useState("");
  const [meses, setMeses] = useState("");
  const [clasesMes, setClasesMes] = useState("");
  const [precioMembresia, setPrecioMembresia] = useState(0);
  const [actividades, setActividades] = useState("");
  const [avisoVencimiento, setAvisoVencimiento] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const handleMembresiaSubmit = async (
    e: React.ChangeEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      let avisarVencimiento = 0;
      if (avisoVencimiento === "Si") {
        avisarVencimiento = 1;
      }
      const response = await fetch(`${API_URL}/membresias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          nombreMembresia: nombreMembresia,
          descripcionMembresia: descripcionMembresia,
          clasesMes: clasesMes,
          precioMembresia: precioMembresia,
          actividades: actividades,
          avisoVencimiento: avisarVencimiento,
        }),
      });
      if (!response.ok) {
        setSuccessMessage("");
        setErrorMessage("Hubo un problema al crear la membresía.");
        throw new Error("Hubo un problema al crear la membresía.");
      }
      setErrorMessage("");
      setSuccessMessage("Plan de membresía creado con éxito");
      setNombreMembresia("");
      setDescripcionMembresia("");
      setClasesMes("");
      setPrecioMembresia(0);
      setActividades("");
      setAvisoVencimiento("");
      setIsCreateModalOpen(false); // Cerrar el modal al guardar
      fetchMembresias();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleAssignSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const currentDate = new Date();
      const expiryDate = new Date(currentDate);

      if (meses === "3") {
        expiryDate.setDate(currentDate.getDate() + 90);
      } else if (meses === "6") {
        expiryDate.setDate(currentDate.getDate() + 180);
      } else if (meses === "12") {
        expiryDate.setDate(currentDate.getDate() + 365);
      } else {
        expiryDate.setDate(currentDate.getDate() + 30);
      }

      // Formatear las fechas a 'YYYY-MM-DD HH:mm:ss'
      const formatDateTimeForMySQL = (date) => {
        const padZero = (num) => (num < 10 ? `0${num}` : num);
        return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(
          date.getDate()
        )} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(
          date.getSeconds()
        )}`;
      };

      const fechaAsignacion = formatDateTimeForMySQL(currentDate);
      const fechaVencimiento = formatDateTimeForMySQL(expiryDate);

      const response = await fetch(`${API_URL}/asignarMembresia`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          idUsuario: usuarioSeleccionado,
          idMembresia: membresiaSeleccionada,
          fechaAsignacion: fechaAsignacion,
          fechaVencimiento: fechaVencimiento,
        }),
      });

      if (!response.ok) {
        setSuccessMessage("");
        setErrorMessage("Hubo un problema al asignar la membresía.");
        throw new Error("Hubo un problema al asignar la membresía.");
      }

      const data = await response.json();
      console.log(data);
      setErrorMessage("");
      setSuccessMessage("Membresía asignada con éxito");
      setIsAssignModalOpen(false); // Cerrar el modal al guardar
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const fetchMembresias = async () => {
    try {
      const response = await fetch(`${API_URL}/membresias`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!response.ok) {
        setErrorMessage("Hubo un problema al obtener las membresías.");
        throw new Error("Hubo un problema al obtener las membresías.");
      }
      const data = await response.json();
      setMembresias(data.body.membresias);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchMembresias();
    fetchUsuarios(setUsuarios);
  }, []);

  return (
    <>
      <header>
        <NavBarAdmin />
      </header>
      <main>
        <div className="subtitle">
          <h2 className="subtitle-h2">Administrar Membresías</h2>
        </div>
        <div className="membresias-container">
          <button
            className="crear-plan-btn"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Crear Plan
          </button>
          <button
            className="crear-plan-btn"
            onClick={() => setIsAssignModalOpen(true)}
          >
            Asignar Plan
          </button>
          <ModalHU
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          >
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            {successMessage && (
              <SuccessMessage>{successMessage}</SuccessMessage>
            )}
            <form className="form-container" onSubmit={handleMembresiaSubmit}>
              <h2 className="center">Crear Plan</h2>

              <label>Nombre</label>
              <FormGroup
                type="string"
                value={nombreMembresia}
                onChange={(e) => setNombreMembresia(e.currentTarget.value)}
                placeholder="Nombre"
              />
              <label>Descripción</label>
              <FormGroup
                type="string"
                value={descripcionMembresia}
                onChange={(e) => setDescripcionMembresia(e.currentTarget.value)}
                placeholder="Descripción"
              />
              <label>Clases por mes</label>
              <FormGroup
                type="string"
                value={clasesMes}
                onChange={(e) => setClasesMes(e.currentTarget.value)}
                placeholder="Clases por mes"
              />
              <label>Precio en pesos argentinos</label>
              <FormGroup
                type="number"
                value={precioMembresia}
                onChange={(e) =>
                  setPrecioMembresia(parseInt(e.currentTarget.value))
                }
                placeholder="Precio en pesos"
              />
              <label>Actividades</label>
              <select
                className="select-membresias"
                onChange={(e) => setActividades(e.currentTarget.value)}
              >
                <option value="">Seleccione una actividad</option>
                <option>Gimnasio con pesas</option>
                <option>Zumba</option>
                <option>Aeróbico</option>
                <option>Crossfit</option>
              </select>
              <label>Aviso de renovación</label>
              <select
                className="select-membresias"
                onChange={(e) => setAvisoVencimiento(e.currentTarget.value)}
              >
                <option>No</option>
                <option>Si</option>
              </select>
              <input
                type="submit"
                className="form__submit mt9"
                value="Guardar"
              />
            </form>
          </ModalHU>
          <ModalHU
            isOpen={isAssignModalOpen}
            onClose={() => setIsAssignModalOpen(false)}
          >
            <h2 className="center">Asignar Plan</h2>
            <form onSubmit={handleAssignSubmit}>
              <label className="ejercicio-rutina">Seleccionar usuario:</label>
              <div className="select-container">
                <select
                  id="select"
                  name="usuario"
                  required
                  value={usuarioSeleccionado}
                  onChange={(e) =>
                    setUsuarioSeleccionado(parseInt(e.target.value))
                  }
                >
                  <option value="">Seleccione un usuario</option>
                  {usuarios.map((usuario, index) => (
                    <option
                      value={usuario.idUsuario}
                      key={`${usuario.idUsuario}+${index}`}
                    >
                      {usuario.nombreUsuario}
                    </option>
                  ))}
                </select>
              </div>
              <label className="ejercicio-rutina">Seleccionar membresía:</label>
              <div className="select-container">
                <select
                  id="select"
                  name="membresia"
                  required
                  value={membresiaSeleccionada}
                  onChange={(e) =>
                    setMembresiaSeleccionada(parseInt(e.target.value))
                  }
                >
                  <option value="">Seleccione una membresía</option>
                  {membresias.map((membresia, index) => (
                    <option
                      value={membresia.idMembresia}
                      key={`${membresia.idMembresia}+${index}`}
                    >
                      {membresia.nombreMembresia}
                    </option>
                  ))}
                </select>
              </div>
              <label className="ejercicio-rutina">Cantidad de meses:</label>
              <div className="select-container">
                <select
                  id="select"
                  onChange={(e) => setMeses(e.currentTarget.value)}
                >
                  <option value="">Cantidad de meses del plan</option>
                  <option>1</option>
                  <option>3</option>
                  <option>6</option>
                  <option>12</option>
                </select>
              </div>
              <button className="form__submit mt9" type="submit">
                Asignar membresía
              </button>
            </form>
          </ModalHU>
        </div>
        <div className="">
          <h2 className="center">Planes</h2>
          <table className="table-desktop mt9">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Vigencia</th>
                <th>Precio</th>
                <th>Actividades</th>
                <th>Aviso de renovación</th>
              </tr>
            </thead>
            <tbody>
              {membresias &&
                membresias.map((membresia, index) => (
                  <tr key={index}>
                    <td>{membresia.nombreMembresia}</td>
                    <td>{membresia.descripcionMembresia}</td>
                    <td>{membresia.clasesMes}</td>
                    <td>${membresia.precioMembresia}</td>
                    <td>{membresia.actividades}</td>
                    <td>{membresia.avisoVencimiento ? "Si" : "No"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
