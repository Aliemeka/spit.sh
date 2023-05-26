import React from "react";

const Navbar = () => {
  return (
    <header className='absolute inset-x-0 z-30'>
      <nav className='flex py-4 md:py-6 px-12 w-full max-w-7xl items-center inset-x-auto justify-between dark:bg-zinc-900 dark:text-zinc-200 mx-auto bg-opacity-20'>
        <h1 className='text-fuchsia-600 dark:text-fuchsia-500 font-bold inline-block text-xl'>
          Spit.sh ✨
        </h1>
        <p>Sign in</p>
      </nav>
    </header>
  );
};

export default Navbar;
