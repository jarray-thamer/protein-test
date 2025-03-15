import { CategoryCard } from "@/components/category/categoryCard";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCategories } from "@/helpers/categories/communicator";

export const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryDelete = (deletedId) => {
    setCategories(categories.filter((category) => category._id !== deletedId));
  };

  const handleAddSubCategory = (categoryId, newSubCategory) => {
    setCategories((prevCategories) => {
      return prevCategories.map((category) =>
        category._id === categoryId
          ? {
              ...category,
              subCategories: [...category.subCategories, newSubCategory],
            }
          : category
      );
    });
  };

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex-col flex-1 h-full p-8 space-y-2 md:flex">
      <div className="flex items-center justify-between">
        <p>This is the list of the category </p>
        <Button>
          <Link to="new">Ajouter Category</Link>
        </Button>
      </div>
      <div className="space-y-6">
        {categories.map((category) => (
          <CategoryCard
            key={category._id}
            category={category}
            onDelete={handleCategoryDelete}
            onAddSubCategory={handleAddSubCategory}
          />
        ))}
      </div>
    </div>
  );
};
