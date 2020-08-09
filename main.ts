/// <reference path="projectutils.ts" />
/// <reference path="neuron.ts" />
/// <reference path="table.ts" />
/// <reference path="neuralnet.ts" />

// https://www.youtube.com/watch?v=Ilg3gGewQ5U
// https://www.youtube.com/watch?v=lGLto9Xd7bU


var net = createNeuralNet([5,10,10,2])

net.train([
    [10,5,2,3,9],
],[
    [1,0],
])

net.run([])






