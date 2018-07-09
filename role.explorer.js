var roleExplorer = {

    /** @param {Creep} creep **/
    findNewRoom: function(creep) {
        var exit_list = []
        var exits = Game.map.describeExits(creep.room.name)
        
        if (exits['1']) { 
            exit_list.push(exits['1'])
        } else if (exits['3']){
            exit_list.push(exits['3'])
        } else if (exits['5']){
            exit_list.push(exits['5'])
        } else if (exits['7']){
            exit_list.push(exits['7'])
        }

        return exit_list[0]
    },


    run: function(creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            console.log(`${creep.name} (${creep.pos}) ${creep.carry.energy}/${creep.carryCapacity}`)
            if (creep.room.controller.my) {
                var nextRoom = findNewRoom(creep)
                creep.moveTo(new RoomPosition(25, 25, nextRoom));
                console.log(`${creep.name} (${creep.pos}) ${creep.carry.energy}/${creep.carryCapacity} This room is mine. Moving on to ${nextRoom}`)
            } else {
                var source = creep.pos.findClosestByRange(FIND_SOURCES);
                var try_harvest = creep.harvest(source)
                console.log(`${creep.name} (${creep.pos}) ${creep.carry.energy}/${creep.carryCapacity} This room is not mine. Attempting to harvest from ${source}: ${try_harvest}`)

                if (try_harvest == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                } else if (try_harvest == ERR_NOT_OWNER) {
                    var nextRoom = findNewRoom(creep)
                    creep.moveTo(new RoomPosition(25, 25, nextRoom)); 
                }
            }

        } else if (creep.room.name == creep.memory.home) { 
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE)
                }
                });
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
        } else {
            console.log(`${creep.name} (${creep.pos}) ${creep.carry.energy}/${creep.carryCapacity} Not sure what I should do.  Heading home`)
            creep.moveTo(new RoomPosition(17, 11, creep.memory.home));

        }
    }        
};

module.exports = roleExplorer;