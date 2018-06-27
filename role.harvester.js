var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if (sources.length > 0) { 
                var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
            }

            var harvest_target = 0;

            for (harvester in harvesters) { 
                harvester.memory.harvest_target = harvest_target;
                var harvest_target += 1;
                if (harvest_target == sources.length) { 
                    var harvest_target = 0;
                }
            }



            if(creep.harvest(sources[creep.memory.harvest_target]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.harvest_target], {visualizePathStyle: {stroke: '#ffaa00'}});
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
                creep.drop(RESOURCE_ENERGY)
                console.log(creep.name + ' dropped energy')
            }
        }
    }
};

module.exports = roleHarvester;