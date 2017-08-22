import React from 'react';
import UiForm from './UiForm';

export default ({ grid, player }) => {
	return (
		<div className="panel scoreboard">
			<UiForm
				iconClass="potion"
				title="Health"
				value={player.health}
				/>
			<UiForm
				iconClass={`back-${grid.dungeonLevel}`}
				title="Zone"
				value={grid.dungeonLevel}
				/>
			<UiForm
				iconClass="weapon"
				title={"Weapon"}
				value={`${player.weapon.name} (DMG: ${player.weapon.damage})`}
				/>
			<UiForm
				iconClass="player"
				title="Level"
				value={Math.floor(player.xp / 100)}
				/>
			<UiForm
				iconClass="triangle"
				title="XP to level up"
				value={100 - player.xp % 100}
				/>
		</div>
	);
};
