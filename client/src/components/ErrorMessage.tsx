interface ErrorMessageProps {
  children: React.ReactNode;
}

export default function SuccessMessage({ children }: ErrorMessageProps) {
  return (
    <div className="error">
      <p className="error-message">{children}</p>
    </div>
  );
}
