export interface AuthResponse {
  body: {
    user: User;
    token: string;
    isAdmin: number;
  }
}

export interface AuthResponseError {
  body: {
    error: string;
  }
}

export interface User {
  idUsuario: number;
  nombreUsuario: string;
  email: string;
}

export interface AccessTokenResponse {
  statusCode: number;
  body: {
    accessToken: string;
  };
  error?: string;
}

export interface EjercicioIdentifier {
  idEjercicio?: number;
  nombreEjercicio: string;
}

export interface Ejercicios extends EjercicioIdentifier {
  bodyPart: string;
  equipo: string;
  imgUrl: string;
  objetivo: string;
  musculosSecundarios: string[];
  instrucciones: string[];
}

export interface EjercicioRutina extends EjercicioIdentifier {
  imgUrl: string;
  seriesReps: string;
}

export interface Rutina {
  idRutina: number;
  nombreRutina: string;
}

export interface RutinaEjercicios extends Rutina {
  ejercicios: EjercicioRutina[];
}


export interface Usuarios {
  idUsuario: number ;
  nombreUsuario: string;
  email: string;
  edad: number;
  dni: number;
  telefono: number;
  direccion: string;
  notas: string;
  membresia: string;
  objetivo: string;
}

export interface EntrenamientosHistorial {
  idHistorial: number;
  idUsuario: number;
  idRutina: number;
  nombreRutina: string;
  notasHistorial: string;
  fechaRegistro: string;
  ejercicios: EjercicioRutina[];
}

export interface Membresia {
  idMembresia: number;
  nombreMembresia: string;
  descripcionMembresia: string;
  precioMembresia: number;
  clasesMes: string;
  actividades: string;
  avisoVencimiento: number;
}

export interface MembresiaUsuario {
  nombreMembresia: string;
  descripcionMembresia: string;
  clasesMes: string;
  actividades: string;
  fechaAsignacion: string;
  fechaVencimiento: string;
}

export interface ModificarRutinaEjercicios extends EjercicioIdentifier{
  seriesReps: string;
}

export interface ModificarRutina {
  idRutina: number;
  nombreRutina: string;
  ejercicios: ModificarRutinaEjercicios[];
}