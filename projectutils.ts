function dot(a:number[],b:number[]){
    var result = 0
    for(var i = 0; i < a.length;i++){
        result += a[i] * b[i]
    }
    return result
}

function to(a,b){
    return b - a
}

function first<T>(arr:T[]){
    return arr[0]
}

function last<T>(arr:T[]){
    return arr[arr.length - 1]
}

function average(arr:number[]){
    return sum(arr) / arr.length
}

function sum(arr:number[]){
    return arr.reduce((p,c) => p + c,0)
}

function upsert<T>(dict:Map<number,T[]>,id:number,value:T){
    var arr = dict.get(id)
    if(arr == null){
        dict.set(id,[value])
    }else{
        arr.push(value)
    }
}

function findbestIndex<T>(list:T[], evaluator:(v:T) => number):number {
    if (list.length < 1) {
        return -1;
    }
    var bestIndex = 0;
    var bestscore = evaluator(list[0])
    for (var i = 1; i < list.length; i++) {
        var score = evaluator(list[i])
        if (score > bestscore) {
            bestscore = score
            bestIndex = i
        }
    }
    return bestIndex
}

class RNG{
    public mod:number = 4294967296
    public multiplier:number = 1664525
    public increment:number = 1013904223

    constructor(public seed:number){

    }

    next(){
        this.seed = (this.multiplier * this.seed + this.increment) % this.mod
        return this.seed
    }

    norm(){
        return this.next() / this.mod
    }
    
    
    range(min:number,max:number){
        return this.norm() * to(min,max) + min
    }
}