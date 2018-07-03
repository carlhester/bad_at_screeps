var roleScraper = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[creep.memory.harvest_target]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[creep.memory.harvest_target], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }

};

module.exports = roleScraper;