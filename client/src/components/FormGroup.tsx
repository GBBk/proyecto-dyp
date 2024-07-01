type FormGroup = {
  type: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
};

export function FormGroup({ type, value, onChange, placeholder }: FormGroup) {
  return (
    <div className="form__group">
      <input
        type={type}
        className="form__input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
