var roleInvader = { 
    run: function(creep) { 
        //find the exit of room W37N57 north to W37N58 west to W38N58

        if(creep.room.name == 'W37N57') { 
            const pos = new RoomPosition(8, 33, 'W37N58');
            creep.moveTo(pos);
        } else if (creep.room.name == 'W37N58') { 
            console.log(creep.name + ' now in ' + creep.room.name);
        }


        // when in room, claim controller
        /**
        if(creep.room.controller) {
            if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        **/

    }
};

module.exports = roleInvader;

