import DashboardLayout from "@/layouts/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout title='Home'>
      <section>
        <header className='flex w-full justify-between'>
          <h1 className='text-2xl text-zinc-900 dark:text-zinc-200 mb-3 font-semibold'>
            Home
          </h1>
          <button className='inline-flex items-center rounded-full bg-fuchsia-600 px-8 py-3 text-sm font-semibold text-white gap-x-1 focus:outline-none focus:ring active:bg-indigo-500'>
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
        </header>
        <div className='flex flex-col justify-center gap-y-4 items-center place-items-center h-[600px] w-full text-zinc-700 dark:text-zinc-300'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='200'
            height='200'
            fill='currentColor'
            viewBox='0 0 256 256'
          >
            <path d='M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,16a87.5,87.5,0,0,1,48,14.28V74L153.83,99.74,122.36,104l-.31-.22L102.38,90.92A16,16,0,0,0,79.87,95.1L58.93,126.4a16,16,0,0,0-2.7,8.81L56,171.44l-3.27,2.15A88,88,0,0,1,128,40ZM62.29,186.47l2.52-1.65A16,16,0,0,0,72,171.53l.21-36.23L93.17,104a3.62,3.62,0,0,0,.32.22l19.67,12.87a15.94,15.94,0,0,0,11.35,2.77L156,115.59a16,16,0,0,0,10-5.41l22.17-25.76A16,16,0,0,0,192,74V67.67A87.87,87.87,0,0,1,211.77,155l-16.14-14.76a16,16,0,0,0-16.93-3l-30.46,12.65a16.08,16.08,0,0,0-9.68,12.45l-2.39,16.19a16,16,0,0,0,11.77,17.81L169.4,202l2.36,2.37A87.88,87.88,0,0,1,62.29,186.47ZM185,195l-4.3-4.31a16,16,0,0,0-7.26-4.18L152,180.85l2.39-16.19L184.84,152,205,170.48A88.43,88.43,0,0,1,185,195Z'></path>
          </svg>
          <p className='text-sm md:text-base'>No links yet</p>
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
        </div>
      </section>
    </DashboardLayout>
  );
}
