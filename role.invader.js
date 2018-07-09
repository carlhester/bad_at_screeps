const roleInvader = {
  run(creep) {

    if (creep.memory.building && creep.carry.energy == 0) {
      creep.memory.building = false;
    }
    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.building = true;
    }


    // find the exit of room W37N57 north to W37N58 west to W38N58
    console.log(`${creep.name} now in ${creep.room.name}`);
    if (creep.room.name == 'W37N57') {
      const pos = new RoomPosition(8, 33, 'W37N58');
      creep.moveTo(pos);
    } else if (creep.room.name == 'W37N58') {
      const next_room_path = Game.map.findRoute('W37N58', 'W38N58');
      if (next_room_path == ERR_NO_PATH) {
        console.log(`${creep.name} no path.. attack!`);
        target = creep.pos.findClosestByRange(FIND_STRUCTURES);
        const try_attack = creep.attack(target);
        console.log(`${creep.name} attacking ${target}\tresult${try_attack}`);
      } else {
        const pos = new RoomPosition(39, 25, 'W38N58');
        creep.moveTo(pos);
      }
    } else if (creep.room.name == 'W38N58') {
      console.log(`Downgrade in ${Room.controller.ticksToDowngrade}`)

      //console.log(`mine? ${creep.room.controller.my}`)
      if (!creep.room.controller.my) {
        const try_claim = creep.claimController(creep.room.controller);
        console.log(`${creep.room.name} is not mine.  Trying to claim: ${try_claim}`);
        if (try_claim == ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.controller);
        }
      } else if (!creep.memory.building) {
        console.log(`${creep.name} Carrying ${creep.carry.energy}, better harvest`) 
        const sources = creep.room.find(FIND_SOURCES);
        var try_harvest = creep.harvest(sources[0])
        console.log(`${creep.name} Carrying ${creep.carry.energy}, Trying to harvest: ${try_harvest}`) 
        if (try_harvest == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }

      } else { 
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        //if (Room.controller.ticksToDowngrade < 3000) { 
        //  targets = []
        //}
        if (targets.length) {
                try_build = creep.build(targets[0])
                console.log(`${creep.name} building: ${try_build}`)
                if (try_build == ERR_NOT_IN_RANGE) {
                    try_move = creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    console.log(`${creep.name} moving: ${try_move}`)
                }
            } else if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
          console.log(`Tried to upgrade ${creep.room.controller}.  Need to get closer.`) 
          creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
        } 
      }       
    } else {
      console.log('Not in W38N58');
      }
  },
};

module.exports = roleInvader;
