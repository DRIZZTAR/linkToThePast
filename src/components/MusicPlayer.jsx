import React, { useRef, useState, useEffect } from 'react';
import Select from 'react-select';


const MusicPlayer = () => {
	const [currentSong, setCurrentSong] = useState('song1.mp3');
	const [isPlaying, setIsPlaying] = useState(false);
	const songRef = useRef(null);

	useEffect(() => {
		songRef.current = new Audio(`/audios/${currentSong}`);
		songRef.current.volume = 0.3;
		songRef.current.loop = true;

		return () => {
			if (songRef.current) {
				songRef.current.pause();
			}
		};
	}, [currentSong]);

	const songs = [
		{ value: 'song1.mp3', label: 'Beginning Of The Journey' },
		{ value: 'song2.mp3', label: 'Hyrule Field Main Theme' },
		{ value: 'song3.mp3', label: 'Meeting The Maidens' },
	];

	const playPause = () => {
		if (isPlaying) {
			songRef.current.pause();
		} else {
			songRef.current
				.play()
				.catch(error => console.error('Error playing audio:', error));
		}
		setIsPlaying(!isPlaying);
	};

	const handleChange = selectedOption => {
		if (songRef.current) {
			songRef.current.pause();
		}
		songRef.current = new Audio(`/audios/${selectedOption.value}`);
		songRef.current.volume = 0.3;
		songRef.current.loop = true;
		if (isPlaying) {
			songRef.current
				.play()
				.catch(error => console.error('Error playing audio:', error));
		}
		setCurrentSong(selectedOption.value);
	};

	useEffect(() => {
		if (isPlaying) {
			songRef.current
				.play()
				.catch(error => console.error('Error playing audio:', error));
		}
	}, [currentSong, isPlaying]);

	return (
		<div className='flex flex-row gap-2 text-sm font-inter'>
			<button
				className='transition-all duration-700uppercase font-bold text-slate-100 cursor-pointer'
				onClick={playPause}
			>
				{isPlaying ? 'Pause' : 'Play'}
			</button>
			<div className=''>
				<Select
					options={songs}
					onChange={handleChange}
					value={songs.find(song => song.value === currentSong)}
					className='basic-single cursor-pointer'
					classNamePrefix='select'
				/>
			</div>
		</div>
	);
};

export default MusicPlayer;
