var roleScraper = {

    /** @param {Creep} creep **/
    run: function(creep, scrape_target) {
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[scrape_target]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[scrape_target], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }

};

module.exports = roleScraper;