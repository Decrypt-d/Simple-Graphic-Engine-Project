class matrix 
{
    constructor(matrixData,rows,columns){
        if ((matrixData == null || matrixData == undefined) || (rows == undefined || rows == null) || (columns == null || columns == undefined))
            throw "Matrix Data, rows, and columns must be specified";
        this.rows = rows;
        this.columns = columns;
        this.matrixData = matrixData;
    }
}

function multiplyMatrix(first,second)
{
    if (first.columns != second.rows)
        throw "Matrix 1 and 2 has incompatible dimension";
    result = [];
    for (var k = 0; k < second.columns; ++k) {
        for (var i = 0; i < first.rows; ++i) {
            var currentResult = 0;
            for (var j = 0; j < second.rows; ++j)
                currentResult += first.matrixData[(j * first.rows) + i] * second.matrixData[(k * second.rows) + j]
            result.push(currentResult);
        }
    }
    return new matrix(result,first.rows,second.columns);
}

function multiplyMatrixandVectorArray(matrix,vectorArray)
{
    if (matrix.rows != vectorArray.length)
        throw "The rows and column of the matrix and vector are incompatible";
    var result = [];
    for (let i = 0; i < matrix.rows; ++i)
    {
        var currentResult = 0;
        for  (let j = 0; j < matrix.columns; ++j)
            currentResult += matrix.matrixData[(j * matrix.rows) + i] * vectorArray[j];
        result.push(currentResult);
    }
    return result;
}


function degreeToRadian(degree)
{
    return Math.PI * degree / 180;
}


function scaleMatrix(scaleX,scaleY,scaleZ)
{
    var result = new matrix(
        [scaleX, 0.0, 0.0, 0.0,
         0.0, scaleY, 0.0, 0.0,
         0.0, 0.0 ,scaleZ, 0.0,
         0.0, 0.0 , 0.0,   1.0,
        ]
    ,4,4)
    return result;
}


function translationMatrix(translateVectorArray)
{
    var result = new matrix(
        [1.0, 0.0, 0.0, 0.0,
         0.0, 1.0, 0.0, 0.0,
         0.0, 0.0, 1.0, 0.0,
         translateVectorArray[0], translateVectorArray[1], translateVectorArray[2], 1.0,
        ]
    ,4,4)
    return result;
}

function identityMatrix()
{
    var result = new matrix(
        [1.0, 0.0, 0.0, 0.0,
         0.0, 1.0, 0.0, 0.0,
         0.0, 0.0, 1.0, 0.0,
         0.0, 0.0, 0.0, 1.0,
        ]
    ,4,4)
    return result;
}


function rotateX(radian)
{
    var result = new matrix(
        [1.0, 0.0, 0.0, 0.0,
         0.0, Math.cos(radian), Math.sin(radian), 0.0,
         0.0, -Math.sin(radian), Math.cos(radian), 0.0,
         0.0, 0.0, 0.0 , 1.0,
        ]
    ,4,4)
    return result;
}

function rotateY(radian)
{
    var result = new matrix(
        [Math.cos(radian), 0.0, -Math.sin(radian), 0.0,
         0.0, 1.0, 0.0, 0.0,
         Math.sin(radian), 0.0, Math.cos(radian), 0.0,
         0.0, 0.0, 0.0, 1.0,
        ]
    ,4,4)
    return result;
}

function rotateZ(radian)
{
    var result = new matrix(
        [Math.cos(radian), Math.sin(radian), 0.0, 0.0,
         -Math.sin(radian), Math.cos(radian), 0.0, 0.0,
         0.0, 0.0, 1.0, 0.0,
         0.0, 0.0, 0.0 , 1.0,
        ]
    ,4,4)
    return result;
}


function projectionMatrix(near,far,fov,aspectRatio)
{
    fov = degreeToRadian(fov);
    var result = new matrix(
        [(1.0 / (aspectRatio * Math.tan(fov/2))), 0.0, 0.0, 0.0,
         0.0, (1.0 / (Math.tan(fov/2))), 0.0, 0.0,
         0.0, 0.0, - ((far + near) / (far - near)), -1.0,
         0.0, 0.0, - ((2 * far * near) / (far - near)), 0.0,
        ]
    ,4,4)
    return result;
}
