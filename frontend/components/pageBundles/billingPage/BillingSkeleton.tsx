const BillingSkeleton = () => (
  <div className='max-w-4xl space-y-6 animate-pulse'>
    <div className='rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950'>
      <div className='space-y-3 p-6'>
        <div className='h-3 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800' />
        <div className='h-6 w-32 rounded-full bg-zinc-200 dark:bg-zinc-800' />
        <div className='h-3 w-56 rounded-full bg-zinc-200 dark:bg-zinc-800' />
      </div>
      <div className='grid gap-6 border-t border-zinc-200 p-6 sm:grid-cols-3 dark:border-zinc-800'>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='space-y-2'>
            <div className='h-3 w-28 rounded-full bg-zinc-200 dark:bg-zinc-800' />
            <div className='h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800' />
          </div>
        ))}
      </div>
    </div>
    <div className='h-96 w-full rounded-2xl border border-zinc-200 bg-white md:w-1/2 dark:border-zinc-800 dark:bg-zinc-950' />
  </div>
);

export default BillingSkeleton;
