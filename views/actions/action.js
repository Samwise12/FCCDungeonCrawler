import { batchActions } from 'redux-batched-actions';
import random from 'lodash/random';

import * as t from '../constants/action-types';
import createGrid from '../components/create-grid';
import populateEntities from '../components/create-entities';

export function createLevel(level) {	
	return {
		type: t.CREATE_LEVEL,
		payload: populateEntities(createGrid(), level)
	};
}
export function setDungeonLevel(payload) {
	return {
		type: t.SET_DUNGEON_LEVEL,
		payload
	};
}

function changeEntity(entity, coords) {
	return {
		type: t.CHANGE_ENTITY,
		payload: { entity, coords }
	};
}

function addXP(payload) {
	return {
		type: t.ADD_XP,
		payload
	};
}

function changePlayerPosition(payload) {
	return {
		type: t.CHANGE_PLAYER_POSITION,
		payload
	};
}

function modifyHealth(payload) {
	//debugger;
	return {
		type: t.MODIFY_HEALTH,
		payload
	};
}

function addWeapon(payload) {
	return {
		type: t.ADD_WEAPON,
		payload
	};
}

export default (vector) => {
	return (dispatch, getState) => {
		const { grid, player } = getState();

		// cache some useful variables
		const [ x, y ] = grid.playerPosition.slice(0); // get current location
		const [ vectorX, vectorY ] = vector; // get direction modifier
		const newPosition = [vectorX + x, vectorY + y]; // define where we're moving to
		const newPlayer = grid.entities[y][x];
		const destination = grid.entities[y + vectorY][x + vectorX]; // whats in the cell we're heading to
		// store the actions in array to be past to batchActions
		const actions = [];

		// move the player unless destination is an enemy or a '0' cell
		if (destination.type && destination.type !== 'enemy' && destination.type !== 'boss') {
			actions.push(
				changeEntity({ type: 'floor' }, [x, y]),
				changeEntity(newPlayer, newPosition),
				changePlayerPosition(newPosition)
			);
		}
		switch (destination.type) {
			case 'boss':
			case 'enemy': {
				const playerLevel = Math.floor(player.xp / 100);
				// player attacks enemy
				const enemyDamageTaken = Math.floor(player.weapon.damage * random(1, 1.3) * playerLevel);
				destination.health -= enemyDamageTaken;

				if (destination.health > 0) {
					// enemy attacks player
					const playerDamageTaken = Math.floor(random(4, 7) * destination.level);

					actions.push(
						changeEntity(destination, newPosition),
						modifyHealth(player.health - playerDamageTaken),
					);

					if (player.health - playerDamageTaken <= 0) {
						// player dies
						alert('YOU DIED!!!')
						dispatch(modifyHealth(100));
						setTimeout(() => dispatch(setDungeonLevel('death')), 250);						
						setTimeout(() => dispatch(batchActions([
						createLevel(1), setDungeonLevel(1)
						])),
						8000);
						return;
					}
				}

				if (destination.health <= 0) {
					// the fight is over and the player has won
					// add XP and move the player
					if (destination.type === 'boss') {
						actions.push(
							addXP(10),
							changeEntity({ type: 'floor'}, [x, y]),
							changeEntity(newPlayer, newPosition),
							changePlayerPosition(newPosition)							
						);
						alert('YOU WON!!!')
						setTimeout(() => dispatch(setDungeonLevel('victory')), 250);						
						setTimeout(() => dispatch(batchActions([
						 createLevel(1), setDungeonLevel(1)
						])),
						8000);
					} else {
						actions.push(
							addXP(10),
							changeEntity({ type: 'floor'}, [x, y]),
							changeEntity(newPlayer, newPosition),
							changePlayerPosition(newPosition)							
						);
					}
				}
				break;
			}
			case 'exit':
				setTimeout(() => dispatch(batchActions([
					setDungeonLevel(grid.dungeonLevel + 1),
					createLevel(grid.dungeonLevel + 1)
				])), 3000);
				setTimeout(() => dispatch(setDungeonLevel(`transit-${grid.dungeonLevel + 1}`)), 250);
				break;
			case 'potion':
				actions.push(
					modifyHealth(player.health + 30),
				);
				break;
			case 'weapon':
				actions.push(
					addWeapon(destination),
				);
				break;
			default:
				break;
		}
		dispatch(batchActions(actions));
	};
};
