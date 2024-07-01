import { useState } from "react";
import "../stylesheets/calculadora.css";

interface Porcentajes {
  porcentaje: number;
  peso: number;
  reps: number;
}

export default function Calculadora() {
  const [peso, setPeso] = useState(0);
  const [reps, setReps] = useState(0);
  const [ejercicio, setEjercicio] = useState(0);
  const [pesoTotal, setPesoTotal] = useState(0);
  const [porcentajes, setPorcentajes] = useState<Porcentajes[]>([]);

  const calcularRM = () => {
    let rm = 0;
    if (ejercicio === 1) {
      rm = peso * 0.03 * reps + peso;
    } else if (ejercicio === 2) {
      rm = peso * (36 / (37 - reps));
    } else if (ejercicio === 3) {
      rm = peso * reps ** 0.1;
    }
    setPesoTotal(rm);

    // Calcular porcentajes
    const nuevosPorcentajes = [
      { porcentaje: 100, peso: rm, reps: 1 },
      { porcentaje: 95, peso: rm * 0.95, reps: 2 },
      { porcentaje: 90, peso: rm * 0.9, reps: 4 },
      { porcentaje: 85, peso: rm * 0.85, reps: 6 },
      { porcentaje: 80, peso: rm * 0.8, reps: 8 },
      { porcentaje: 75, peso: rm * 0.75, reps: 10 },
      { porcentaje: 70, peso: rm * 0.7, reps: 12 },
      { porcentaje: 65, peso: rm * 0.65, reps: 16 },
      { porcentaje: 60, peso: rm * 0.6, reps: 20 },
      { porcentaje: 55, peso: rm * 0.55, reps: 24 },
      { porcentaje: 50, peso: rm * 0.5, reps: 30 },
    ];
    setPorcentajes(nuevosPorcentajes);
  };

  const redondearADos = (num: number) => {
    return Math.round(num * 100) / 100;
  };

  return (
    <div className="contenido-container-calculadora">
      <h2 className="center">Calculadora de RM</h2>

      <div className="calculadora">
        <label>Ejercicio</label>
        <select
          onChange={(e) => {
            setEjercicio(parseInt(e.target.value));
          }}
        >
          <option value="0">Seleccione un ejercicio</option>
          <option value="1">Press de banca</option>
          <option value="2">Sentadillas</option>
          <option value="3">Peso muerto</option>
        </select>
        <label>Levantamiento en kilos</label>
        <input
          type="number"
          value={peso}
          onChange={(e) => setPeso(parseInt(e.target.value))}
        />
        <label>Repeticiones</label>
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(parseInt(e.target.value))}
        />
        <button onClick={calcularRM}>Calcular</button>
      </div>
      {pesoTotal !== 0 && (
        <>
          <h2 style={{ marginTop: "30px" }} className="center">
            Tu máximo de una repetición (1RM) es de {redondearADos(pesoTotal)}{" "}
            kg!
          </h2>
          <table style={{ textAlign: "center" }} className="table-desktop mt9">
            <thead>
              <tr>
                <th>Porcentaje de 1RM</th>
                <th>Levanta peso</th>
                <th>Repeticiones de 1RM</th>
              </tr>
            </thead>
            <tbody>
              {porcentajes.map((p, index) => (
                <tr key={index}>
                  <td>{p.porcentaje}%</td>
                  <td>{redondearADos(p.peso)} kg</td>
                  <td>{p.reps}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginBottom: "15px", textAlign: "center" }}>
            Recuerda que estos son números aproximados, los pesos pueden variar
            según la persona y otros factores. Estos cálculos también sirven
            para ejercicios similares de los mismos músculos.
          </p>
          <p style={{ marginBottom: "15px", textAlign: "center" }}>
            NO funciona para músculos pequeños, como hombros, triceps y biceps.
          </p>
        </>
      )}
      <div className="info-calculadora">
        <h2>
          Por qué utilizar una calculadora de pesos en mis entrenamientos?
        </h2>
        <ol>
          <ul>
            <h3>Optimización del Entrenamiento</h3>
            <li>
              <strong>Determinación de Cargas Adecuadas:</strong> Te permite
              seleccionar pesos adecuados para tus series de entrenamiento,
              evitando subcargas que no estimulen adecuadamente tus músculos ni
              sobre cargas que puedan llevar a lesiones.
            </li>
            <li>
              <strong>Ajuste de Progresiones:</strong> Facilita el seguimiento y
              ajuste de tu progresión en el levantamiento de pesas, asegurando
              que estás desafiando constantemente a tus músculos de manera
              efectiva para promover el crecimiento y la fuerza muscular.
            </li>
          </ul>
          <ul>
            <h3>Planificación y Objetivos Claros</h3>
            <li>
              <strong>Planificación de Programas de Entrenamiento:</strong>{" "}
              Ayuda en la planificación de programas de entrenamiento más
              efectivos y estructurados, asegurando una progresión gradual y
              segura a lo largo del tiempo.
            </li>
            <li>
              <strong>Establecimiento de Metas:</strong> Permite establecer
              metas claras y alcanzables basadas en tus capacidades actuales y
              potenciales de levantamiento de pesas.
            </li>
          </ul>
          <ul>
            <h3>Mejora de la Técnica y Rendimiento</h3>
            <li>
              <strong>Enfoque en la Técnica Correcta:</strong> Al conocer tus
              límites y capacidades máximas, puedes enfocarte en mejorar la
              técnica para maximizar el rendimiento y prevenir lesiones.
            </li>
            <li>
              <strong>Medición de Progresos:</strong> Proporciona una forma
              objetiva de medir tu progreso a lo largo del tiempo, lo que puede
              motivarte y ayudarte a mantener la consistencia en tu
              entrenamiento.
            </li>
          </ul>
          <ul>
            <h3>Seguridad y Prevención de Lesiones</h3>
            <li>
              <strong>Reducción del Riesgo de Lesiones:</strong> Al utilizar
              pesos adecuados y progresar de manera controlada, reduces el
              riesgo de lesiones relacionadas con el levantamiento de pesas.
            </li>
          </ul>
          <ul>
            <h3>Eficiencia en el Tiempo de Entrenamiento</h3>
            <li>
              <strong>Optimización del Tiempo:</strong> Permite optimizar tu
              tiempo de entrenamiento al seleccionar y ajustar rápidamente las
              cargas adecuadas para cada ejercicio, maximizando así la
              eficiencia y efectividad de tus sesiones.
            </li>
          </ul>
        </ol>
      </div>
    </div>
  );
}
