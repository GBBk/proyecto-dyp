import { format, isWithinInterval, parseISO } from "date-fns";
import { API_URL } from "../auth/constants";
import { es } from "date-fns/locale/es";

export const fetchUsuarios = async (setUsuarios: any) => {
  try {
    const response = await fetch(`${API_URL}/obtenerUsuarios`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    if (!response.ok) {
      throw new Error("Hubo un problema al obtener los datos de usuarios.");
    }
    const data = await response.json();
    setUsuarios(data.body.users);
  } catch (error) {
    console.log(error);
  }
};


export const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", {
    locale: es,
  });
};

interface ICheckMembershipStatus {
  fechaAsignacion: string,
  fechaVencimiento: string,
  setIsActive: (isActive:boolean) => void
}

export const checkMembershipStatus = ({
  fechaAsignacion,
  fechaVencimiento,
  setIsActive
}: ICheckMembershipStatus): void => {
  const now = new Date();
  const isActive = isWithinInterval(now, {
    start: parseISO(fechaAsignacion),
    end: parseISO(fechaVencimiento),
  });
  setIsActive(isActive);
};