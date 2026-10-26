"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircleIcon } from "@phosphor-icons/react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import PrimaryButton from "@/components/ui/primary-button";
import NewProjectStep from "@/components/onboarding/NewProjectStep";
import { createWorkspaceAction } from "@/app/actions/workspace";
import { useToast } from "@/hooks/useToast";
import { dashboardRoutes } from "@/lib/constants/routes";

const AddWorkspaceButton = () => {
  const router = useRouter();
  const { toastSuccess, toastError } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: {
    name: string;
    slug: string;
    logo?: string;
  }) => {
    setIsLoading(true);
    try {
      await createWorkspaceAction(values);
      toastSuccess("Workspace created");
      router.push(dashboardRoutes.home);
    } catch {
      toastError("Couldn't create the workspace. Try a different slug.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <PrimaryButton
        onClick={() => setOpen(true)}
        icon={<PlusCircleIcon size={16} weight='bold' />}
      >
        Add workspace
      </PrimaryButton>

      <Dialog open={open} onOpenChange={(next) => !isLoading && setOpen(next)}>
        <DialogContent
          aria-describedby={undefined}
          className='max-w-md rounded-2xl p-8 bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
        >
          <DialogTitle className='sr-only'>Create a workspace</DialogTitle>
          {open && (
            <NewProjectStep
              title='Create a workspace'
              description='Workspaces keep links, analytics and billing separate.'
              backLabel='Cancel'
              onSubmit={handleSubmit}
              onBack={() => setOpen(false)}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddWorkspaceButton;
