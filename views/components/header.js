import React from 'react';

export default ({level}) => {
	return (
		<div className="strip">
			<h1>
				<span
					className={`title title-${level}`}
					>
				THE GRID
				</span> - RogueCrawler
			</h1>
		</div>
	);
};
