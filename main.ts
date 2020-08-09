/// <reference path="projectutils.ts" />
/// <reference path="neuron.ts" />

// https://www.youtube.com/watch?v=Ilg3gGewQ5U
// https://www.youtube.com/watch?v=lGLto9Xd7bU
var neuronidcounter = 0
var edgeidcounter = 0
var neurons = new Map<number,Neuron>()
var neuronsByLayer = new Map<number,Neuron[]>()
var edges = new Map<number,Edge>()
var edgesByTo = new Map<number,Edge[]>()


function createLayers(layersizes:number[]){
    for(var i = 0; i < layersizes.length;i++){
        for(var j = 0; j < layersizes[i];j++){
            new Neuron(neuronidcounter++,relu,0,i)
        }        
    }

    for(var i = 0; i < layersizes.length - 1;i++){
        var firstneurons = neuronsByLayer.get(i)
        var secondneurons = neuronsByLayer.get(i + 1)

        for(var to of secondneurons){
            for(var from of firstneurons){
                new Edge(edgeidcounter++,from.id,to.id,1)
            }
        }
    }
}

function run(input:number[]):number[]{

    return null
}

function cost(actual:number[],expected:number[]){
    var sum = 0
    for(var i = 0; i < actual.length;i++){
        sum += Math.pow(actual[i] - expected[i],2)
    }
    return sum
}