import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { EditIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import {
  deleteSubcategory,
  updateSubcategory,
} from "@/helpers/subcategories/communicator";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";

const formSchema = z.object({
  designation: z.string().min(1, "Designation required"),
});

export const SubCategoriesList = ({
  subcategoriesArray,
  setSubCategoriesCount,
}) => {
  const [subCategories, setSubcategories] = useState(subcategoriesArray);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { designation: "" },
  });

  const handleDeleteSubcategory = async (id) => {
    try {
      await deleteSubcategory(id);
      toast.success("Subcategory deleted successfully!");
      const updatedSubcategories = subCategories.filter(
        (subcategory) => subcategory._id !== id
      );
      setSubcategories(updatedSubcategories);
      setSubCategoriesCount(updatedSubcategories.length);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditClick = (subcategory) => {
    setEditingSubcategory(subcategory);
    form.reset({ designation: subcategory.designation });
    setOpenDialog(true);
  };

  React.useEffect(() => {
    setSubcategories(subcategoriesArray);
  }, [subcategoriesArray]);
  const onSubmit = async (data) => {
    try {
      const res = await updateSubcategory(editingSubcategory._id, data);

      setSubcategories(
        subCategories.map((sc) =>
          sc._id === editingSubcategory._id ? { ...sc, ...res.data } : sc
        )
      );

      toast.success("Subcategory updated successfully!");
      setOpenDialog(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="mt-2">
        {subCategories.map((subCategory, idx) => (
          <div className="flex flex-col" key={subCategory._id}>
            {idx > 0 && <Separator />}
            <div className="flex items-center justify-between p-1 rounded-lg hover:bg-primary-foreground hover:bg-opacity-40">
              <span className="text-sm font-normal tracking-wider text-gray-600 dark:text-gray-300">
                {subCategory.designation}
              </span>
              <DropdownMenu
                open={openMenuId === subCategory._id}
                onOpenChange={(open) =>
                  setOpenMenuId(open ? subCategory._id : null)
                }
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVerticalIcon className="w-4 h-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleEditClick(subCategory)}
                  >
                    <EditIcon className="w-4 h-4 mr-2" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteSubcategory(subCategory._id)}
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update SubCategory</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="e.g Isolate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="px-3">
                  Update SubCategory
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
