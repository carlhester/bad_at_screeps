var calcBodyCost = {

    /** @param {Creep} creep **/
    calc: function(bodyArray) {
        bodyCost = 0;
        for (bodyPart in bodyArray) {
            if (bodyArray[bodyPart] == MOVE) {
                bodyCost += 50;
            } else if (bodyArray[bodyPart] == CARRY) {
                bodyCost += 50;
            } else if (bodyArray[bodyPart] == WORK) {
                bodyCost += 100;
            } else if (bodyArray[bodyPart] == ATTACK) {
                bodyCost += 80;
            } else if (bodyArray[bodyPart] == HEAL) {
                bodyCost += 250;
            } else if (bodyArray[bodyPart] == RANGED_ATTACK) {
                bodyCost += 150;
            } else if (bodyArray[bodyPart] == TOUGH) {
                bodyCost += 10;
            } else if (bodyArray[bodyPart] == CLAIM) {
                bodyCost += 600;
            }
        } 
        return (bodyCost);
    }
};

module.exports = calcBodyCost;