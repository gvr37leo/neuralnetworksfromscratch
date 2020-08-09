function dot(a:number[],b:number[]){
    var result = 0
    for(var i = 0; i < a.length;i++){
        result += a[i] * b[i]
    }
    return result
}