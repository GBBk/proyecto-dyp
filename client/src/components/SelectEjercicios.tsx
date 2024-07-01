import React, { useState, useEffect } from "react";
import { Ejercicios } from "../types/types"; // Asegúrate de importar correctamente tu tipo Ejercicios

interface SelectEjerciciosProps {
  options: Ejercicios[];
  onChange: (selectedId: number) => void;
}

const SelectEjercicios: React.FC<SelectEjerciciosProps> = ({
  options,
  onChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<Ejercicios[]>(options);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = options.filter((option) =>
      option.nombreEjercicio.toLowerCase().includes(searchTerm)
    );
    setFilteredOptions(filtered);
  };

  return (
    <div className="select-container-cr">
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar ejercicio..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <select
        id="select"
        name="idEjercicio"
        required
        onChange={(e) => onChange(parseInt(e.target.value))}
      >
        <option value="">Seleccione un ejercicio</option>
        {filteredOptions.map((ejercicio) => (
          <option key={ejercicio.idEjercicio} value={ejercicio.idEjercicio}>
            {ejercicio.nombreEjercicio}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectEjercicios;
