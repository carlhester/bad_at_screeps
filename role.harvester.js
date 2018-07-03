var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy == 0) {
            var nearestPile = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            var piles = creep.room.find(FIND_DROPPED_RESOURCES);
            var largestPile = 0 
            
            if (piles) { 
                for (pile in piles){
                    if (piles[pile].energy > largestPile) { 
                        target = piles[pile];
                        largestPile = piles[pile].energy;
                    }
                }
            }

            if (nearestPile.energy > 100) { 
                target = nearestPile;
            }


            if(target) {
                if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
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
                if(targets == 0){
                    var targets = creep.room.find(FIND_STRUCTURES, { 
                        filter: (structure) => { 
                            return (structure.structureType == STRUCTURE_CONTAINER)
                            && _.sum(structure.store) < structure.storeCapacity;
                        }
                    })
                }


                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else if (creep.carry.energy > 0){ 
                    var result = creep.upgradeController(creep.room.controller)
                    if (result == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                }
                }

        }

    };


module.exports = roleHarvester;
