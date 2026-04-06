"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

export function ImageUploader({ value, onChange, maxFiles = 5 }: ImageUploaderProps) {
  const t = useTranslations("submit");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;
    const allowed = Array.from(files).slice(0, maxFiles - value.length);
    const urls = await Promise.all(
      allowed.map(f => new Promise<string>(res => {
        const reader = new FileReader();
        reader.onload = e => res(e.target?.result as string);
        reader.readAsDataURL(f);
      }))
    );
    onChange([...value, ...urls]);
  }, [value, onChange, maxFiles]);

  const remove = (i: number) => {
    const next = [...value];
    next.splice(i, 1);
    onChange(next);
  };

  return (
    <div>
      <div
        className={`dropzone${dragOver ? " drag-over" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      >
        <span className="dropzone-icon"><Icon name="upload" size={28} /></span>
        <span className="dropzone-label">{t("field_photos_hint")}</span>
        <span className="dropzone-hint">{t("field_photos_limit", { max: maxFiles })}</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {value.length > 0 && (
        <div className="upload-grid">
          {value.map((url, i) => (
            <div key={i} className="upload-thumb">
              <img src={url} alt="" />
              <button
                type="button"
                className="upload-remove"
                onClick={e => { e.stopPropagation(); remove(i); }}
              >
                <Icon name="close" size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
