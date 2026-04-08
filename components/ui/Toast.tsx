"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 3000); // Auto-hide after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const iconName = type === "success" ? "check" : type === "error" ? "warning" : "info";
  const bgColor = type === "success" ? "var(--green)" : type === "error" ? "var(--red)" : "var(--accent)";

  return (
    <div className="toast" style={{ backgroundColor: bgColor }}>
      <Icon name={iconName} size={16} />
      <span>{message}</span>
      <button className="toast-close" onClick={() => { setIsVisible(false); onClose(); }}>
        <Icon name="close" size={12} />
      </button>

      <style jsx>{`
        .toast {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          color: white;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          animation: fadeIn 0.3s ease-out, fadeOut 0.3s ease-in 2.7s forwards;
        }
        .toast-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          margin-left: 8px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateX(-50%) translateY(0); }
          to { opacity: 0; transform: translateX(-50%) translateY(20px); }
        }
      `}</style>
    </div>
  );
}
