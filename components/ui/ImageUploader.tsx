"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "./Icon";

interface ImageUploaderProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxFiles?: number;
}

/**
 * Компонент для загрузки изображений с конвертацией в Base64.
 * @param {string[]} value Список текущих изображений (Base64)
 * @param {Function} onChange Колбэк при изменении списка
 * @param {number} maxFiles Максимальное количество файлов
 */
export function ImageUploader({ value, onChange, maxFiles = 4 }: ImageUploaderProps) {
  const t = useTranslations("submit");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxFiles - value.length;
    if (remainingSlots <= 0) return;

    setLoading(true);
    const newImages: string[] = [];

    const processFile = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    try {
      const filesToProcess = Array.from(files).slice(0, remainingSlots);
      for (const file of filesToProcess) {
        const base64 = await processFile(file);
        newImages.push(base64);
      }
      onChange([...value, ...newImages]);
    } catch (error) {
      console.error("Error processing images:", error);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <div className="image-uploader">
      <div className="image-grid">
        {value.map((img, i) => (
          <div key={i} className="image-preview">
            <img src={img} alt="Preview" />
            <button
              type="button"
              className="image-remove"
              onClick={() => removeImage(i)}
            >
              <Icon name="close" size={14} />
            </button>
          </div>
        ))}

        {value.length < maxFiles && (
          <button
            type="button"
            className={`image-add ${loading ? "loading" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            {loading ? (
              <Icon name="loader" size={24} className="animate-spin" />
            ) : (
              <>
                <Icon name="plus" size={24} />
                <span>{t("field_photos_hint")}</span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        hidden
      />
      <p className="image-hint">
        {t("field_photos_limit", { max: maxFiles })}
      </p>

      <style jsx>{`
        .image-uploader {
          width: 100%;
        }
        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 12px;
          margin-bottom: 8px;
        }
        .image-preview {
          position: relative;
          aspect-ratio: 1;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border);
        }
        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .image-remove {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        .image-remove:hover {
          background: rgba(0, 0, 0, 0.7);
        }
        .image-add {
          aspect-ratio: 1;
          border-radius: var(--radius-md);
          border: 2px dashed var(--border-3);
          background: var(--bg-2);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: var(--text-3);
          cursor: pointer;
          transition: all 0.2s;
          padding: 8px;
          text-align: center;
          font-size: 11px;
        }
        .image-add:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: var(--accent-low);
        }
        .image-add.loading {
          cursor: not-allowed;
          opacity: 0.7;
        }
        .image-hint {
          font-size: 12px;
          color: var(--text-4);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
