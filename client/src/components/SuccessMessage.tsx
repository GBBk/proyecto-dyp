interface SuccessMessageProps {
  children: React.ReactNode;
}

export default function SuccessMessage({ children }: SuccessMessageProps) {
  return (
    <div className="success">
      <p className="success-message">{children}</p>
    </div>
  );
}
