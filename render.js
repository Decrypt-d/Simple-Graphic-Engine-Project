var gl = null;
var canvas = null;
var currentModel = null;
var currentProgram = null;
var cameraPosition = [0.0,3.0,45.0,1.0];
var cameraAngle = 0;
var cameraPosition = [0.0,25.5,45.0,1.0];
var cameraAngle = -30;
var carHeadLight = [];
var wheels = [];



var modelInScene = [];
var lightInScene = [];
var shouldAnimate = false;
var sunPos = [-19.0,0.0,2.0,0.0];
var isNight = true;


function clearScene()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function toggleAnimation()
{
    shouldAnimate = !shouldAnimate;
}


function draw()                                          
{
    var inverseCameraPos = [-cameraPosition[0],-cameraPosition[1],-cameraPosition[2],1.0];
    var viewTransformation = rotateX(degreeToRadian(-cameraAngle));
    viewTransformation = multiplyMatrix(viewTransformation, translationMatrix(inverseCameraPos));
    var newCameraPos = multiplyMatrixandVectorArray(multiplyMatrix(translationMatrix(cameraPosition),rotateX(degreeToRadian(cameraAngle))), [1.0, 1.0, 1.0, 1.0]);
    gl.uniformMatrix4fv(gl.getUniformLocation(currentProgram.programID, "viewMatrix"), false, new Float32Array(viewTransformation.matrixData))
    gl.uniformMatrix4fv(gl.getUniformLocation(currentProgram.programID, "projectionMatrix"), false, new Float32Array(projectionMatrix(10, 100.0, 45, 0.9).matrixData));
    gl.uniform3f(gl.getUniformLocation(currentProgram.programID, "cameraPosition"), newCameraPos[0], newCameraPos[1], newCameraPos[2]);
    gl.uniform1i(gl.getUniformLocation(currentProgram.programID,"isNight"),isNight);
    for (let i = 0; i < lightInScene.length; ++i)
    {
        var programLocations = [gl.getUniformLocation(currentProgram.programID,"lightPos[" + i + "]"),gl.getUniformLocation(currentProgram.programID,"lightColor[" + i + "]"),
        gl.getUniformLocation(currentProgram.programID,"ambientIntensity[" + i + "]"),gl.getUniformLocation(currentProgram.programID,"diffuseIntensity[" + i + "]"),
        gl.getUniformLocation(currentProgram.programID,"specularIntensity[" + i + "]")];
        if (i >= 2)
        {
            programLocations.push(gl.getUniformLocation(currentProgram.programID,"lightDir[" + (i - 2) + "]"));
            programLocations.push(gl.getUniformLocation(currentProgram.programID,"lightCutOff[" + (i - 2) + "]"));
        }
        lightInScene[i].bindLight(programLocations);
    }
    for (let i = 0; i < modelInScene.length; ++i) {
        modelInScene[i].bindModel([gl.getUniformLocation(currentProgram.programID, "objectColor"), gl.getUniformLocation(currentProgram.programID, "reflexivity"),
                                    gl.getUniformLocation(currentProgram.programID, "transformationMatrix"),gl.getUniformLocation(currentProgram.programID,"isLight")]);
        if (modelInScene[i].isSuperModel)
            modelInScene[i].draw();
        else  
            gl.drawElements(gl.TRIANGLES, modelInScene[i].indicesSize, gl.UNSIGNED_INT, 0)
    }
 
}

