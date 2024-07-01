import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import NavBar from "../../components/NavBar";
import { API_URL } from "../../auth/constants";
import "../../stylesheets/progreso.css";

interface SeriesRepsData {
  nombreRutina: string;
  totalSeries: number;
  totalReps: number;
}

interface TopEjerciciosData {
  nombreEjercicio: string;
  totalVecesRealizado: number;
}

const Progreso: React.FC = () => {
  const [seriesRepsData, setSeriesRepsData] = useState<SeriesRepsData[]>([]);
  const [topEjerciciosData, setTopEjerciciosData] = useState<
    TopEjerciciosData[]
  >([]);
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = userData.idUsuario;

  useEffect(() => {
    fetchSeriesReps();
    fetchTopEjercicios();
  }, []);

  const fetchSeriesReps = async () => {
    try {
      const response = await fetch(`${API_URL}/seriesReps/${userId}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await response.json();

      const processedData = processData(data.body.seriesReps);
      setSeriesRepsData(processedData);
      renderChart(processedData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTopEjercicios = async () => {
    try {
      const response = await fetch(`${API_URL}/topEjercicios/${userId}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await response.json();

      setTopEjerciciosData(data.body.topEjercicios);
    } catch (error) {
      console.log(error);
    }
  };

  const processData = (data) => {
    const groupedData = {};

    // Agrupar por nombre de rutina y sumar series y repeticiones
    data.forEach((item) => {
      if (!groupedData[item.nombreRutina]) {
        groupedData[item.nombreRutina] = {
          nombreRutina: item.nombreRutina,
          totalSeries: 0,
          totalReps: 0,
        };
      }

      const [seriesString, repsString] = item.seriesReps.split(" de ");
      const series = parseInt(seriesString, 10);
      const reps = repsString.split("-").map((rep) => parseInt(rep, 10));

      groupedData[item.nombreRutina].totalSeries += series;
      groupedData[item.nombreRutina].totalReps += reps.reduce(
        (acc, rep) => acc + rep,
        0
      );
    });

    // Convertir a un array para el gráfico
    return Object.values(groupedData);
  };

  const renderChart = (data: SeriesRepsData[]) => {
    const ctx = document.getElementById("combinedChart") as HTMLCanvasElement;
    if (!ctx || data.length === 0) return;

    const labels = data.map((item) => item.nombreRutina);
    const seriesData = data.map((item) => item.totalSeries);
    const repsData = data.map((item) => item.totalReps);

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total de Series",
            data: seriesData,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
          {
            label: "Total de Repeticiones",
            data: repsData,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      },
    });
  };

  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        <div className="subtitle">
          <h2 className="subtitle-h2">Progreso</h2>
        </div>

        <div>
          <h2 className="center">Series y repeticiones</h2>
          <div
            style={{ maxWidth: "1300px", margin: "auto" }}
            className="chart-container"
          >
            <canvas id="combinedChart" width="400" height="200"></canvas>
          </div>
        </div>

        <div>
          <div className="contenido-container">
            <h2 className="center">Top 3 Ejercicios Más Realizados</h2>
            <div className="top-ejercicios-container">
              {topEjerciciosData.map((ejercicio, index) => (
                <div key={index} className="ejercicio-item">
                  <span className="ejercicio-nombre">
                    {ejercicio.nombreEjercicio}
                  </span>
                  <span className="ejercicio-total">
                    {ejercicio.totalVecesRealizado} veces
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Progreso;
