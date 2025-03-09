"use client";

import React, { ReactNode, useState } from "react";
import { useDeleteCategory } from "~/api/category";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

type Props = {
  categoryId: string;
  children: ReactNode;
};

export const CategorDelete = ({ categoryId, children }: Props) => {
  const [open, setOpen] = useState(false);
  const { trigger, isMutating: loading } = useDeleteCategory();

  const onDelete = async () => {
    try {
      await trigger(categoryId);
      setOpen(false);
    } catch {}
  };
  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger onClick={() => setOpen(true)}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/80"
            onClick={onDelete}
            disabled={loading}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
