function sigmoid(x){
    return 1 / (1 + Math.pow(Math.E,-x))
}

function relu(x){
    return Math.max(0,x)
}

class Neuron{
    constructor(
        public id:number,
        public activation:(val:number) => number,
        public bias:number,
        public layer:number,   
    ){

    }
}

class Edge{
    constructor(
        public id:number,
        public from:number,
        public to:number,
        public weight:number,
    ){

    }
}