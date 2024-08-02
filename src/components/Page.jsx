import { useCursor, useHelper, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import {
	BoxGeometry,
	Vector3,
	Uint16BufferAttribute,
	Float32BufferAttribute,
	Color,
	Bone,
	MeshStandardMaterial,
	Skeleton,
	SkinnedMesh,
	SkeletonHelper,
	SRGBColorSpace,
} from 'three';
import { degToRad, MathUtils } from 'three/src/math/MathUtils.js';
import { pages, pageAtom } from './UI.jsx';
import { easing } from 'maath';
import { useAtom } from 'jotai';

// Constants

const easingFactor = 0.8; // Y axis
const easingFactorFold = 0.3; // X axis
const insideCurveStrength = 0.16;
const outsideCurveStrength = 0.08;
const turningCurveStrentgh = 0.19;
const emissiveIntensityPower = 0.3;
const openedPageSpread = 1.5;

const whiteColor = new Color('white');
const emissiveColor = new Color('orange');

const PAGE_WIDTH = 1.28; // 4:3 aspect ratio
const PAGE_HEIGHT = 1.73; // 4:3 aspect ratio
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 30; // NUmber of bones
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

const pageGeometry = new BoxGeometry(
	PAGE_WIDTH,
	PAGE_HEIGHT,
	PAGE_DEPTH,
	PAGE_SEGMENTS,
	2
);

pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

const position = pageGeometry.attributes.position;
const vertex = new Vector3();
const skindIndexes = [];
const skinWeights = [];

for (let i = 0; i < position.count; i++) {
	// all vertices
	vertex.fromBufferAttribute(position, i); // get the vertex
	const x = vertex.x; // get the x position of the vertex

	const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH)); // get the skin index
	let skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH; // get the skin weight
	skindIndexes.push(skinIndex, skinIndex + 1, 0, 0);
	skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
}

pageGeometry.setAttribute(
	'skinIndex',
	new Uint16BufferAttribute(skindIndexes, 4)
);

pageGeometry.setAttribute(
	'skinWeight',
	new Float32BufferAttribute(skinWeights, 4)
);

const pageMaterials = [
	new MeshStandardMaterial({ color: whiteColor }),
	new MeshStandardMaterial({ color: '#111' }),
	new MeshStandardMaterial({ color: whiteColor }),
	new MeshStandardMaterial({ color: whiteColor }),
];

pages.forEach(page => {
	useTexture.preload(`/textures/${page.front}.jpg`);
	useTexture.preload(`/textures/${page.back}.jpg`);
	useTexture.preload(`/textures/overlayRoughness.jpg`);
});

export default function Page({
	number,
	front,
	back,
	page,
	opened,
	bookClosed,
	...props
}) {
	const [picture, picture2, pictureRoughness] = useTexture([
		`/textures/${front}.jpg`,
		`/textures/${back}.jpg`,
		...(number === 0 || number === pages.length - 1
			? [`/textures/overlayRoughness.jpg`]
			: []),
	]);

	picture.colorSpace = picture2.colorSpace = SRGBColorSpace;

	const group = useRef();
	const turnedAt = useRef(0);
	const lastOpened = useRef(opened);

	const skinnedMeshRef = useRef();

	const manualSkinnedMesh = useMemo(() => {
		const bones = [];
		for (let i = 0; i <= PAGE_SEGMENTS; i++) {
			let bone = new Bone();
			bones.push(bone);
			if (i === 0) {
				bone.position.x = 0;
			} else {
				bone.position.x = SEGMENT_WIDTH;
			}
			if (i > 0) {
				bones[i - 1].add(bone); // attach bone to the previous bone
			}
		}

		const skeleton = new Skeleton(bones);

		const materials = [
			...pageMaterials,
			new MeshStandardMaterial({
				color: whiteColor,
				map: picture,
				...(number === 0
					? {
							roughnessMap: pictureRoughness,
					  }
					: {
							roughness: 0.3,
							metalness: 0.3,
							
					  }),
				emissive: emissiveColor,
				emissiveIntensity: 0,
			}),
			new MeshStandardMaterial({
				color: whiteColor,
				map: picture2,
				...(number === pages.length - 1
					? {
							roughnessMap: pictureRoughness,
					  }
					: {
							roughness: 0.3,
							metalness: 0.3,
					  }),
				emissive: emissiveColor,
				emissiveIntensity: 0,
			}),
		];
		const mesh = new SkinnedMesh(pageGeometry, materials);
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		mesh.frustumCulled = false;
		mesh.add(skeleton.bones[0]);
		mesh.bind(skeleton);
		return mesh;
	}, []);

	// useHelper(skinnedMeshRef, SkeletonHelper, 'red');

	useFrame((_, delta) => {
		if (!skinnedMeshRef.current) {
			return;
		}

		// Controls the emissive intensity of highlighted pages
		const emissiveIntensity = highlighted ? emissiveIntensityPower : 0;
		skinnedMeshRef.current.material[4].emissiveIntensity =
			skinnedMeshRef.current.material[5].emissiveIntensity =
				MathUtils.lerp(
					skinnedMeshRef.current.material[4].emissiveIntensity,
					emissiveIntensity,
					0.1
				);

		if (lastOpened.current !== opened) {
			turnedAt.current = +new Date();
			lastOpened.current = opened;
		}

		// Calculate the turning time
		let turningTime = Math.min(400, new Date() - turnedAt.current) / 400;
		turningTime = Math.sin(turningTime * Math.PI);

		let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2;
		if (!bookClosed) {
			targetRotation += degToRad(number * openedPageSpread); // page spread
		}

		// Rotate the bones
		const bones = skinnedMeshRef.current.skeleton.bones;
		for (let i = 0; i < bones.length; i++) {
			const target = i === 0 ? group.current : bones[i];

			// Calculate the intensity of the inside curve
			const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;

			// Calculate the intensity of the outside curve
			const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0;

			// Calculate the intensity of the turning curve
			const turningIntensity =
				Math.sin(i * Math.PI * (1 - bones.length)) * turningTime;

			// Rotate the bones and curve of pages
			let rotationAngle =
				insideCurveStrength * insideCurveIntensity * targetRotation -
				outsideCurveStrength * outsideCurveIntensity * targetRotation +
				turningCurveStrentgh * turningIntensity * targetRotation;
			let foldRotationAngle = degToRad(Math.sign(targetRotation) * 2);
			if (bookClosed) {
				if (i === 0) {
					rotationAngle = targetRotation;
					foldRotationAngle = 0;
				} else {
					rotationAngle = 0;
				}
			}
			easing.dampAngle(
				target.rotation,
				'y',
				rotationAngle,
				easingFactor,
				delta
			);
			const foldIntensity =
				i > 8
					? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) *
					  turningTime
					: 0;
			easing.dampAngle(
				target.rotation,
				'x',
				foldRotationAngle * foldIntensity,
				easingFactorFold,
				delta
			);
		}
	});

	const [_, setPage] = useAtom(pageAtom);
	const [highlighted, setHighlighted] = useState(false);
	useCursor(highlighted);

	return (
		<group
			{...props}
			ref={group}
			onPointerEnter={e => {
				e.stopPropagation();
				setHighlighted(true);
			}}
			onPointerLeave={e => {
				e.stopPropagation();
				setHighlighted(false);
			}}
			onClick={e => {
				e.stopPropagation();
				setPage(opened ? number : number + 1);
				setHighlighted(false);
			}}
		>
			<primitive
				object={manualSkinnedMesh}
				ref={skinnedMeshRef}
				position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
			/>
		</group>
	);
}
