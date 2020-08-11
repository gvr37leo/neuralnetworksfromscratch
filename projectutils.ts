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