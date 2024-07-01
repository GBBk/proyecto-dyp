import ReactDOM from "react-dom/client";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoutes from "./routes/ProtectedRoutes.tsx";
import { AuthProvider } from "./auth/AuthProvider.tsx";
import "./stylesheets/index.css";
import AdminRoutes from "./routes/AdminRoutes.tsx";
import Perfil from "./pages/user/Perfil.tsx";
import Modal from "react-modal";
import RutinaUsuario from "./pages/user/RutinaUsuario.tsx";
import Entrenamientos from "./pages/user/Entrenamientos.tsx";
import App from "./App.tsx";
import Mensajes from "./pages/Mensajes.tsx";
import Progreso from "./pages/user/Progreso.tsx";
import ContenidoFitness from "./pages/ContenidoFitness.tsx";
import Membresia from "./pages/user/Membresia.tsx";

Modal.setAppElement("#root");

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/deporte-y-salud/*",
    element: <ProtectedRoutes />,
    children: [
      {
        path: "",
        element: <App />,
      },
      {
        path: "perfil",
        element: <Perfil />,
      },
      {
        path: "rutina",
        element: <RutinaUsuario />,
      },
      {
        path: "entrenamientos",
        element: <Entrenamientos />,
      },
      {
        path: "progreso",
        element: <Progreso />,
      },
      {
        path: "mensajes",
        element: <Mensajes />,
      },
      {
        path: "contenido-fitness",
        element: <ContenidoFitness />,
      },
      {
        path: "membresia",
        element: <Membresia />,
      },
      {
        path: "*",
        element: <AdminRoutes />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
