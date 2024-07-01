import "../stylesheets/sign.css";
import { AuthLogContainer } from "../components/AuthLogContainer.tsx";
import { FormGroup } from "../components/FormGroup.tsx";
import { useState } from "react";
import { useAuth } from "../auth/useAuth.tsx";
import { Navigate, useNavigate } from "react-router-dom";
import { API_URL } from "../auth/constants";
import { AuthResponse } from "../types/types.ts";
import ErrorMessage from "../components/ErrorMessage.tsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombreUsuario] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();

  const goTo = useNavigate();
  const auth = useAuth();

  // Si el usuario ya está autenticado, redirigirlo a la página de inicio
  if (auth.isAuthenticated) {
    return <Navigate to="/deporte-y-salud" />;
  }

  const handleLogin = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          nombreUsuario: nombreUsuario,
          email,
          password,
        }),
      });

      if (response.ok) {
        const json = (await response.json()) as AuthResponse;
        if (json.body.token && json.body.user) {
          login(json.body.user, json.body.token, json.body.isAdmin);
          goTo("/deporte-y-salud");
          setErrorMessage("");
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.body.error);
      }
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      setErrorMessage(error.toString());
    }
  };
  return (
    <AuthLogContainer
      title={"Iniciar Sesión"}
      value={"Iniciar sesión"}
      registered={true}
      handleSubmit={handleLogin}
    >
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <FormGroup
        type={"email"}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={"Correo electrónico"}
      />
      <FormGroup
        type={"password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={"Contraseña"}
      />
    </AuthLogContainer>
  );
}
