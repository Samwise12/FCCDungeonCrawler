import React from 'react';
import { connect } from 'react-redux';

import Game from '../containers/game';
import Ui from '../components/Ui';
import Header from '../components/header';

const App = ({grid, player}) => 
	(
		<div>
			<Header level={grid.dungeonLevel}/>
			<div id="app">
				<Game />
				<div className="sidebar">
					<Ui player={player} grid={grid} />
				</div>
			</div>
		</div>
		)

const mapStateToProps = ({ grid, player }) => {
	return { grid, player };
};

export default connect(mapStateToProps)(App);