const roleTower = {
    run: function(towers) {
        for (var tower in towers) {
            if (towers[tower]) {
                var closestDamagedStructure = towers[tower].pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
                });
                if (closestDamagedStructure) {
                    towers[tower].repair(closestDamagedStructure);
                }

                var closestHostile = towers[tower].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (closestHostile) {
                    towers[tower].attack(closestHostile);
                }
            }
        }
    },
};

module.exports = roleTower;