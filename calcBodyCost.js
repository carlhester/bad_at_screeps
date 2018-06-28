var calcBodyCost = {

    /** @param {Creep} creep **/
    calc: function(bodyArray) {
        bodyCost = 0;
        for (bodyPart in bodyArray) {
            if (bodyPart == MOVE) { 
                bodyCost += 50;
            } else if (bodyPart == CARRY) { 
                bodyCost += 50;
            } else if (bodyPart == WORK) { 
                bodyCost += 100
            }


        }
        console.log('BodyCost: ' + bodyCost)

    }
};

module.exports = calcBodyCost;