import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDumbbell,
  faHouse,
  faComment,
  faUser,
  faPowerOff,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import FaAngleDown from "../components/FaAngleDown";
import { useState, useEffect } from "react";
import "../stylesheets/navbar.css";
import { useAuth } from "../auth/useAuth";
import { Link } from "react-router-dom";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(true);
  const { user, logout } = useAuth();

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const listarElementos = document.querySelectorAll(".menu__item--show");
    const lista = document.querySelector(".menu__link");

    if (lista) {
      const functionLinks = document.querySelectorAll(".menu__link--inside");
      functionLinks.forEach((link) => {
        link.addEventListener("click", () => {
          lista.classList.add("menu__links--show");
        });
      });

      const addClick = () => {
        listarElementos.forEach((element) => {
          element.addEventListener("click", () => {
            const subMenu = element.children[1] as HTMLElement;
            let height = 0;

            element.classList.toggle("menu__item--active");

            if (subMenu.clientHeight === 0) {
              height = subMenu.scrollHeight;
            }

            subMenu.style.height = `${height}px`;
          });
        });
      };

      const deleteStyleHeight = () => {
        listarElementos.forEach((element) => {
          if (element.children[1].getAttribute("style")) {
            element.children[1].removeAttribute("style");
            element.classList.remove("menu__item--active");
          }
        });
      };

      window.addEventListener("resize", () => {
        if (window.innerWidth > 800) {
          deleteStyleHeight();
          if (lista.classList.contains("menu__links--show")) {
            lista.classList.remove("menu__links--show");
          }
        } else {
          addClick();
        }
      });

      if (window.innerWidth <= 800) {
        addClick();
      }

      return () => {
        window.removeEventListener("resize", () => {});
      };
    } else {
      return;
    }
  }, []);

  return (
    <>
      <nav className="menu">
        <section className="menu__container">
          <div className={`menu__desplegable`}>
            <FontAwesomeIcon
              icon={faBars}
              className="fa-solid fa-bars fa-2xl"
              onClick={toggleDropdown}
            />
          </div>
          <a href="/" className="menu__link center">
            <FontAwesomeIcon
              icon={faHouse}
              className="fa-solid fa-house fa-2xl"
            />
          </a>

          <ul className={`menu__links ${isOpen ? "menu__links--show" : ""}`}>
            <li className="menu__item menu__item--show">
              <a href="#" className="menu__link">
                <FontAwesomeIcon
                  icon={faDumbbell}
                  className="fa-solid fa-dumbbell fa-xl"
                />
                <p className="menu__text">Musculación</p>
                <FaAngleDown />
              </a>
              <ul className="menu__nesting">
                <li className="menu__inside">
                  <Link
                    to="/deporte-y-salud/rutina"
                    className="menu__link menu__link--inside i1"
                  >
                    Rutina
                  </Link>
                </li>
                <li className="menu__inside">
                  <Link
                    to="/deporte-y-salud/entrenamientos"
                    className="menu__link menu__link--inside i1"
                  >
                    Entrenamientos
                  </Link>
                </li>
                <li className="menu__inside">
                  <Link
                    to="/deporte-y-salud/progreso"
                    className="menu__link menu__link--inside i1"
                  >
                    Progreso
                  </Link>
                </li>
                <li className="menu__inside">
                  <Link
                    to="/deporte-y-salud/contenido-fitness"
                    className="menu__link menu__link--inside i1"
                  >
                    Contenido Fitness
                  </Link>
                </li>
              </ul>
            </li>

            <li className="menu__item menu__item--show">
              <a href="#" className="menu__link">
                <FontAwesomeIcon
                  icon={faComment}
                  className="fa-solid fa-comment fa-xl"
                />
                <p className="menu__text">Comunidad</p>
                <FaAngleDown />
              </a>
              <ul className="menu__nesting">
                <li className="menu__inside">
                  <Link
                    to="/deporte-y-salud/mensajes"
                    className="menu__link menu__link--inside i2"
                  >
                    Mensajes
                  </Link>
                </li>
                <li className="menu__inside">
                  <a href="#" className="menu__link menu__link--inside i2">
                    Foro
                  </a>
                </li>
              </ul>
            </li>
            <li className="menu__item menu__item--show">
              <a href="#" className="menu__link menu__item--usuario">
                <FontAwesomeIcon
                  icon={faUser}
                  className="fa-solid fa-user fa-xl"
                />
                <p className="menu__text">Perfil</p>
                <FaAngleDown />
              </a>
              <ul className="menu__nesting">
                <li className="menu__inside">
                  <Link
                    to="/deporte-y-salud/membresia"
                    className="menu__link menu__link--inside i3"
                  >
                    Membresía
                  </Link>
                </li>
                <li className="menu__inside">
                  <Link
                    to="/deporte-y-salud/perfil"
                    className="menu__link menu__link--inside i3"
                  >
                    Configuración
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          <div className="menu__user">
            <div>
              <p className="menu__text name">{user?.nombreUsuario}</p>
            </div>
            <a onClick={logout} className="icon">
              <FontAwesomeIcon
                icon={faPowerOff}
                className="fa-solid fa-power-off fa-2x1"
              />
            </a>
          </div>
        </section>
      </nav>
    </>
  );
}
