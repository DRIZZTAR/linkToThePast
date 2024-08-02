import { Loader, PerformanceMonitor } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Perf } from 'r3f-perf';
import { Suspense } from 'react';
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
import { useState } from 'react';

function App() {
	const [dpr, setDpr] = useState(1.5);

	const containerStyles = {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		background: 'rgba(0, 0, 0, 0)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 1000,
	};

	const innerStyles = {
		width: '300px',
		height: '150px',
		fontSize: '24px',
		fontFamily: 'Inter, sans-serif',
		fontWeight: '700',
		background: 'hsla(324, 22%, 45%, 1)',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-around',
	};

	const barStyles = {
		width: '250px',
		height: '15px',
		background: '#F7D850',
		borderRadius: '10px',
		overflow: 'hidden',
	};

	const dataStyles = {
		textAlign: 'center',
		fontFamily: 'inter, sans-serif',
		fontSize: '16px',
		fontWeight: '500',
		color: '#30c7e9',
	};

	return (
		<>
			<UI />
			<Loader
				containerStyles={containerStyles}
				innerStyles={innerStyles}
				barStyles={barStyles}
				dataStyles={dataStyles}
				dataInterpolation={p => `Loading ${p.toFixed(2)}%`}
				initialState={active => active}
			/>
			<Canvas shadows camera={{ position: [-0.5, 2, 4], fov: 35 }}>
				{/* <Perf display={true} position='bottom-left' /> */}
				<PerformanceMonitor
					onIncline={() => setDpr(2)}
					onDecline={() => setDpr(1)}
				>
					<group position-y={0.1}>
						<Suspense fallback={null}>
							<Experience />
						</Suspense>
					</group>
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
