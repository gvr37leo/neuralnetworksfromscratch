/// <reference path="projectutils.ts" />
/// <reference path="neuron.ts" />
/// <reference path="table.ts" />
/// <reference path="neuralnet.ts" />

// https://www.youtube.com/watch?v=Ilg3gGewQ5U
// https://www.youtube.com/watch?v=lGLto9Xd7bU
enum FlowerType{
    rose = 0,daisy = 1
}

function flower2array(flower:Flower){
    return [flower.petals,flower.lengthcm]
}

function flower2label(flower:Flower){
    var res = [0,0]
    res[flower.label] = 1
    return res
}


class Flower{
    constructor(
        public petals:number,
        public lengthcm:number,
        public label:FlowerType
    ){

    }
}
//rose length 30 petals 10
//daisy length 6 petals 30


var testflowers = [
    new Flower(30,10,FlowerType.rose),
    // new Flower(32,11,FlowerType.rose),
    // new Flower(28,13,FlowerType.rose),
    // new Flower(29,8,FlowerType.rose),
    new Flower(6,33,FlowerType.daisy),
    // new Flower(5,32,FlowerType.daisy),
    // new Flower(6,30,FlowerType.daisy),
    // new Flower(7,31,FlowerType.daisy),
]

var realflowers = [
    new Flower(31,9,FlowerType.rose),
    new Flower(24,14,FlowerType.rose),
    new Flower(4,34,FlowerType.daisy),
    new Flower(6,30,FlowerType.daisy),
]

var net = new NeuralNet([2,2,2],false)


net.train(
    testflowers.map(f => flower2array(f)),
    testflowers.map(f => flower2label(f))
)


console.log(examine())

function examine(){
    var correctcount = 0
    var costsum = 0
    for(var realflower of realflowers){
        var res = net.rundAndGetOutput(flower2array(realflower))
        costsum += cost(res,flower2label(realflower))
        if(realflower.label == findbestIndex(res,v => v)){
            correctcount++;
        }
    }
    return {
        correctratio:correctcount / realflowers.length,
        avgcost:costsum / realflowers.length,
    }
}










