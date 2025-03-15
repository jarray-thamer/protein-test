import { XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";

const VariantInput = ({
  variants,
  setVariants,
  setValue,
  type = "variant",
}) => {
  const isNutritional = type === "nutritionalValues";

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
    setValue(type, updatedVariants);
  };

  const addVariant = () => {
    const newVariant = isNutritional
      ? { title: "", value: "" }
      : { title: "", inStock: true };

    setVariants([...variants, newVariant]);
    setValue(type, [...variants, newVariant]);
  };

  const removeVariant = (index) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
    setValue(type, updatedVariants);
  };

  const isLastVariantTitleEmpty =
    variants.length > 0 && !variants[variants.length - 1].title.trim();

  return (
    <div className="">
      <h3 className="text-xl font-semibold text-primary">
        {isNutritional ? "Valeurs Nutritionnelles" : "Goût"}
      </h3>

      {variants.map((variant, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-3 transition border rounded-lg border-muted bg-muted/10 hover:bg-muted/20"
        >
          <Input
            placeholder={isNutritional ? "Nom" : "Titre"}
            value={variant.title}
            onChange={(e) =>
              handleVariantChange(index, "title", e.target.value)
            }
            className="flex-1"
          />

          {isNutritional ? (
            <Input
              placeholder="Valeur"
              value={variant.value}
              onChange={(e) =>
                handleVariantChange(index, "value", e.target.value)
              }
              className="w-1/3"
            />
          ) : (
            <div className="flex items-center gap-2">
              <Switch
                checked={variant.inStock}
                onCheckedChange={(checked) =>
                  handleVariantChange(index, "inStock", checked)
                }
              />
              <span className="text-sm text-muted-foreground">En Stock</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeVariant(index)}
          >
            <XIcon className="w-4 h-4" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        disabled={isLastVariantTitleEmpty}
        size="lg"
        variant="outline"
        onClick={addVariant}
      >
        {isNutritional ? "Ajouter une valeur" : "Ajouter du goût"}
      </Button>
    </div>
  );
};

export default VariantInput;
