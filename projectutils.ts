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