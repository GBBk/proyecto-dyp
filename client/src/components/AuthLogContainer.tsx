import { Link } from "react-router-dom";
import { DYPLogo } from "./DYPLogo";

type AuthLogContainer = {
  children: React.ReactNode;
  title: string;
  value: string;
  handleSubmit: (e: React.ChangeEvent<HTMLFormElement>) => void;
  registered: boolean;
};

export function AuthLogContainer({
  children,
  title,
  value,
  handleSubmit,
  registered,
}: AuthLogContainer) {
  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="form">
        <DYPLogo />
        <h2 className="form__h2">{title}</h2>

        <div className="form__container">
          {children}
          <input type="submit" className="form__submit" value={value} />
        </div>
        {registered ? (
          <div>
            <p className="form__p">¿No tienes cuenta?</p>
            <Link to="/signup" className="form__link">
              Regístrate aquí
            </Link>
          </div>
        ) : (
          <div>
            <p className="form__p">¿Ya tienes una cuenta?</p>
            <Link to="/" className="form__link">
              Inicia sesion aquí
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}
