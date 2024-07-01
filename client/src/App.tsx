import NavBar from "./components/NavBar";
import "./stylesheets/home.css";
import { useAuth } from "./auth/useAuth";
import Home from "./pages/Home.tsx";
import AdminHome from "./pages/admin/AdminHome.tsx";
import NavBarAdmin from "./components/NavBarAdmin.tsx";

export default function App() {
  const { isAdmin, loading, user } = useAuth();

  if (loading) {
    return <h1 style={{ marginLeft: "50px" }}>Cargando...</h1>;
  }

  return (
    <>
      <header>{isAdmin ? <NavBarAdmin /> : <NavBar />}</header>
      <main>{isAdmin ? <AdminHome /> : <Home />}</main>
    </>
  );
}
