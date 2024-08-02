export default function ScrollingText() {
	return (
		<div className='fixed inset-0 flex items-center -rotate-12 select-none'>
			<div className='relative'>
				<div className='bg-white/0 animate-horizontal-scroll flex items-center gap-8 w-max px-8'>
					<h1 className='shrink-0 text-white text-10xl font-light'>
						Tyson Skakun
					</h1>
					<h2 className='shrink-0 text-white text-8xl italic font-light'>
						Build
					</h2>
					<h2 className='shrink-0 text-transparent text-12xl font-bold italic outline-text'>
						Something
					</h2>
					<h2 className='shrink-0 text-white text-12xl font-bold'>
						Different
					</h2>
					<h2 className='shrink-0 text-white text-9xl font-light italic'>
						Get
					</h2>
					<h2 className='shrink-0 text-white text-9xl font-medium'>
						UP
					</h2>
				</div>
				<div className='absolute top-0 left-0 bg-white/0 animate-horizontal-scroll-2 flex items-center gap-8 px-8 w-max'>
					<h1 className='shrink-0 text-white text-10xl font-light'>
						Tyson Skakun
					</h1>
					<h2 className='shrink-0 text-white text-8xl italic font-light'>
						Build
					</h2>
					<h2 className='shrink-0 text-transparent text-12xl font-bold italic outline-text'>
						Something
					</h2>
					<h2 className='shrink-0 text-white text-12xl font-bold'>
						Different
					</h2>
					<h2 className='shrink-0 text-white text-9xl font-light italic'>
						Get
					</h2>
					<h2 className='shrink-0 text-white text-9xl font-medium'>
						UP
					</h2>
				</div>
			</div>
		</div>
	);
}
