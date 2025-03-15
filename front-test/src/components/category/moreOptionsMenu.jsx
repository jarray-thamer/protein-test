import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash, PlusIcon } from "lucide-react";
import { deleteCategory } from "@/helpers/categories/communicator";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import { Input } from "@/components/ui/input.jsx";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addSubCategory } from "@/helpers/subcategories/communicator.js";

const formSchema = z.object({
  designation: z.string().min(1, "Designation required"),
});

export function MoreOptionsMenu({
  categoryId,
  onDelete,
  onAddSubCategory,
  setSubCategoriesCount,
}) {
  const [open, setOpen] = React.useState(false);
  const handleDelete = async () => {
    try {
      await deleteCategory({ id: categoryId });
      toast.success("Category deleted successfully!");
      onDelete(categoryId); // Call the callback to update state
    } catch (error) {
      toast.error(error.message);
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { designation: "" },
  });

  const onSubmit = async (data) => {
    const res = await addSubCategory(data, categoryId);
    onAddSubCategory(categoryId, res.data);
    setSubCategoriesCount((prev) => prev + 1);
    setOpen(false); // Close dialog on success
    setMenuOpen(false);
  };
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link to={`update/${categoryId}`}>
            <DropdownMenuItem>
              <Edit className="w-4 h-4 mr-2" />

              <span>Edit</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault(); // Prevent menu from closing
              setOpen(true); // Open dialog
            }}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            <span>Add Subcategory</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleDelete}>
            <Trash className="w-4 h-4 mr-2" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add SubCategory</DialogTitle>
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
                <Button type="submit" className="px-3">
                  Create SubCategory
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
