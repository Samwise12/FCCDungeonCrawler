import { combineReducers } from 'redux';
import grid from './grid';
import player from './player';
import ui from './ui';

const rootReducer = combineReducers({ player, grid, ui });

export default rootReducer;