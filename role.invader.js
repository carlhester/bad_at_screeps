var roleInvader = { 
    run: function(creep) { 
        //find the exit of room W37N57 north to W37N58 west to W38N58
        console.log(creep.name + ' now in ' + creep.room.name);
        if (creep.room.name == 'W37N57'){
            const pos = new RoomPosition(8, 33, 'W37N58');
            creep.moveTo(pos);
        } else if (creep.room.name == 'W37N58') { 
            var next_room_path = Game.map.findRoute('W37N58', 'W38N58');
            if (next_room_path == ERR_NO_PATH){ 
                console.log('no path.. attack!')
                target = creep.pos.findClosestByRange(FIND_STRUCTURES);
                var try_attack = creep.attack(target);
                console.log('attacking ' + target + '\tresult' + try_attack)
            } else { 
                const pos = new RoomPosition(39, 25, 'W38N58');
                creep.moveTo(pos);
            }

        }  else if (creep.room.name == 'W38N58') { 
            const pos = new RoomPosition(39, 22, 'W38N58');
            creep.moveTo(pos);

            if(creep.room.controller) {
                var try_claim = creep.claimController(creep.room.controller);
                console.log('try to claim: ' + try_claim)
                if(try_claim == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                 }
            }
            else { 
                console.log('didnt find controller');
            }
        } 
    }
};

module.exports = roleInvader;
