import React, { useRef, useState, useEffect } from 'react';
import Select from 'react-select';

const MusicPlayer = () => {
	const [currentSong, setCurrentSong] = useState('song1.mp3');
	const [isPlaying, setIsPlaying] = useState(false);
	const audioRef = useRef(null);

	const songs = [
		{ value: 'song1.mp3', label: 'Beginning Of The Journey' },
		{ value: 'song2.mp3', label: 'Hyrule Field Main Theme' },
		{ value: 'song3.mp3', label: 'Meeting The Maidens' },
	];

	useEffect(() => {
		audioRef.current = new Audio(`/audios/${currentSong}`);
		audioRef.current.volume = 0.2;
		audioRef.current.loop = true;

		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.src = '';
			}
		};
	}, [currentSong]);

	useEffect(() => {
		if (isPlaying) {
			audioRef.current
				.play()
				.catch(error => console.error('Error playing audio:', error));
		} else {
			audioRef.current.pause();
		}
	}, [isPlaying, currentSong]);

	const playPause = () => {
		setIsPlaying(!isPlaying);
	};

	const handleChange = selectedOption => {
		setIsPlaying(false);
		setCurrentSong(selectedOption.value);
		// We'll start playing in the next render cycle
		setTimeout(() => setIsPlaying(true), 0);
	};

	const customStyles = {
		control: provided => ({
			...provided,
			fontSize: '16px',
		}),
		menu: provided => ({
			...provided,
			fontSize: '16px',
		}),
	};

	return (
		<div className='flex flex-row gap-2 text-sm font-inter'>
			<button
				className='uppercase font-bold text-slate-100 cursor-pointer'
				onClick={playPause}
			>
				{isPlaying ? 'Pause' : 'Play'}
			</button>
			<div style={{ touchAction: 'manipulation' }}>
				<Select
					options={songs}
					onChange={handleChange}
					value={songs.find(song => song.value === currentSong)}
					classNamePrefix='select'
					styles={customStyles}
				/>
			</div>
		</div>
	);
};

export default MusicPlayer;
