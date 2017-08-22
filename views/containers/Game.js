import React, {Component} from 'react';
import { connect } from 'react-redux';
import clamp from 'lodash/clamp';
import throttle from 'lodash/throttle';

import  playerInput, { createLevel,
 setDungeonLevel } from '../actions/action';
import Cell from '../components/cell';
// import { a } from '../actions/action';
// console.log(createLevel)
// console.log(a)

class Grid extends Component {
	constructor(props){
		super(props);
		this.state = {
			viewportWidth: 0,
			viewportHeight: 0
		}
		this.keydown = this.keydown.bind(this);
		this.VP_HEIGHT_OFFSET = 5; // in ems to match elements above this component
		this.VP_MINIMUM_HEIGHT = 22; // in ems
		// set ratios for determining the viewport size
		this.VP_WIDTH_RATIO = 30;
		this.VP_HEIGHT_RATIO = 21;
	}
	componentDidMount() {
		window.addEventListener('keydown', throttle(this.keydown, 100));
	}
	componentWillUnmount() {
		window.removeEventListener('keydown', throttle(this.handleKeyPress, 100));
	}
	componentWillMount() {
		//set the initial viewport size
		const viewportWidth = window.innerWidth / this.VP_WIDTH_RATIO;
		const viewportHeight = Math.max(
			this.VP_MINIMUM_HEIGHT,
			(window.innerHeight / this.VP_HEIGHT_RATIO) - this.VP_HEIGHT_OFFSET
		);
		 // console.log(this.props)
		 this.setState({ viewportWidth, viewportHeight });
		this.props.createLevel();
	}
	keydown(e) {
			// console.log(this)
			if (typeof (this.props.grid.dungeonLevel) === 'number') {
				switch (e.keyCode) {
					// north
					case 38:
					case 87:
						this.props.playerInput([0, -1]);
						break;
					// east
					case 39:
					case 68:
						this.props.playerInput([1, 0]);
						break;
					// south
					case 40:
					case 83:
						this.props.playerInput([0, 1]);
						break;
					// west
					case 37:
					case 65:
						this.props.playerInput([-1, 0]);
						break;
					default:
						return;
				}
			}
		}	
	render(){
		const viewportHeight = this.state.viewportHeight - this.state.viewportHeight % 2;//24
		const viewportWidth = this.state.viewportWidth - this.state.viewportWidth % 2;//20

		const { entities } = this.props.grid;
		const [ x, y ] = this.props.grid.playerPosition;
		//viewpoint
const top = clamp(y - viewportHeight / 2, 0, entities.length - viewportHeight);
// console.log('entities.length:',entities)
const right = Math.max(x + viewportWidth / 2, viewportWidth);
const bottom = Math.max(y + viewportHeight / 2, viewportHeight);
const left = clamp(x - viewportWidth / 2, 0, entities[0].length - viewportWidth);
// console.log('top:',top,'right:',right,'bottom:',bottom,'left:',left)
		// console.log(this.props)
		const newEntities = entities.map((row, i) => row.map((cell, j) => {
			cell.distanceFromPlayer = (Math.abs(y - i)) + (Math.abs(x - j));
			// console.log(cell)
			return cell;
		}));
		const cells = newEntities.filter((row, i) => i >= top && i < bottom)
		.map((row, i) => {
			return (
<div key={i} className="row">
					{
						row
						.filter((row, i) => i >= left && i < right)
						.map((cell, j) => {
							return (
								<Cell
									key={Date.now()+j}
									cell={cell}
									distance={cell.distanceFromPlayer}
									zone={this.props.grid.dungeonLevel}
									visible={this.props.fogMode}
									/>
							);
						})
					}
				</div>
				)
		})

		return(
		<div className='flex-container'>
            {cells}
        </div>         
			)
	}
}

const mapStateToProps = ({ ui, grid, player }) => {
	return { fogMode: ui.fogMode, grid, player };
};

const mapDispatchToProps = (dispatch) => {
	return {
		createLevel: () => dispatch(createLevel()),
		playerInput: (vector) => dispatch(playerInput(vector)),
		setDungeonLevel: (level) => dispatch(setDungeonLevel(level))
	};
};


export default connect(mapStateToProps, mapDispatchToProps)(Grid);
