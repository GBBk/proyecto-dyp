import "../../stylesheets/home.css";
import NavBarAdmin from "../../components/NavBarAdmin.tsx";
import RutinasUsuarios from "./RutinasUsuarios.tsx";

const AdminHome: React.FC = () => {
  return (
    <>
      <header>
        <NavBarAdmin />
      </header>
      <main className="home">
        <RutinasUsuarios></RutinasUsuarios>
      </main>
    </>
  );
};

export default AdminHome;
