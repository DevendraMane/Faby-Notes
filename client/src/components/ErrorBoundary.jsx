// src/components/ErrorBoundary.jsx
import { useRouteError } from "react-router-dom";

export const ErrorBoundary = () => {
  const error = useRouteError();
  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <p>
        {error.status} {error.statusText || error.message}
      </p>
      <pre>{error.data}</pre>
    </div>
  );
};
