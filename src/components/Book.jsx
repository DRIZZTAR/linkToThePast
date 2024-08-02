import { useAtom } from 'jotai';
import Page from './Page';
import { pages, pageAtom } from './UI';
import { useState, useEffect } from 'react';

export const Book = ({ ...props }) => {
	const [page] = useAtom(pageAtom);
	const [delayedPage, setDelayedPage] = useState(page);

	// COntrols page turn delay
	useEffect(() => {
		let timeout;
		const goToPage = () => {
			setDelayedPage(delayedPage => {
				if (page === delayedPage) {
					return delayedPage;
				} else {
					timeout = setTimeout(
						() => {
							goToPage();
						},
						// if page count is greater than 2, set timeout to 50, else set it to 150
						Math.abs(page - delayedPage) > 2 ? 50 : 250
					);
					if (page > delayedPage) {
						return delayedPage + 1;
					}
					if (page < delayedPage) {
						return delayedPage - 1;
					}
				}
			});
		};
		goToPage();
		return () => {
			clearTimeout(timeout);
		};
	}, [page]);

	return (
		<group {...props} rotation-y={-Math.PI / 2}>
			{pages.map((pageData, index) => (
				<Page
					key={index}
					page={delayedPage}
					number={index}
					opened={delayedPage > index}
					bookClosed={
						delayedPage === 0 || delayedPage === pages.length
					}
					{...pageData}
				/>
			))}
		</group>
	);
};
