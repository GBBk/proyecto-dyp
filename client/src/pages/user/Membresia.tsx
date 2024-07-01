import { API_URL } from "../../auth/constants";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import { MembresiaUsuario } from "../../types/types";
import { checkMembershipStatus } from "../../services/constants";
import { formatDate } from "../../services/constants";
import "../../stylesheets/membresiaUsuario.css";

export default function Membresia() {
  const [membresia, setMembresia] = useState<MembresiaUsuario>({
    nombreMembresia: "",
    descripcionMembresia: "",
    clasesMes: "",
    actividades: "",
    fechaAsignacion: "",
    fechaVencimiento: "",
  });

  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    fetchMembership();
  }, []);

  const fetchMembership = async () => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData.idUsuario;
    try {
      const response = await fetch(`${API_URL}/membresiaUser/${userId}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!response.ok) {
        throw new Error("Hubo un problema al obtener los datos.");
      }
      const data = await response.json();
      const formattedData = {
        ...data.body.membresia[0],
        fechaAsignacion: formatDate(data.body.membresia[0].fechaAsignacion),
        fechaVencimiento: formatDate(data.body.membresia[0].fechaVencimiento),
      };
      setMembresia(formattedData);
      checkMembershipStatus({
        fechaAsignacion: data.body.membresia[0].fechaAsignacion,
        fechaVencimiento: data.body.membresia[0].fechaVencimiento,
        setIsActive: setIsActive,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        <div className="subtitle">
          <h2 className="subtitle-h2">Membresía</h2>
        </div>
        <div className="contenido-container-memb">
          {membresia && (
            <div className="membresia-container">
              <h2 className="center mt9">Membresía</h2>
              <h3 className="center mt9">{membresia.nombreMembresia}</h3>
              <p className="center mt9">{membresia.descripcionMembresia}</p>
              <p className="center mt9">{membresia.clasesMes} Clases por mes</p>
              <p className="center mt9">Actividad: {membresia.actividades}</p>
              <p className="center mt9">
                Fecha de alta: {membresia.fechaAsignacion}
              </p>
              <p className="center mt9">
                Fecha de vencimiento: {membresia.fechaVencimiento}
              </p>
              <p className={`center mt9 ${isActive ? "active" : "inactive"}`}>
                {isActive
                  ? "La membresía está activa"
                  : "La membresía no está activa"}
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
