import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ChevronUpIcon } from "lucide-react";
import { SubCategoriesList } from "./subCategoriesList";
import { MoreOptionsMenu } from "./moreOptionsMenu";
import { cn } from "@/lib/utils";

export const CategoryCard = ({ category, onDelete, onAddSubCategory }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const [subCategoriesCount, setSubCategoriesCount] = React.useState(
    category.subCategories.length || 0
  );
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-2">
        <div className="flex items-start justify-start">
          <div className="flex-1">
            <div className="flex items-start justify-start space-x-4">
              <div className="flex w-full space-x-4">
                <img
                  className="object-cover rounded-lg"
                  width={200}
                  height={200}
                  src={category.image.url}
                  alt={category.designation}
                />
                <div className="flex flex-col w-full">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-2xl font-bold tracking-wider capitalize">
                        {category.designation}
                      </h3>
                    </div>
                    <MoreOptionsMenu
                      categoryId={category._id}
                      onDelete={onDelete}
                      onAddSubCategory={onAddSubCategory}
                      setSubCategoriesCount={setSubCategoriesCount}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 space-x-4">
              <p className="text-sm italic font-light text-primary">
                Subcategories in total - {subCategoriesCount}
              </p>
              {category.subCategories.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center p-2 transition-colors duration-200 ease-in-out rounded-lg "
                >
                  <ChevronUpIcon
                    className={cn(
                      "transition-transform duration-150 ease-in-out",
                      isExpanded ? "rotate-0" : "rotate-180"
                    )}
                  />
                </Button>
              )}
            </div>
          </div>
        </div>

        {isExpanded && (
          <SubCategoriesList
            setSubCategoriesCount={setSubCategoriesCount}
            subcategoriesArray={category.subCategories}
          />
        )}
      </CardContent>
    </Card>
  );
};
