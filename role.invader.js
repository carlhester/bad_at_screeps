const roleInvader = {
  run(creep) {
    // find the exit of room W37N57 north to W37N58 west to W38N58
    console.log(`${creep.name} now in ${creep.room.name}`);
    if (creep.room.name == 'W37N57') {
      const pos = new RoomPosition(8, 33, 'W37N58');
      creep.moveTo(pos);
    } else if (creep.room.name == 'W37N58') {
      const next_room_path = Game.map.findRoute('W37N58', 'W38N58');
      if (next_room_path == ERR_NO_PATH) {
        console.log('no path.. attack!');
        target = creep.pos.findClosestByRange(FIND_STRUCTURES);
        const try_attack = creep.attack(target);
        console.log(`attacking ${target}\tresult${try_attack}`);
      } else {
        const pos = new RoomPosition(39, 25, 'W38N58');
        creep.moveTo(pos);
      }
    } else if (creep.room.name == 'W38N58') {
      //console.log(`mine? ${creep.room.controller.my}`)
      if (!creep.room.controller.my) {
        const try_claim = creep.claimController(creep.room.controller);
        console.log(`${creep.room.name} is not mine.  Trying to claim: ${try_claim}`);
        if (try_claim == ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.controller);
        }
      } else if (creep.carry.energy < creep.carryCapacity) {
        console.log(`Carrying ${creep.carry.energy}, better harvest`) 
        const sources = creep.room.find(FIND_SOURCES);
        var try_harvest = creep.harvest(sources[0])
        console.log(`Carrying ${creep.carry.energy}, Trying to harvest: ${try_harvest}`) 
        if (try_harvest == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }

      } else if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
          console.log(`Tried to upgrade ${creep.room.controller}.  Need to get closer.`) 
          creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
        } 
          
        
    } else {
      console.log('Not in W38N58');
      }
  },
};

module.exports = roleInvader;
