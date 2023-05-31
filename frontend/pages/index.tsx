import MainLayout from "@/layouts/MainLayout";
// import Image from "next/image";
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
          🪄
        </h1>
        <p className='text-center max-w-lg mx-auto md:text-xl w-3/5 mb-8 text-zinc-700 dark:text-zinc-300'>
          Unleash the magic: Get more out of your links with analytics and
          tracking.
        </p>
        <div className='flex flex-col items-center justify-center sm:flex-row gap-x-6 gap-y-4 sm:gap-y-0'>
          <Link
            className='inline-flex rounded-full bg-fuchsia-600 px-8 py-3 text-sm font-semibold text-white transition hover:rotate-6 hover:scale-110 focus:outline-none focus:ring active:bg-fuchsia-500'
            href='/sigin'
          >
            Get started for free
          </Link>
          <a
            href='/'
            className='inline-flex items-center rounded-full bg-zinc-800 dark:bg-zinc-50 px-8 py-3 text-sm font-semibold text-zinc-100 dark:text-zinc-800 transition hover:-rotate-6 hover:scale-110 focus:outline-none focus:ring active:bg-indigo-500'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              fill='currentColor'
              className='ml-1'
              viewBox='0 0 256 256'
            >
              <path d='M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z'></path>
            </svg>
            Star on GitHub
          </a>
        </div>
      </header>
      <section className='pt-4 max-w-7xl mx-auto px-12'>
        <h2 className='font-medium text-center text-xl md:text-2xl mt-8 mb-4 lg:mb-6 w-5/6 max-w-xl mx-auto'>
          Create a magic link ✨
        </h2>
        <div className='relative max-w-sm mx-auto focus-within:ring-offset-2 rounded-md focus-within:ring-offset-transparent focus-within:ring-1 focus-within:ring-fuchsia-200 focus-within:shadow-lg focus-within:shadow-fuchsia-400/50'>
          <label htmlFor='url' className='sr-only'>
            {" "}
            LongURL{" "}
          </label>

          <input
            type='text'
            inputMode='url'
            name='url'
            id='url'
            placeholder='myfancylongwebsitename.com'
            className='w-full rounded-md px-4 border-gray-200 py-2.5 pe-10 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm focus:outline-none'
          />

          <span className='absolute inset-y-0 end-0 grid w-10 place-content-center'>
            <button
              type='button'
              className='rounded-full bg-fuchsia-600 p-0.5 text-white hover:bg-fuchsia-700 dark:bg-fuchsia-500 dark:text-zinc-200 dark:hover:bg-fuchsia-600'
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
      <section className='pt-12'>
        <div className='mx-auto max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:py-16 lg:px-8'>
          <div className='mx-auto max-w-xl text-center'>
            <h2 className='text-3xl lg:text-5xl font-bold sm:text-4xl'>
              Maximize your marketing{" "}
              <i className='text-fuchsia-600 dark:text-fuchsia-500'>mojo</i>💪🏼
            </h2>

            <p className='mt-4 text-zinc-700 dark:text-zinc-300 md:text-lg w-4/5 mx-auto'>
              Gain an edge with custom links, track performance with robust
              analytics, and generate QR codes among other tricks
            </p>
          </div>

          <div className='mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            <article className='block rounded-xl border border-gray-400 dark:border-gray-800 p-8 shadow-xl transition hover:border-fuchsia-500/10 hover:shadow-fuchsia-500/10'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                className='h-10 w-10 text-fuchsia-500'
                viewBox='0 0 256 256'
              >
                <path d='M197.58,129.06l-51.61-19-19-51.65a15.92,15.92,0,0,0-29.88,0L78.07,110l-51.65,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0l19-51.61,51.65-19a15.92,15.92,0,0,0,0-29.88ZM140.39,163a15.87,15.87,0,0,0-9.43,9.43l-19,51.46L93,172.39A15.87,15.87,0,0,0,83.61,163h0L32.15,144l51.46-19A15.87,15.87,0,0,0,93,115.61l19-51.46,19,51.46a15.87,15.87,0,0,0,9.43,9.43l51.46,19ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z'></path>
              </svg>

              <h2 className='mt-4 text-xl font-bold text-zinc-800 dark:text-zinc-100'>
                Beautiful custom domains
              </h2>

              <p className='mt-1 text-sm text-zinc-700 dark:text-zinc-300'>
                Elevate your brand with exquisite custom domains. Stand out,
                captivate, and unlock new possibilities for your online
                presence.
              </p>
            </article>

            <article className='block rounded-xl border border-gray-400 dark:border-gray-800 p-8 shadow-xl transition hover:border-fuchsia-500/10 hover:shadow-fuchsia-500/10'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                className='h-10 w-10 text-fuchsia-500'
                viewBox='0 0 256 256'
              >
                <path d='M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z'></path>
              </svg>

              <h2 className='mt-4 text-xl font-bold text-zinc-800 dark:text-zinc-100'>
                Realtime analytics
              </h2>

              <p className='mt-1 text-sm text-zinc-700 dark:text-zinc-300'>
                Track clicks in real time: Gain instant insights and optimize
                your campaign performance on the fly!
              </p>
            </article>

            <article className='block rounded-xl border border-gray-400 dark:border-gray-800 p-8 shadow-xl transition hover:border-fuchsia-500/10 hover:shadow-fuchsia-500/10'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                className='h-10 w-10 text-fuchsia-500'
                viewBox='0 0 256 256'
              >
                <path d='M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm0,32H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48ZM200,40H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48Zm-64,72V144a8,8,0,0,1,16,0v32a8,8,0,0,1-16,0Zm80-16a8,8,0,0,1-8,8H184v40a8,8,0,0,1-8,8H144a8,8,0,0,1,0-16h24V144a8,8,0,0,1,16,0v8h24A8,8,0,0,1,216,160Zm0,32v16a8,8,0,0,1-16,0V192a8,8,0,0,1,16,0Z'></path>
              </svg>

              <h2 className='mt-4 text-xl font-bold text-zinc-800 dark:text-zinc-100'>
                QR code generator
              </h2>

              <p className='mt-1 text-sm text-zinc-700 dark:text-zinc-300'>
                Easy create customizable QR codes for your links to make your
                links easier to access with just a scan.
              </p>
            </article>
          </div>

          <div className='mt-12 text-center'>
            <Link
              className='inline-flex rounded-full bg-fuchsia-600 px-8 py-3 text-sm font-semibold text-white transition hover:-rotate-6 hover:scale-110 focus:outline-none focus:ring active:bg-indigo-500'
              href='/sigin'
            >
              Get started today
            </Link>
          </div>
        </div>
      </section>
      <section className='py-6'>
        <div className='max-w-screen-lg mx-auto flex flex-col items-center justify-center p-4 space-y-4 md:p-10 md:px-24 xl:px-48 bg-transparent rounded-lg border shadow-xl border-gray-400 dark:border-gray-800 transition hover:border-fuchsia-500/10 hover:shadow-fuchsia-500/10'>
          <h1 className='text-3xl lg:text-5xl sm:text-4xl font-bold leading-relaxed text-center'>
            Spit.sh is{" "}
            <span className='text-fuchsia-600 dark:text-fuchsia-500'>
              open-source
            </span>{" "}
            🤯
          </h1>
          <p className='pt-2 pb-4 md:text-lg w-4/5 max-w-2xl font-medium text-center text-zinc-700 dark:text-zinc-300'>
            Step into a World of Magic and Efficiency as You Create Shorter
            Links with Spit-sh, Empowering Your Online Presence.
          </p>
          <a
            href=''
            className='inline-flex items-center rounded-full bg-zinc-800 dark:bg-zinc-50 px-8 py-3 text-sm font-semibold text-zinc-100 dark:text-zinc-800 transition hover:-rotate-6 hover:scale-110 focus:outline-none focus:ring active:bg-indigo-500'
          >
            Give us a star on GitHub{" "}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              fill='currentColor'
              className='ml-1'
              viewBox='0 0 256 256'
            >
              <path d='M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z'></path>
            </svg>
          </a>
        </div>
      </section>
    </MainLayout>
  );
}
