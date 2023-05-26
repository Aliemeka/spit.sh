import MainLayout from "@/layouts/MainLayout";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <MainLayout>
      <header className='pt-24 md:pt-24'>
        <h1 className='font-bold text-center text-3xl md:text-5xl xl:text-6xl mt-10 lg:mt-12 mb-4 lg:mb-6 w-5/6 max-w-xl mx-auto'>
          Shorter URLs with extra{" "}
          <span className='italic text-fuchsia-600 dark:text-fuchsia-500'>
            magic
          </span>
          ✨
        </h1>
        <p className='text-center max-w-lg mx-auto md:text-xl w-3/5 mb-8 text-zinc-700 dark:text-zinc-300'>
          Unleash the magic: Get more out of your links with analytics and
          tracking.
        </p>
        <div className='flex justify-center'>
          <Link
            className='inline-flex rounded-full bg-fuchsia-600 px-8 py-3 text-sm font-semibold text-white transition hover:-rotate-6 hover:scale-110 focus:outline-none focus:ring active:bg-indigo-500'
            href='/sigin'
          >
            Get started{" "}
            {/* <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              fill='currentColor'
              viewBox='0 0 256 256'
              className='ml-1'
            >
              <path d='M48,64a8,8,0,0,1,8-8H72V40a8,8,0,0,1,16,0V56h16a8,8,0,0,1,0,16H88V88a8,8,0,0,1-16,0V72H56A8,8,0,0,1,48,64ZM184,192h-8v-8a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0v-8h8a8,8,0,0,0,0-16Zm56-48H224V128a8,8,0,0,0-16,0v16H192a8,8,0,0,0,0,16h16v16a8,8,0,0,0,16,0V160h16a8,8,0,0,0,0-16ZM219.31,80,80,219.31a16,16,0,0,1-22.62,0L36.68,198.63a16,16,0,0,1,0-22.63L176,36.69a16,16,0,0,1,22.63,0l20.68,20.68A16,16,0,0,1,219.31,80Zm-54.63,32L144,91.31l-96,96L68.68,208ZM208,68.69,187.31,48l-32,32L176,100.69Z'></path>
            </svg> */}
          </Link>
        </div>
      </header>
      <section className='pt-4 max-w-7xl mx-auto px-12'>
        {/* <hr className='border-b border-b-fuchsia-400/10 dark:border-fuchsia-300/10 max-w-xs mx-auto shadow-sm shadow-fuchsia-300/50' /> */}
        <h2 className='font-medium text-center text-xl md:text-2xl mt-8 mb-4 lg:mb-6 w-5/6 max-w-xl mx-auto'>
          Create a magic link ✨
        </h2>
        <div className='relative max-w-sm mx-auto focus-within:ring-offset-2 rounded-md focus-within:ring-offset-transparent focus-within:ring-1 focus-within:ring-fuchsia-200'>
          <label htmlFor='UserEmail' className='sr-only'>
            {" "}
            Email{" "}
          </label>

          <input
            type='text'
            inputMode='url'
            id='url'
            placeholder='myfancylongwebsitename.com'
            className='w-full rounded-md px-4 border-gray-200 py-2.5 pe-10 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm focus:outline-none'
          />

          <span className='absolute inset-y-0 end-0 grid w-10 place-content-center'>
            <button
              type='button'
              className='rounded-full bg-fuchsia-600 p-0.5 text-white hover:bg-fuchsia-700 dark:bg-fuchsia-500 dark:text-gray-800 dark:hover:bg-fuchsia-600'
            >
              <span className='sr-only'>Submit</span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                fill='currentColor'
                viewBox='0 0 256 256'
                className='ml-1'
              >
                <path d='M48,64a8,8,0,0,1,8-8H72V40a8,8,0,0,1,16,0V56h16a8,8,0,0,1,0,16H88V88a8,8,0,0,1-16,0V72H56A8,8,0,0,1,48,64ZM184,192h-8v-8a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0v-8h8a8,8,0,0,0,0-16Zm56-48H224V128a8,8,0,0,0-16,0v16H192a8,8,0,0,0,0,16h16v16a8,8,0,0,0,16,0V160h16a8,8,0,0,0,0-16ZM219.31,80,80,219.31a16,16,0,0,1-22.62,0L36.68,198.63a16,16,0,0,1,0-22.63L176,36.69a16,16,0,0,1,22.63,0l20.68,20.68A16,16,0,0,1,219.31,80Zm-54.63,32L144,91.31l-96,96L68.68,208ZM208,68.69,187.31,48l-32,32L176,100.69Z'></path>
              </svg>
            </button>
          </span>
        </div>
      </section>
    </MainLayout>
  );
}
