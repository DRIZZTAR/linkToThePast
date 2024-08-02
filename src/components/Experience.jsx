import React, { useState } from 'react';
import {
	Environment,
	Float,
	OrbitControls,
	PresentationControls,
	Stage,
	Html,
} from '@react-three/drei';
import { Book } from './Book';

export const Experience = () => {
	const [showEnvironment, setShowEnvironment] = useState(false);

	// const [hidden, set] = useState(false);

	const toggleEnvironment = () => {
		setShowEnvironment(prevState => !prevState);
	};

	return (
		<>
			{/* <Html
				position={[0, 1.4, -1]}
				occlude
				onOcclude={set}
				style={{
					transition: 'all 0.5s',
					opacity: hidden ? 0 : 1,
					transform: `scale(${hidden ? 0.5 : 1})`,
				}}
			>
				<div className='relative'>
					<button
						className='px-4 py-2 bg-slate-700/20 text-white rounded-lg shadow-lg hover:bg-slate-900/40 focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all'
						onClick={toggleEnvironment}
					>
						Environment
					</button>
				</div>
			</Html> */}
			<Float
				rotation-x={-Math.PI / 4}
				floatIntensity={1}
				speed={0.4}
				rotationIntensity={2}
			>
				{/* <PresentationControls
					global
					rotation={[0.13, 0.1, 0]}
					polar={[-3.5, 3.5]}
					azimuth={[-1, 1.75]}
					config={{ mass: 2, tension: 400 }}
					snap={{ mass: 4, tension: 400 }}
				> */}
				<Book position={[0, 0, 0]} />
				<rectAreaLight
					intensity={15}
					width={1.0}
					height={1.3}
					color='#ddddff'
					position={[0, 0.55, -1.55]}
					rotation={[0.1, Math.PI, 0]}
				/>
				{/* </PresentationControls> */}
			</Float>
			<OrbitControls
				makeDefault
				minDistance={2}
				maxDistance={8}
				enableZoom={true}
				enablePan={true}
			/>
			{/* {showEnvironment &&  */}
			<Environment
				preset='city'
				environmentIntensity={0.6}
			/>
			{/* } */}
			<directionalLight
				position={[2, 5, 2]}
				intensity={2}
				castShadow
				shadow-mapSize-width={2048}
				shadow-mapSize-height={2048}
				shadow-bias={-0.0001}
			/>
			<mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
				<planeGeometry args={[100, 100]} />
				<shadowMaterial color={"white"} transparent opacity={0.04} />
			</mesh>
		</>
	);
};
