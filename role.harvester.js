var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, harvesters) {
        if (creep.carry.energy == 0) { 
            creep.memory.collecting = true
        } else if (creep.carry.energy == creep.carryCapacity) { 
            creep.memory.collecting = false
        }


        if (creep.memory.collecting) {
            var nearestPile = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            var piles = creep.room.find(FIND_DROPPED_RESOURCES);
            var largestPile = 0
            var target = nearestPile

            if (nearestPile && nearestPile.energy > 100) {
                target = nearestPile;
            } else if (piles) {
                for (pile in piles) {
                    if (piles[pile].energy > largestPile) {
                        target = piles[pile];
                        largestPile = piles[pile].energy;
                    }
                }
            }

            if (target) {
                if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else { 
                target = creep.pos.findClosestByRange(FIND_STRUCTURES), { 
                    filter: (structure) => { 
                        return (structure.structureType == STRUCTURE_STORAGE);
                    }
                }
                var try_withdraw = creep.withdraw(target, RESOURCE_ENERGY)
                if (try_withdraw == ERR_NOT_IN_RANGE) { 
                    creep.moveTo(target);
                }

            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if (targets.length == 0) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) &&
                            _.sum(structure.store) < structure.storeCapacity;
                    }
                })
            }
            if (targets.length > 0) {
                if (harvesters < 12) { targets[0] = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
                });
                } 
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                var result = creep.upgradeController(creep.room.controller)
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }

    }

};


module.exports = roleHarvester;