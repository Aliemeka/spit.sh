"use client";

import { FC } from "react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useBillingActions } from "@/hooks/useBillingActions";

const UnpaidActions: FC<{ projectSlug: string }> = ({ projectSlug }) => {
  const { openPortal, switchToFree, pending } = useBillingActions(projectSlug);

  return (
    <div className='flex flex-wrap gap-2'>
      <button
        type='button'
        onClick={openPortal}
        disabled={pending !== null}
        className='rounded-full bg-fuchsia-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-700 disabled:opacity-60'
      >
        {pending === "portal" ? "Opening…" : "Pay now"}
      </button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant='outline'
            className='rounded-full'
            disabled={pending !== null}
          >
            {pending === "switch" ? "Switching…" : "Switch to Free"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Switch to the Free plan?</AlertDialogTitle>
            <AlertDialogDescription>
              Your Pro subscription will be cancelled. Your links keep working,
              but Free limits apply from now on.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Pro on hold</AlertDialogCancel>
            <AlertDialogAction onClick={switchToFree}>
              Switch to Free
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UnpaidActions;
