

class NeuralNet{
    neurons = new Table<Neuron>('id',['layer'])
    edges = new Table<Edge>('id',['from','to'])

    constructor(public layersizes:number[],randomizeBiasAndWeight:boolean){
        var rng = new RNG(0)
        
        for(let i = 0; i < layersizes.length;i++){
            for(let j = 0; j < layersizes[i];j++){
                var bias = randomizeBiasAndWeight ? rng.norm() : 0
                this.neurons.add(new Neuron(null,sigmoid,bias,i,j))
            }        
        }
        for(let i = 0; i < layersizes.length - 1;i++){
            let firstneurons = this.neurons.getForeign('layer',i)
            let secondneurons = this.neurons.getForeign('layer',i + 1)
    
            for(let to of secondneurons){
                for(let from of firstneurons){
                    var weight = randomizeBiasAndWeight ? rng.norm() : 0
                    this.edges.add(new Edge(null,from.id,to.id,weight))
                }
            }
        }
    }

    inputSanityCheck(examples:number[][],expecteds:number[][]){
        //examples.length should equal expecteds.length
        //inputs.length should equal first(layer).length
        //expected.length should equals last(layer).length
        if(examples.length != expecteds.length){
            throw new Error("examples.length != expecteds.length");
        }
        for(let example of examples){
            if(example.length != this.neurons.getForeign('layer',0).length){
                throw new Error("examples.length != first(layer).length");
            }
        }
        for(let expected of expecteds){
            if(expected.length != this.neurons.getForeign('layer',this.layersizes.length - 1).length){
                throw new Error("expecteds.length != last(layer).length");
            }
        }
    }

    train(examples:number[][],expecteds:number[][]){
        this.inputSanityCheck(examples,expecteds)
        
        let costhistory = [this.runAndCost(examples,expecteds)]

        for(let i = 0; i < 100; i++){
            this.backpropagation(examples,expecteds)
            costhistory.push(this.runAndCost(examples,expecteds))

            let costchange = to(costhistory[costhistory.length - 2],costhistory[costhistory.length - 1])
            if(costchange < 0){
                console.log('improvement')
            }else if(costchange == 0){
                console.log('no change')
            }else{
                console.log('worsening')
            }
        }

        
         

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
        
    }

    runAndCost(input:number[][],expected:number[][]){
        let sum = 0
        for(let i = 0; i < input.length; i++){
            let output = this.rundAndGetOutput(input[i])
            sum += cost(output,expected[i])
        }
        return sum / input.length
    }

    rundAndGetOutput(input:number[]):number[]{
        return this.neuronMap2Output(this.run(input))
    }

    neuronMap2Output(neuronoutputmap:Map<number, number>):number[]{
        let outputneurons = this.neurons.getForeign('layer',this.layersizes.length - 1)
        return outputneurons.map(n => neuronoutputmap.get(n.id))
    }

    backpropagation(examples:number[][],expecteds:number[][]){

        let biasnudges = new Map<number,number[]>()//neuronid -> desired nudge for each example
        let weightnudges = new Map<number,number[]>()//edgeid -> desired nudge for each example

        for(let i = 0; i < examples.length; i++){

            let example = examples[i]
            let expected = expecteds[i]
            
            let result = this.run(example)

            let desiredMap = new Map<number,number>()//neuronid -> desiredvalue
            this.neurons.getForeign('layer',this.layersizes.length - 1).forEach((n,j) => desiredMap.set(n.id,expected[j]))

            for(let j = this.layersizes.length - 1; j >= 1; j--){
                let backpropres = this.backpropagationLayerStep(j,result,desiredMap)
                desiredMap = backpropres.activationWishes

                backpropres.biasNudge.forEach((value,key) => upsert(biasnudges,key,value))
                backpropres.edgeNudges.forEach((value,key) => upsert(weightnudges,key,value))
            }
        }

        for(let [key,value] of biasnudges){
            this.neurons.get(key).bias += average(value)
        }
        for(let [key,value] of weightnudges){
            this.edges.get(key).weight += average(value)
        }
    }

    backpropagationLayerStep(layer:number,actualoutputs:Map<number, number>,desired:Map<number, number>){
        let biasNudges = new Map<number,number>()//neuronid -> value
        let layerneurons = this.neurons.getForeign('layer',layer)

        let edgeNudges = new Map<number,number>()//edgeid -> nudge
        let activationWishes = new Map<number,number[]>()//neuronid -> nudges

        for(let neuron of layerneurons){
            // let activationWishes = new Map<number,number>()//neuronid -> value

            let neuroutput = actualoutputs.get(neuron.id)
            let desiredforneuron = desired.get(neuron.id)
            let desiredchange = to(neuroutput,desiredforneuron)
            biasNudges.set(neuron.id,desiredchange)//?

            let edges = this.edges.getForeign('to',neuron.id)
            
            for(let edge of edges){
                let activation = actualoutputs.get(edge.from)

                let edgenudge = activation * desiredchange//?
                let activationWishNudge = desiredchange * edge.weight//?
                edgeNudges.set(edge.id,edgenudge)

                upsert(activationWishes,edge.from,activationWishNudge)
            }
        }

        let averagedActivationWish = new Map<number,number>()
        for(let [key,value] of activationWishes){
            averagedActivationWish.set(key,average(value))
        }

        return {
            biasNudge:biasNudges,
            edgeNudges:edgeNudges,
            activationWishes:averagedActivationWish
        }
    }

    run(baseinputs:number[]):Map<number,number>{
        let neuronoutputmap = new Map<number,number>()
        this.neurons.getForeign('layer',0).forEach((n,i) => neuronoutputmap.set(n.id,baseinputs[i]))
        for(let i = 1; i < this.layersizes.length; i++){
            let neurons = this.neurons.getForeign('layer',i)
            for(let neuron of neurons){
                let edges = this.edges.getForeign('to',neuron.id)
                let inputs = edges.map(edge => this.neurons.get(edge.from))
                let dotproduct = dot(inputs.map((input) => neuronoutputmap.get(input.id)),edges.map(e => e.weight))
                let neuronoutput = neuron.activation(dotproduct + neuron.bias) 
                neuronoutputmap.set(neuron.id,neuronoutput)
            }
        }
        
        return neuronoutputmap
    }
}



function cost(actual:number[],expected:number[]){
    let sum = 0
    for(let i = 0; i < actual.length;i++){
        sum += Math.pow(actual[i] - expected[i],2)
    }
    return sum
}

