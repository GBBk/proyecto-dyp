import { useAuth } from "../auth/useAuth";
import ChatInterface from "../components/ChatInterface";
import NavBar from "../components/NavBar";
import NavBarAdmin from "../components/NavBarAdmin";

export default function Mensajes() {
  const { isAdmin } = useAuth();

  return (
    <>
      <header>{isAdmin ? <NavBarAdmin /> : <NavBar />}</header>
      <main style={{ marginTop: "90px" }}>
        <ChatInterface />
      </main>
    </>
  );
}
