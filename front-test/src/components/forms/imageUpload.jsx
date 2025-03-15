// MainImageUpload.jsx
import { PlusIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export const MainImageUpload = ({ value, onChange, disabled, onRemove }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    if (typeof value?.url === "string") {
      setPreview({ url: value?.url });
    } else if (value instanceof File) {
      setPreview({ url: URL.createObjectURL(value) });
    }
  }, [value]);

  const handleChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const newPreview = {
        url: URL.createObjectURL(file),
      };

      setPreview(newPreview);
      onChange(file);
    },
    [onChange]
  );

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (preview?.isNew) {
      URL.revokeObjectURL(preview.url);
    } else if (preview?.url) {
      onRemove?.(preview.url);
    }

    setPreview(null);
    onChange(null);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
        id="main-image-upload"
      />

      <div className="flex flex-wrap gap-4">
        {preview && (
          <div className="relative w-32 h-32 border rounded-lg group">
            <img
              src={preview.url}
              alt="Main preview"
              className="object-cover w-full h-full rounded-lg"
            />
            <button
              onClick={handleRemove}
              className="absolute p-1 transition-opacity bg-white rounded-full shadow-sm opacity-0 -top-2 -right-2 group-hover:opacity-100 hover:bg-gray-100"
              type="button"
            >
              <XIcon className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}

        {!preview && (
          <label
            htmlFor="main-image-upload"
            className="flex flex-col items-center justify-center w-32 h-32 gap-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <PlusIcon className="w-6 h-6 text-gray-600" />
            <p className="text-sm text-gray-600">Add Main images</p>
          </label>
        )}
      </div>
    </div>
  );
};
