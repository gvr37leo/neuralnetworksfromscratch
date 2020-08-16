var fs = require('fs')

var images = fs.readFileSync('train-images.idx3-ubyte')
var labels = fs.readFileSync('train-labels.idx1-ubyte')
var bufferindex = 0

var imageparsed = parseMnistBuffer(images)
var labelparsed = parseMnistBuffer(labels)

console.log(imageparsed,labelparsed)

function parseMnistBuffer(buffer){
    bufferindex = 0
    var datatypes = {
        0x08:buffer.readUInt8,
        0x09:buffer.readInt8,
        0x0B:buffer.readInt16BE,
        0x0C:buffer.readInt32BE,
        0x0D:buffer.readFloatBE,
        0x0E:buffer.readDoubleBE,
    }

    nextbyte(buffer)
    nextbyte(buffer)
    var datatype = nextbyte(buffer)
    var dimensions = nextbyte(buffer)
    var datatypereader = datatypes[datatype]
    var dimensionsizes = []
    for(var z = 0; z < dimensions; z++){
        dimensionsizes.push(nextinteger(buffer))
    }
    
    if(dimensionsizes.length == 1){
        return read1d(dimensionsizes,buffer)
    }
    if(dimensionsizes.length == 2){
        return read2d(dimensionsizes,buffer)
    }
    if(dimensionsizes.length == 3){
        return read3d(dimensionsizes,buffer)
    }
}

function read1d(dimensionsizes,buffer){
    var res = []
    for(var i = 0; i < dimensionsizes[0];i++){
        res.push(nextbyte(buffer))        
    }
    return res
}

function read2d(dimensionsizes,buffer){
    var res = []
    for(let x = 0; x < dimensionsizes[1];x++){
        var res2 = []
        for(var y = 0; y < dimensionsizes[2];y++){
            res2.push(nextbyte(buffer))        
        }
        res.push(res2)
    }
    return res
}

function read3d(dimensionsizes,buffer){
    var res = []
    for(let x = 0; x < dimensionsizes[0]; x++){
        var res2 = []
        for(let y = 0; y < dimensionsizes[1];y++){
            var res3 = []
            for(var z = 0; z < dimensionsizes[2];z++){
                res3.push(nextbyte(buffer))        
            }
            res2.push(res3)
        }
        res.push(res2)
    }
    return res
}


function nextbyte(buffer){
    return buffer.readUInt8(bufferindex++)
}

function nextinteger(buffer){
    var p = bufferindex
    bufferindex += 4
    return buffer.readInt32BE(p)
}
