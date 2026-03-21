"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";
import { UserCircleIcon, ArrowRightIcon } from "@phosphor-icons/react";

interface Props {
  onSubmit: (values: {
    first_name: string;
    last_name: string;
  }) => Promise<void>;
  isLoading: boolean;
}

const validationSchema = Yup.object({
  first_name: Yup.string()
    .required("First name is required")
    .max(20, "Max 20 characters"),
  last_name: Yup.string()
    .required("Last name is required")
    .max(25, "Max 25 characters"),
});

export default function PersonalDetailsStep({ onSubmit, isLoading }: Props) {
  const { data: session } = useSession();
  const name = session?.user?.name || "";
  const [first_name, last_name] = name.split(" ");
  const formik = useFormik({
    initialValues: { first_name: first_name || "", last_name: last_name || "" },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    if (session?.user?.name) {
      const [first_name, last_name] = session.user.name.split(" ");
      formik.setValues({
        first_name: first_name || "",
        last_name: last_name || "",
      });
    } // Run this effect whenever the session user name changes
  }, [session?.user?.name]); // Run this effect whenever the session user name changes

  return (
    <div>
      <UserCircleIcon
        weight='duotone'
        size={56}
        className='text-fuchsia-500 mx-auto mb-4'
      />
      <h1 className='text-xl font-bold text-white text-center mb-1'>
        Welcome to Spit.sh
      </h1>
      <p className='text-sm text-zinc-400 text-center mb-8'>
        Let&apos;s set up your profile first.
      </p>

      <form onSubmit={formik.handleSubmit} className='flex flex-col gap-5'>
        <div>
          <label className='block text-xs font-medium text-zinc-400 mb-1.5'>
            First Name
          </label>
          <input
            name='first_name'
            value={formik.values.first_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder='Ada'
            className='w-full rounded-xl border border-zinc-700 bg-transparent px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500'
          />
          {formik.touched.first_name && formik.errors.first_name && (
            <p className='text-red-400 text-xs mt-1'>
              {formik.errors.first_name}
            </p>
          )}
        </div>

        <div>
          <label className='block text-xs font-medium text-zinc-400 mb-1.5'>
            Last Name
          </label>
          <input
            name='last_name'
            value={formik.values.last_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder='Lovelace'
            className='w-full rounded-xl border border-zinc-700 bg-transparent px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500'
          />
          {formik.touched.last_name && formik.errors.last_name && (
            <p className='text-red-400 text-xs mt-1'>
              {formik.errors.last_name}
            </p>
          )}
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='mt-2 w-full flex items-center justify-center gap-2 bg-fuchsia-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-fuchsia-700 focus:outline-none focus:ring focus:ring-offset-2 focus:ring-fuchsia-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {isLoading ? "Saving…" : "Continue"}
          {!isLoading && <ArrowRightIcon size={32} weight='bold' />}
        </button>
      </form>
    </div>
  );
}
