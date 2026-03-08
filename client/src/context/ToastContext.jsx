import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3500,
    );
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              padding: "12px 20px",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 14,
              color: "#fff",
              background:
                t.type === "error"
                  ? "#ef4444"
                  : t.type === "warning"
                    ? "#f59e0b"
                    : "#10b981",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              animation: "slideIn 0.3s ease",
            }}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
