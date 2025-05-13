import React from "react";

type AlertProps = {
  type: "warning" | "error";
  message: React.ReactNode;
  theme: "light" | "dark";
};

const Alert: React.FC<AlertProps> = ({ type, message, theme = "light" }) => {
  const alertClasses = {
    warning: {
      light: "bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800",
      dark: "bg-yellow-100 border-l-4 border-yellow-600 text-yellow-800"
    },
    error: {
      light: "bg-red-50 border-l-4 border-red-400 text-red-800",
      dark: "bg-red-100 border-l-4 border-red-600 text-red-800"
    }
  };

  return (
    <div 
      className={`p-4 rounded-lg ${alertClasses[type][theme]}`}
      role="alert"
    >
      {message}
    </div>
  );
};

export default Alert;