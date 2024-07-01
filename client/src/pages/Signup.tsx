import "../stylesheets/sign.css";
import { AuthLogContainer } from "../components/AuthLogContainer.tsx";
import { FormGroup } from "../components/FormGroup.tsx";
import { useState } from "react";
import { useAuth } from "../auth/useAuth.tsx";
import { Navigate } from "react-router-dom";
import { API_URL } from "../auth/constants.ts";
import { type AuthResponseError } from "../types/types.ts";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage.tsx";

export default function Signup() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const auth = useAuth();

  const goTo = useNavigate();

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          nombreUsuario: nombreUsuario,
          email: email,
          password: password,
        }),
      });
      if (response.ok) {
        setErrorMessage("");
        goTo("/");
      } else {
        const json = (await response.json()) as AuthResponseError;
        setErrorMessage(json.body.error);
        return;
      }
    } catch (error) {
      console.log(error);
    }

    if (auth.isAuthenticated) {
      return <Navigate to="/home"></Navigate>;
    }
  }

  return (
    <>
      <AuthLogContainer
        title={"Regístrate"}
        value={"Crear cuenta"}
        handleSubmit={handleSubmit}
        registered={false}
      >
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <FormGroup
          type={"text"}
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
          placeholder={"Nombre y apellido"}
        />
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
    </>
  );
}
