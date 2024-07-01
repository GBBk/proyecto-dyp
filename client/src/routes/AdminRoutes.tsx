import { Routes, Route } from "react-router-dom";
import AUsers from "../pages/admin/AUsers";
import Perfil from "../pages/user/Perfil";
import Ejercicios from "../pages/admin/Ejercicios";
import CrearRutina from "../pages/admin/CrearRutina";
import AsignarRutina from "../pages/admin/AsignarRutina";
import GestionarRutinas from "../pages/admin/GestionarRutinas";
import App from "../App";
import Mensajes from "../pages/Mensajes";
import AdminMembresias from "../pages/admin/AdminMembresias";
import ContenidoFitness from "../pages/ContenidoFitness";
import RutinasUsuarios from "../pages/admin/RutinasUsuarios";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/administrar-usuarios" element={<AUsers />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/ejercicios" element={<Ejercicios />} />
      <Route path="/crear-rutina" element={<CrearRutina />} />
      <Route path="/gestionar-rutinas" element={<GestionarRutinas />} />
      <Route path="/asignar-rutina" element={<AsignarRutina />} />
      <Route path="/mensajes" element={<Mensajes />} />
      <Route path="/administrar-membresias" element={<AdminMembresias />} />
      <Route path="/contenido-fitness" element={<ContenidoFitness />} />
      <Route path="/rutina-usuario" element={<RutinasUsuarios />} />
    </Routes>
  );
};

export default AdminRoutes;
