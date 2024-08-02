import { atom, useAtom } from 'jotai';
import { pictures } from './bookData.js';
import { useEffect, useState, useRef } from 'react';
import ScrollingText from './ScrollingText.jsx';
import { ChevronFirst, ChevronLast } from 'lucide-react';
import MusicPlayer from './MusicPlayer';

export const pageAtom = atom(0);

const isWebPage = index => {
	return index % 5 === 0 && index !== 0 && index !== pictures.length - 1;
};

const getWebUrl = index => {
	const urls = ['https://www.tysonskakun.dev'];
	return urls[index % urls.length];
};

export const pages = [
	{ front: 'cover', back: pictures[0] },
	...Array.from(
		{ length: Math.floor((pictures.length - 2) / 2) },
		(_, i) => ({
			front: pictures[2 * i + 1],
			back: pictures[2 * i + 2],
			isWebPage: isWebPage(2 * i + 1),
			webUrl: isWebPage(2 * i + 1) ? getWebUrl(2 * i + 1) : undefined,
		})
	),
	{ front: pictures[pictures.length - 1], back: 'back' },
];

export const UI = ({ toggleEnvironment, showEnvironment }) => {
	const [page, setPage] = useAtom(pageAtom);
	const [menuOpen, setMenuOpen] = useState(false);
	const navRef = useRef(null);
	const songRef = useRef(null);
	const [songStarted, setSongStarted] = useState(false);

	const toggleMenu = () => setMenuOpen(!menuOpen);
	const closeMenu = () => setMenuOpen(false);

	const startSong = () => {
		if (!songStarted && songRef.current) {
			songRef.current
				.play()
				.catch(error => console.error('Error playing audio:', error));
			setSongStarted(true);
		}
	};

	const scrollToButton = index => {
		const button = navRef.current.children[index + 1];
		if (button) {
			button.scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
				inline: 'center',
			});
		}
	};

	const goToFirstPage = () => {
		setPage(0);
		scrollToButton(0);
		startSong();
	};

	const goToLastPage = () => {
		setPage(pages.length);
		scrollToButton(pages.length);
		startSong();
	};

	const goToPage = index => {
		setPage(index);
		scrollToButton(index);
		startSong();
	};

	useEffect(() => {
		const handleClickOutside = event => {
			if (
				menuOpen &&
				!event.target.closest('.menu') &&
				!event.target.closest('.hamburger')
			) {
				closeMenu();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, [menuOpen]);

	useEffect(() => {
		const audio = new Audio('/audios/page-flip-01a.mp3');
		songRef.current = new Audio('/audios/zeldaSong1.mp3');
		songRef.current.volume = 0.1;
		songRef.current.loop = true;
		audio.volume = 0.1;
		audio.play();
	}, [page]);

	return (
		<>
			<main className='pointer-events-none select-none z-10 fixed inset-0 flex justify-between flex-col'>
				<div className='p-4 pointer-events-auto text-slate-200'>
					<h1 className='text-4xl font-light'>The Legend Of Zelda</h1>
					<p className='text-xl font-thin'>ゼルダの伝説</p>
					<p className='text-xl font-thin'>A LINK TO THE PAST</p>
					<a
						className='font-thin text-lg'
						href='https://www.TysonSkakun.dev'
						target='_blank'
						rel='noopener noreferrer'
					>
						TysonSkakun.Dev
					</a>
					<MusicPlayer />
				</div>
				<div className='w-full font-inter overflow-auto pointer-events-auto flex justify-center'>
					<div
						ref={navRef}
						className='overflow-auto flex items-center gap-4 max-w-full p-5'
					>
						<button
							className='border-transparent hover:border-white transition-all duration-300 p-2 rounded-full text-lg uppercase shrink-0 border bg-black/30 text-slate-200'
							onClick={goToLastPage}
							title='Back Cover'
						>
							<ChevronLast size={24} />
						</button>
						{pages.map((_, index) => (
							<button
								key={index}
								className={`border-transparent hover:border-white transition-all duration-300 px-4 py-2 rounded-full text-lg uppercase shrink-0 border ${
									index === page
										? 'bg-white/90 text-black'
										: 'bg-black/30 text-slate-200'
								}`}
								onClick={() => goToPage(index)}
							>
								{index === 0 ? 'Cover' : `Page ${index}`}
							</button>
						))}
						<button
							className={`border-transparent font-inter hover:border-white transition-all duration-300 px-4 py-3 rounded-full text-lg uppercase shrink-0 border ${
								page === pages.length
									? 'bg-white/90 text-black'
									: 'bg-black/30 text-slate-200'
							}`}
							onClick={() => goToPage(pages.length)}
						>
							Back Cover
						</button>
						<button
							className='border-transparent hover:border-white transition-all duration-300 p-2 rounded-full text-lg uppercase shrink-0 border bg-black/30 text-slate-200'
							onClick={goToFirstPage}
							title='Front Cover'
						>
							<ChevronFirst size={24} />
						</button>
					</div>
				</div>
			</main>

			<div
				className={`hamburger ${menuOpen ? 'active' : ''}`}
				onClick={toggleMenu}
			>
				<div />
				<div />
				<div />
			</div>
			<div className={`menu ${menuOpen ? 'active' : ''}`}>
				<div className='menu-close' onClick={closeMenu}></div>
				<div className='menu-content p-10'>
					<div className='menu-item font-extrabold'>
						<a
							href='https://www.linkedin.com/in/tyson-skakun-tail/'
							target='_blank'
							rel='noopener noreferrer'
						>
							Hire Me
						</a>
					</div>
					<div className='menu-item font-bold'>
						<a
							href='https://batman-omega.vercel.app/'
							target='_blank'
							rel='noopener noreferrer'
						>
							Batman Issue 01, 2011
						</a>
					</div>
					<div className='menu-item font-bold'>
						<a
							href='https://batman-omega.vercel.app/'
							target='_blank'
							rel='noopener noreferrer'
						>
							Nintendo Power, Special
						</a>
					</div>
				</div>
			</div>
		</>
	);
};
