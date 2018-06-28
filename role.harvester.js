var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy == 0) {
            //const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            var piles = creep.room.find(FIND_DROPPED_RESOURCES);
            var largestPile = 0 
            for (pile in piles){
                if (piles[pile].energy > largestPile) { 
                    target = piles[pile];
                    largestPile = piles[pile].energy;
                }
            }


            if(target) {
                if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }    
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else { 
                    var targets = creep.room.find(FIND_STRUCTURES, { 
                        filter: (structure) => { 
                            return (structure.structureType == STRUCTURE_CONTAINER) && 
                            structure.store[RESOURCE_ENERGY] < structure.energyCapacity;
                        }
                    })

                if(targets.length > 0) { 
                    var result = creep.transfer(targets[creep.memory.transfer_target], RESOURCE_ENERGY)
                    if(result == ERR_NOT_IN_RANGE) { 
                        creep.moveTo(targets[creep.memory.transfer_target], {visualizePathStyle: {stroke: '#ffffff'}});
                    } else if (result == ERR_FULL) { 
                        creep.memory.transfer_target += 1;
                        if (creep.memory.transfer_target == targets.length) { 
                            creep.memory.transfer_target = 0;
                        }

                    }
                }                
                if (creep.carry.energy > 0){ 
                    var result = creep.upgradeController(creep.room.controller)
                    if (result == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            }

        }

    }
};

module.exports = roleHarvester;