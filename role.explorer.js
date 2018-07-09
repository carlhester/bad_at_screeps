var roleExplorer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.room.name == creep.memory.home && creep.carry.energy == 0) { 
            var exits = Game.map.describeExits(creep.room.name)
            var exit_list = [] 
            if (exits['1']){ 
                creep.moveTo(new RoomPosition(40, 48, exits['1']));
                console.log(`${creep.name} (${creep.room.name}) : Heading to new place`)
            } 
            /** else if (exits['3']){
            } else if (exits['5']){
            } else if (exits['7']){
            } **/
        } else if (creep.room.name == creep.memory.home && creep.carry.energy > 0) {
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
                });
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }

        } else if (creep.room.name != creep.memory.home && creep.carry.energy < creep.carryCapacity){
            var source = creep.pos.findClosestByRange(FIND_SOURCES);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }

        } else { 
            creep.moveTo(new RoomPosition(24, 1, creep.memory.home));

        }
    }
};

module.exports = roleExplorer;