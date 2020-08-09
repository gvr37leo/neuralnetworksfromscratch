

class NeuralNet{
    neurons = new Table<Neuron>('id',['layer'])
    edges = new Table<Edge>('id',['from','to'])

    constructor(public layercount:number){

    }

    train(input:number[][],expected:number[][]){
        //inputs.length should equal layer[0].length
        //expected.length should equals last(layer).length

        var res = this.run(input[0])
        var lousiness = cost(res,expected[0])
        this.backprop()
    }

    backprop(){

    }

    run(baseinputs:number[]):number[]{

        var layeroutputs = [
            baseinputs,
        ]
        for(var i = 1; i < this.layercount; i++){
            var neurons = this.neurons.getForeign('layer',i)
            var outputs = []
            for(var neuron of neurons){
                var edges = this.edges.getForeign('to',neuron.id)
                var inputs = edges.map(edge => this.neurons.get(edge.from))
                
                //dot input values with the weigt of the edge
                var neuronoutput = neuron.activation(dot(inputs.map((input,j) => layeroutputs[i - 1][j]),edges.map(e => e.weight)) + neuron.bias) 
                outputs.push(neuronoutput)
            }
            layeroutputs.push(outputs)
        }
    
        return layeroutputs[layeroutputs.length - 1]
    }

    
}

function createNeuralNet(layersizes:number[]):NeuralNet{
    var res = new NeuralNet(layersizes.length)

    for(var i = 0; i < layersizes.length;i++){
        for(var j = 0; j < layersizes[i];j++){
            res.neurons.add(new Neuron(null,relu,0,i))
        }        
    }
    for(var i = 0; i < layersizes.length - 1;i++){
        var firstneurons = res.neurons.getForeign('layer',i)
        var secondneurons = res.neurons.getForeign('layer',i + 1)

        for(var to of secondneurons){
            for(var from of firstneurons){
                res.edges.add(new Edge(null,from.id,to.id,0))
                
            }
        }
    }
    return res
}

function cost(actual:number[],expected:number[]){
    var sum = 0
    for(var i = 0; i < actual.length;i++){
        sum += Math.pow(actual[i] - expected[i],2)
    }
    return sum
}

