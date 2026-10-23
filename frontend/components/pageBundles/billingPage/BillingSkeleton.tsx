const bar = "rounded-full bg-zinc-200 dark:bg-zinc-800";
const panel =
  "rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900";

const BillingSkeleton = () => (
  <div className='mt-4 max-w-4xl space-y-6 md:space-y-10 animate-pulse'>
    <div className={`${panel} space-y-3 p-6`}>
      <div className={`${bar} h-5 w-32`} />
      <div className={`${bar} h-3 w-64`} />
    </div>

    <div className={panel}>
      <div className='px-6 py-5'>
        <div className={`${bar} h-4 w-28`} />
      </div>
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className='space-y-3 border-t border-zinc-200 px-6 py-5 dark:border-zinc-800'
        >
          <div className='size-8 rounded-lg bg-zinc-200 dark:bg-zinc-800' />
          <div className={`${bar} h-3 w-28`} />
          <div className={`${bar} h-2 w-full`} />
        </div>
      ))}
    </div>

    <div className='h-48 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900' />
  </div>
);

export default BillingSkeleton;
