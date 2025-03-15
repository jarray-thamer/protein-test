import React from "react";
import { XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const ProductVariants = ({ variants = [], setVariants, setValue }) => {
  const handleVariantChange = (index, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = value;
    setVariants(updatedVariants);
    setValue("products", updatedVariants);
  };

  const addVariant = () => {
    setVariants([...variants, ""]);
  };

  const removeVariant = (index) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
    setValue("products", updatedVariants);
  };

  // Fixed the trim check here
  const isLastVariantEmpty =
    variants.length > 0 &&
    (variants[variants.length - 1]?.trim?.() === "" ||
      !variants[variants.length - 1]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-primary">Products in the pack</h3>
      <div className="space-y-3">
        {variants.map((variant, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 transition border rounded-lg border-muted bg-muted/10 hover:bg-muted/20"
          >
            <Input
              placeholder="Product designation"
              value={variant || ""}
              onChange={(e) => handleVariantChange(index, e.target.value)}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeVariant(index)}
              className="shrink-0"
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        disabled={isLastVariantEmpty}
        onClick={addVariant}
        variant="outline"
        size="lg"
      >
        Add Product
      </Button>
    </div>
  );
};

export default ProductVariants;