function initState()
{
    gl.clearColor(0,0,0,1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.viewport(0,0,gl.viewportWidth,gl.viewportHeight);
}

function createGLContext(canvas)
{
    var names = ["webgl", "experimental-webgl"];
    var context = null;
    for (var i = 0; i < names.length; ++i)
        try {
            context = canvas.getContext(names[i]);
        } catch (e) {
            if (context) {
                break;
            }
        }
    if (context) {
        context.viewportWidth = canvas.width;
        context.viewportHeight = canvas.height;
    } else {
        alert("Failed to create WebGL context!");
    }
    return context;
}


function loadLights(programLocations)
{
    var sunLight = new light([0.0,0.0,0.0,0.0],[0.3,0.3,0.3,1.0],0.3,0.8,0.4);
    lightInScene.push(sunLight);
    var lampLight = new light([0.0,5.0,0.0,1.0],[0.3,0.3,0.3,1.0],0.2,0.8,0.4);
    lightInScene.push(lampLight);
    var spotLight1 = new spotLight([3.4,1.4,-8.9,1.0],[1.0,0.0,0.0,0.0],0.86,[0.3,0.3,0.3,1.0],0.2,0.8,0.4);
    lightInScene.push(spotLight1);
    var spotLight2 = new spotLight([3.3,1.4,-10.9,1.0],[1.0,0.0,0.0,0.0],0.85,[0.3,0.3,0.3,1.0],0.2,0.8,0.4);
    lightInScene.push(spotLight2);
}

function createModelObject(actualModel,programLocations)
{
    var modelObject = new modelObj();
    modelObject.createModel(actualModel.vertexPositions,actualModel.vertexNormals,null,actualModel.indices);
    modelObject.createBinding(modelObj.positionType,programLocations[0],3,gl.FLOAT,false);
    modelObject.createBinding(modelObj.normalType,programLocations[1],3,gl.FLOAT,false);
    return modelObject;
}


function createCarWheel(programLocations)
{
    var wheel = new superModel();
    for (let i = 0; i < 6; ++i)
    {
        var wheelRim = uvCylinder(0.17,4.0,10);
        var wheelRimObj = createModelObject(wheelRim,programLocations);
        wheelRimObj.changeColor([1.0,0.7,0.0,1.0]);
        wheelRimObj.changeReflexivity(40.0);
        var transformation = multiplyMatrix(rotateZ(degreeToRadian(i * 60)),rotateX(degreeToRadian(90)));
        wheelRimObj.transformation(transformation);
        wheel.addModel(wheelRimObj);
    }

    var tire = uvTorus(1.80,3.0,100,100);
    var tireObj = createModelObject(tire,programLocations);
    tireObj.changeColor([0.15,0.15,0.15,1.0]);
    tireObj.changeReflexivity(40.0);
    wheel.addModel(tireObj);
    return wheel;
}



function createCar(programLocations)
{
    var car = new superModel();
    
    
    var carTop = cube(3);
    var carTopObj = createModelObject(carTop,programLocations);
    carTopObj.changeColor([1.0,0.0,0.0,1.0]);
    carTopObj.changeReflexivity(40.0);
    var transformation = multiplyMatrix(translationMatrix([0.6,13.5,11.154]),rotateX(degreeToRadian(-90)));
    carTopObj.transformation(multiplyMatrix(scaleMatrix(0.9,0.21,0.91),transformation));
    car.addModel(carTopObj);
    
    var carBottom = cube(3);
    var carBottomObj = createModelObject(carBottom,programLocations);
    carBottomObj.changeColor([1.0,0.0,0.0,1.0]);
    carBottomObj.changeReflexivity(40.0);
    var transformation = multiplyMatrix(translationMatrix([0.0,5.0,10.25]),rotateX(degreeToRadian(-90)));
    carBottomObj.transformation(multiplyMatrix(scaleMatrix(1.75,0.39,0.99),transformation));
    car.addModel(carBottomObj);
    
    var wheelTranslation = [[2.2,1.35,12.1],[-2.1,1.35,12.2],[2.2,1.35,8.2],[-2.1,1.35,8.2]];
    for (let i = 0; i < 4; ++i) 
    {
        var wheel = createCarWheel(programLocations);
        var transformation = multiplyMatrix(scaleMatrix(0.3,0.3,0.35),wheel.transformationMatrix);
        wheel.transformation(multiplyMatrix(translationMatrix(wheelTranslation[i]),transformation));
        wheels.push(wheel);
        car.addModel(wheel);
    }

    var axleTranslation = [[2.2,1.35,10.15],[-2.2,1.35,10.15]];
    for (let i = 0; i < 2 ; ++i)
    {
        var axle = uvCylinder(0.08,4.0,50);
        var axleObj = createModelObject(axle,programLocations);
        axleObj.changeColor([1.0,0.7,0.0,1.0]);
        axleObj.changeReflexivity(40.0);
        axleObj.transformation(translationMatrix(axleTranslation[i]));
        car.addModel(axleObj);
    }
    
    var headLightTranslation = [[-2.32,1.82,11],[-2.32,1.82,9.37]]
    for (let i = 0; i < 2 ; ++i)
    {
        var headLight = uvSphere(0.4,100,100);
        var headLightObj = createModelObject(headLight,programLocations);
        headLightObj.changeColor([1.0,0.7,0.0,1.0]);
        headLightObj.changeReflexivity(40.0);
        headLightObj.transformation(translationMatrix(headLightTranslation[i]));
        car.addModel(headLightObj);
        carHeadLight.push(headLightObj);
    }

    car.transformation(rotateY(degreeToRadian(-180)))
    return car;
}

function createTree(programLocations)
{   
    var tree = new superModel()
    var treeTop = uvCone(1.5,4.8,100);
    var treeTopObj = createModelObject(treeTop,programLocations);
    treeTopObj.changeColor([0.0,0.3,0.0,1.0]);
    treeTopObj.changeReflexivity(50.0);
    var transformation = multiplyMatrix(translationMatrix([0.0,4.36,0.0]),rotateX(degreeToRadian(-90)));
    treeTopObj.transformation(transformation);
    tree.addModel(treeTopObj);
    var treeTrunk = uvCylinder(0.5,1.9,100);
    var treeTrunkObj = createModelObject(treeTrunk,programLocations);
    treeTrunkObj.changeColor([0.2,0.1,0.0,1.0]);
    treeTrunkObj.changeReflexivity(50.0);
    var transformation = multiplyMatrix(translationMatrix([0.0,1.0,0.0]),rotateX(degreeToRadian(-90)));
    treeTrunkObj.transformation(transformation);
    tree.addModel(treeTrunkObj);
    return tree;
}


function loadModels(programLocations)
{
    var road = ring(8.0,13.0,200);
    var roadObj = createModelObject(road,programLocations);
    roadObj.changeColor([0.4,0.4,0.4,1.0]);
    roadObj.changeReflexivity(40.0);
    var transformation = multiplyMatrix(translationMatrix([0.0,0.501,0.0]),rotateX(degreeToRadian(-90)));
    roadObj.transformation(transformation);
    modelInScene.push(roadObj);

    var platformCylinder = uvCylinder(15.0,1.0,200);
    grassPlatform = createModelObject(platformCylinder,programLocations);
    grassPlatform.changeColor([0.0,0.2,0.06,1.0]);
    grassPlatform.changeReflexivity(40.0);
    grassPlatform.transformation(rotateX(degreeToRadian(-90)));
    modelInScene.push(grassPlatform);
                                         
    modelInScene.push(createCar(programLocations));

    
    var sunLight = uvSphere(1.5,200,200);
    var sunObj = createModelObject(sunLight,programLocations);
    sunObj.changeColor([0.3,0.3,0.3,1.0]);
    sunObj.changeReflexivity(1.0)
    var transformation = multiplyMatrix(translationMatrix([-19.0,0.0,0.0]),rotateX(degreeToRadian(90)));
    sunObj.transformation(transformation);
    sunObj.changeIsLight(true);
    modelInScene.push(sunObj);
    
    var lightBulb = uvSphere(0.5,100);
    var lightBulbObj = createModelObject(lightBulb,programLocations);
    lightBulbObj.changeColor([0.6,0.6,0.0,1.0]);
    lightBulbObj.changeIsLight(true);
    lightBulbObj.changeReflexivity(30.0);
    lightBulbObj.transformation(multiplyMatrix(translationMatrix([0.0,4.7,0.0]),rotateX(degreeToRadian(-90))));
    modelInScene.push(lightBulbObj);

    var lampPost = uvCylinder(0.22,5.0,100);
    var lampPostObj = createModelObject(lampPost,programLocations);
    lampPostObj.changeColor([0.2,0.2,0.2,1.0]);
    lampPostObj.changeReflexivity(50.0);
    lampPostObj.transformation(multiplyMatrix(translationMatrix([0.0,2.5,0.0]),rotateX(degreeToRadian(-90))));
    modelInScene.push(lampPostObj);

    var treeScale = [[1.0,1.0,1.0],[0.7,0.7,0.7],[1.0,1.0,1.0],[0.4,0.4,0.4],[0.7,0.7,0.7],
                    [0.5,0.5,0.5],[0.47,0.47,0.47],[0.8,0.8,0.8],[0.5,0.5,0.5],[0.47,0.47,0.47]];
    var treeTranslation = [[-4.0,0.0,4.2],[-2.0,0.2,-4.0],[3.5,0.0,0.1],[-10.0,1.5,34.5],[-12.0,0.2,-16.0],
                        [7.0,0.22,-28.0],[13.0,0.22,-27.5],[17.8,0.0,0.0],[27.0,0.5,-3.4],[29.6,0.30,2.7]]
    for (let i = 0; i < 10; ++i)
    {
        var tree = createTree(programLocations);
        tree.transformation(multiplyMatrix(scaleMatrix(treeScale[i][0],treeScale[i][1],treeScale[i][2]),translationMatrix(treeTranslation[i])));
        modelInScene.push(tree);
    }

}

function setup()
{
    canvas = document.getElementById("display");
    gl = createGLContext(canvas);
    gl.getExtension("OES_element_index_uint");
    var vaoExt = gl.getExtension("OES_vertex_array_object");    
    if (vaoExt) {
        gl['createVertexArray'] = function() { return vaoExt['createVertexArrayOES'](); };
        gl['deleteVertexArray'] = function(vao) { vaoExt['deleteVertexArrayOES'](vao); };
        gl['bindVertexArray'] = function(vao) { vaoExt['bindVertexArrayOES'](vao); };
        gl['isVertexArray'] = function(vao) { return vaoExt['isVertexArrayOES'](vao); };
    }
    initState();
    const mainProgram = new shaderProgram();
    const shaders = [shaderProgram.createShader("shader-vs",gl.VERTEX_SHADER),shaderProgram.createShader("shader-fs",gl.FRAGMENT_SHADER)];
    mainProgram.generateProgram(shaders);
    mainProgram.useProgram();
    currentProgram = mainProgram;
    gl.enableVertexAttribArray(gl.getAttribLocation(mainProgram.programID,"position"));
    loadModels([gl.getAttribLocation(mainProgram.programID,"position"),gl.getAttribLocation(mainProgram.programID,"normal")
                ,gl.getUniformLocation(mainProgram.programID,"objectColor"), gl.getUniformLocation(mainProgram.programID,"reflexivity")]);
    loadLights([gl.getUniformLocation(mainProgram.programID,"lightPos"),gl.getUniformLocation(mainProgram.programID,"lightColor"),
    gl.getUniformLocation(mainProgram.programID,"ambientIntensity"),gl.getUniformLocation(mainProgram.programID,"diffuseIntensity"),
    gl.getUniformLocation(mainProgram.programID,"specularIntensity")]);
}

function changeSunColor(sunLight)
{
    if (!isNight)
    {
        sunLight.changeColor([1.0,1.0,0.0,1.0]);
        lightInScene[0].lightPosition = sunPos;
    }
    else
    {
        sunLight.changeColor([0.3,0.3,0.3,1.0]);
        lightInScene[0].lightPosition = [0.0, 0.0, 0.0];
    }
}


function changeLampColor(lamp)
{
    if (isNight)
    {
        lamp.changeIsLight(true);
        lamp.changeColor([0.6,0.6,0.0,1.0]);
    }
    else
    {
        lamp.changeIsLight(false);
        lamp.changeColor([0.3,0.3,0.3,1.0]);
    }
}

function changeCarHeadLight()
{
    if (isNight)
    {
        for (let i = 0 ; i < 2; ++i)
        {
            carHeadLight[i].changeIsLight(true);
            carHeadLight[i].changeColor([0.9,0.9,0.0,1.0]);
        }
    }
    else
    {
        for (let i = 0 ; i < 2; ++i)
        {
            carHeadLight[i].changeIsLight(false);  
            carHeadLight[i].changeColor([1.0,0.7,0.0,1.0]);
        }
    }
}

function animateWheels()
{
    for (let i = 0; i < 4; ++i)
        wheels[i].transformation(multiplyMatrix(wheels[i].transformationMatrix,rotateZ(degreeToRadian(6))));
}


var degree = 0;
var degreeIncrement = 1.0;

function animation () {
    modelInScene[2].transformation(multiplyMatrix(rotateY(degreeToRadian(-1.3)),modelInScene[2].transformationMatrix));
    
    
    sunPos = multiplyMatrixandVectorArray(rotateZ(degreeToRadian(degreeIncrement)),sunPos);
    
    lightInScene[2].lightPosition = multiplyMatrixandVectorArray(rotateY(degreeToRadian(-1.3)),lightInScene[2].lightPosition);
    lightInScene[3].lightPosition = multiplyMatrixandVectorArray(rotateY(degreeToRadian(-1.3)),lightInScene[3].lightPosition);
    lightInScene[2].lightDir = multiplyMatrixandVectorArray(rotateY(degreeToRadian(-1.3)),lightInScene[2].lightDir);
    lightInScene[3].lightDir = multiplyMatrixandVectorArray(rotateY(degreeToRadian(-1.3)),lightInScene[2].lightDir);
    
    
    
     
    if (degree % 180 == 8 && degree >= 180)
        isNight = !isNight
    
    animateWheels();
    changeLampColor(modelInScene[4]);
    changeCarHeadLight();
    changeSunColor(modelInScene[3]);
    transformation = multiplyMatrix(translationMatrix([-19.0,0.0,0.0]),rotateX(degreeToRadian(90)));
    modelInScene[3].transformation(multiplyMatrix(rotateZ(degreeToRadian(degree)),transformation));
    degree += degreeIncrement;
}



function tick()
{
    if (shouldAnimate)
    {
        animation();
        clearScene();
        draw();
    }
    requestAnimationFrame(tick);
}

function startGL()
{
    var first = new matrix([
        3.0, 2.0, 4.0, 1.0, 
        2.0, 5.0, 7.0, 12.0,
        2.0, 15.0, 8.0, 9.0,
        6.0, 1.0, 18.0 , 4.0,
    ],4,4)
    var second = new matrix([
        1.0, 0.0, 3.0, 5.0, 
        2.0, 5.0, 0.0, 12.0,
        2.0, 5.0, 0.0, 9.0,
        6.0, 1.0, 7.0 , 4.0,
    ],4,4)
    setup();
    clearScene();
    draw();
    requestAnimationFrame(tick);
}