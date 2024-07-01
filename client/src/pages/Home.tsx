import "../stylesheets/home.css";
import NavBar from "../components/NavBar";
import Calculadora from "../components/Calculadora";

const Home: React.FC = () => {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main className="home">
        <div className="subtitle">
          <h2 className="subtitle-h2">Deporte y Salud</h2>
        </div>
        <Calculadora />
      </main>
    </>
  );
};

export default Home;
