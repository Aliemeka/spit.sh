import EmptyState from "@/components/blocks/EmptyState";
import DashboardLayout from "@/layouts/DashboardLayout";
import { linkRoutes } from "@/lib/constants/routes";
import { PlusCircleIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function DashboardPage({
  params,
}: {
  params: { "project-slug": string };
}) {
  const { "project-slug": slug } = params;
  return (
    <DashboardLayout
      title='Home'
      SideButton={
        <Link
          href={`${linkRoutes.newLink(slug)}`}
          className='inline-flex items-center rounded-full bg-fuchsia-600 px-6 py-2.5 text-sm font-semibold text-white gap-x-1.5 hover:bg-fuchsia-700 focus:outline-none focus:ring active:bg-fuchsia-800 transition'
        >
          <span>Create new link</span>
          <PlusCircleIcon size={16} weight='bold' />
        </Link>
      }
    >
      <EmptyState text='No links yet'>
        <button className='inline-flex items-center rounded-full bg-fuchsia-600 px-8 py-3 transition hover:rotate-6 text-sm font-semibold text-white gap-x-1 focus:outline-none focus:ring active:bg-indigo-500 mt-4'>
          <span>Create new link</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            fill='currentColor'
            viewBox='0 0 256 256'
          >
            <path d='M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z'></path>
          </svg>
        </button>
      </EmptyState>
    </DashboardLayout>
  );
}
