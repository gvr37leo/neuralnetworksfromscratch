

class NeuralNet{
    neurons = new Table<Neuron>('id',['layer'])
    edges = new Table<Edge>('id',['from','to'])

    constructor(public layercount:number){

    }

    train(inputs:number[][],expecteds:number[][]){
        //inputs.length should equal first(layer).length
        //expected.length should equals last(layer).length

        var res = this.run(inputs[0])
        
        this.backprop()

        //stappen
        //voor elk voorbeeld
        //begin bij de eind neurons, pak er 1
        //kijk of deze neuron omhoog of omlaag moet
        //haal elke neuron en edge die hier naartoe gaat erbij

        //voor de weights
        //sla op of de weight omhoog of omlaag moet en hoeveel(?), en houd rekening met de activation van de neuron waar de edge vandaan komt

        //voor de activations
        //sla op of de activation omhoog of omlaag moet en hoeveel(?) en houd rekening met de weight van de edge die deze neuron verbind
        //dit is geloof ik ook het "recursieve" backpropagation gedeelte

        //voor de bias 
        //?

        //als je dit gedaan hebt dan heb je een nudge voor elke bias en weight
        // herhaal dit voor elk example(of doe mini batches) en neem de gemiddelde nudge en pas die toe

        //dit was 1 gradient step, blijf herhalen totdat er geen of nauwelijks meer verbetering plaatsvindt

        for(var i = 0; i < inputs.length; i++){

            var example = inputs[i]
            var expected = expecteds[i]
            
            var result = this.run(example)
            var layer = this.layercount - 1

            var desiredMap = new Map<number,number>()//neuronid -> desiredvalue
            this.neurons.getForeign('layer',layer).forEach((n,j) => desiredMap.set(n.id,expected[j]))

            for(var i = this.layercount - 1; i >= 1; i--){
                this.backpropagationLayerStep(layer,result,desiredMap)
            }

        }
    }

    backprop(){}

    backpropagationLayerStep(layer:number,actualoutputs:Map<number, number>,desired:Map<number, number>){
        var biasNudges = new Map<number,number>()//neuronid -> value
        var layerneurons = this.neurons.getForeign('layer',layer)

        var allEdgeNudges:Map<number,number>[] = []
        var allActivationWishes:Map<number,number>[] = []

        for(var neuron of layerneurons){
            var edgeNudges = new Map<number,number>()//edgeid -> value
            var activationWishes = new Map<number,number>()//neuronid -> value

            var neuroutput = actualoutputs.get(neuron.id)
            var desiredforneuron = desired.get(neuron.id)
            var desiredchange = to(neuroutput,desiredforneuron)
            biasNudges.set(neuron.id,desiredchange)//?

            var edges = this.edges.getForeign('to',neuron.id)
            var activations = edges.map(edge => actualoutputs.get(edge.from))
            
            for(var i = 0; i < edges.length; i++){
                var edge = edges[i]
                var activation = activations[i]

                var edgenudge = activation * desiredchange//?
                var activationWishNudge = desiredchange * edge.weight//?
                edgeNudges.set(edge.id,edgenudge)
                activationWishes.set(edge.from,activationWishNudge)
            }

            allEdgeNudges.push(edgeNudges)
            allActivationWishes.push(activationWishes)
        }

        

        return {
            biasNudge:biasNudges,
            weightNudges:[],
            activationWishes:[]
        }
    }

    run(baseinputs:number[]):Map<number,number>{
        var neuronoutputmap = new Map<number,number>()
        this.neurons.getForeign('layer',0).forEach((n,i) => neuronoutputmap.set(n.id,baseinputs[i]))
        for(var i = 1; i < this.layercount; i++){
            var neurons = this.neurons.getForeign('layer',i)
            for(var neuron of neurons){
                var edges = this.edges.getForeign('to',neuron.id)
                var inputs = edges.map(edge => this.neurons.get(edge.from))
                var dotproduct = dot(inputs.map((input) => neuronoutputmap.get(input.id)),edges.map(e => e.weight))
                var neuronoutput = neuron.activation(dotproduct + neuron.bias) 
                neuronoutputmap.set(neuron.id,neuronoutput)
            }
        }
        return neuronoutputmap
    }
}

function createNeuralNet(layersizes:number[]):NeuralNet{
    var res = new NeuralNet(layersizes.length)

    for(var i = 0; i < layersizes.length;i++){
        for(var j = 0; j < layersizes[i];j++){
            res.neurons.add(new Neuron(null,sigmoid,0,i))
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

