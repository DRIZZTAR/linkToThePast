import { Loader, PerformanceMonitor } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Perf } from 'r3f-perf';
import { Suspense, useState } from 'react';
import { Experience } from './components/Experience';
import { UI } from './components/UI';
import {
	DepthOfField,
	EffectComposer,
	DotScreen,
	Vignette,
	ColorAverage,
	Sepia,
} from '@react-three/postprocessing';
import { Analytics } from '@vercel/analytics/react';
import { BlendFunction } from 'postprocessing';
// import { XR, createXRStore } from '@react-three/xr';
import { color } from 'three/examples/jsm/nodes/Nodes.js';

// const store = createXRStore();

function App() {
	const [dpr, setDpr] = useState(1.5);
	const [xrSupported, setXrSupported] = useState(false);

	const containerStyles = {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		background: 'rgba(0, 0, 0, 1)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 1000,
	};

	const barStyles = {
		background: '#F7D850',
		borderRadius: '10px',
		color: '#333',
		overflow: 'hidden',
	};

	const dataStyles = {
		textAlign: 'center',
		fontFamily: 'inter, sans-serif',
		fontSize: '16px',
		fontWeight: '500',
		color: '#fefefe',
	};

	// // Check if XR is supported
	// navigator.xr?.isSessionSupported('immersive-vr').then(supported => {
	// 	setXrSupported(supported);
	// });

	// const handleEnterAR = () => {
	// 	if (xrSupported) {
	// 		store.enterAR();
	// 	} else {
	// 		alert('No XR hardware found.');
	// 	}
	// };

	return (
		<>
			{/* <button
				className='absolute top-2 right-24 z-[1002] text-gray-400 p-2 border border-gray-200/50 rounded-md cursor-pointer font-inter hover:text-gray-200 hover:border-gray-200/70 transition-all'
				onClick={handleEnterAR}
			>
				Enter AR
			</button> */}
			<UI />
			<Loader
				containerStyles={containerStyles}
				barStyles={barStyles}
				dataStyles={dataStyles}
				dataInterpolation={p => `Loading ${p.toFixed(2)}%`}
				initialState={active => active}
			/>
			<Canvas shadows camera={{ position: [-0.5, 2, 4], fov: 35 }}>
				<Perf display={true} position='bottom-left' />
				<PerformanceMonitor
					onIncline={() => setDpr(2)}
					onDecline={() => setDpr(1)}
				>
					{/* <XR store={store}> */}
						<group position-y={0.1}>
							<Suspense fallback={null}>
								<Experience />
							</Suspense>
						</group>
					{/* </XR> */}
					<EffectComposer>
						<Vignette eskil={true} offset={0.6} darkness={2} />
						{/* <ColorAverage
							blendFunction={BlendFunction.OVERLAY} // blend mode
						/>{' '} */}
						{/* Metal page effect*/}
						{/* <Sepia blendFunction={BlendFunction.OVERLAY} /> */}
					</EffectComposer>
				</PerformanceMonitor>
			</Canvas>
			<Analytics />
		</>
	);
}

export default App;
