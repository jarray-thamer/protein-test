// ImagesUpload.jsx
import { PlusIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export const ImagesUpload = ({
  setSelectedImg,
  value,
  onChange,
  disabled,
  onRemove,
}) => {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (!value) return;

    const initialPreviews = Array.isArray(value)
      ? value.map(createPreview)
      : [createPreview(value)];

    setPreviews(initialPreviews);

    function createPreview(item) {
      if (typeof item === "string") {
        return { url: item };
      }
      if (item instanceof File) {
        return { url: URL.createObjectURL(item) };
      }

      return item;
    }
  }, [value]);

  const handleChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files || []);

      if (!files.length) return;

      const newPreviews = files.map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));

      setPreviews((prev) => {
        const updated = [...prev, ...newPreviews];

        onChange(updated.map((p) => p.file || p));
        return updated;
      });
    },
    [onChange]
  );

  const handleRemove = useCallback(
    (index) => (e) => {
      e.preventDefault();
      e.stopPropagation();

      setPreviews((prev) => {
        const updated = prev.filter((_, i) => i !== index);
        const removed = prev[index];

        if (removed?.isNew) {
          URL.revokeObjectURL(removed.url);
        } else if (removed?.url) {
          onRemove?.(removed.url);
        }

        onChange(updated.map((p) => p.file || p.url));
        return updated;
      });
    },
    [onChange, onRemove]
  );

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
        id="gallery-images-upload"
        multiple
      />

      <div className="flex flex-wrap gap-4">
        {previews.map((preview, index) => {
          return (
            <div
              onClick={() => setSelectedImg({ url: preview?.url || "" })}
              key={preview?.url || ""}
              className="relative w-32 h-32 border rounded-lg group"
            >
              <img
                src={preview?.url || ""}
                alt={`Preview ${index}`}
                className="object-cover w-full h-full rounded-lg"
              />
              <button
                onClick={handleRemove(index)}
                className="absolute p-1 transition-opacity bg-white rounded-full shadow-sm opacity-0 -top-2 -right-2 group-hover:opacity-100 hover:bg-gray-100"
                type="button"
              >
                <XIcon className="w-4 h-4 text-red-500" />
              </button>
            </div>
          );
        })}

        <label
          htmlFor="gallery-images-upload"
          className="flex flex-col items-center justify-center w-32 h-32 gap-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
        >
          <PlusIcon className="w-6 h-6 text-gray-600" />
          <p className="text-sm text-gray-600">Add images</p>
        </label>
      </div>
    </div>
  );
};
