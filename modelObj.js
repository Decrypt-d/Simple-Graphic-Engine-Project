class modelObj {
    constructor() {
        this.positionBufferId = null;
        this.modelVAO = null;
        this.modelElementsArray = null;
        this.textureBufferId = null;
        this.normalBufferId = null;
        this.indicesSize = null;
        this.transformationMatrix = identityMatrix();
        this.color = [1.0,1.0,1.0,1.0];
        this.reflexivity = 5.0;
        this.isLight = false;
    }


    _createBuffer(bufferData) {
        const result = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, result);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER,null);
        return result;
    }

    _createIndicesBuffer(indicesArray) {
        this.modelElementsArray = gl.createBuffer();
        this.indicesSize = indicesArray.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.modelElementsArray);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indicesArray), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
    }

    changeColor(objectColor)
    {
        this.color = objectColor;
    }

    changeIsLight(isLight)
    {
        this.isLight = isLight;
    }

    bindIsLight(isLightLocation)
    {
        gl.uniform1i(isLightLocation,this.isLight);
    }

    unbindIsLight(isLightLocation)
    {
        gl.uniform1i(isLightLocation,null);
    }

    bindColor(colorLocation)
    {
        gl.uniform4f(colorLocation,this.color[0],this.color[1],this.color[2],this.color[3]);
    }

    unbindColor(colorLocation)
    {
        gl.uniform4f(colorLocation,null,null,null,null);
    }

    changeReflexivity(reflexivity)
    {
        this.reflexivity = reflexivity;
    }

    bindReflexivity(reflexivityLocation)
    {
        gl.uniform1f(reflexivityLocation,this.reflexivity);
    }

    unbindReflexivity(reflexivityLocation)
    {
        gl.uniform1f(reflexivityLocation,null);
    }


    createModel(positionAttribArray, normalAttribArray, textureAttribArray, indicesArray) {
        this.modelVAO = gl.createVertexArray();
        this.positionBufferId = this._createBuffer(positionAttribArray);
        if (normalAttribArray != null && normalAttribArray != undefined)
            this.normalBufferId = this._createBuffer(normalAttribArray);
        if (textureAttribArray != null && textureAttribArray != undefined)
            this.textureBufferId = this._createBuffer(textureAttribArray);
        if (indicesArray != null && indicesArray != undefined)
            this._createIndicesBuffer(indicesArray);
    }

    transformation(transformMatrix)
    {
        this.transformationMatrix = transformMatrix;
    }

    bindTransformation(transformationLocation)
    {
        gl.uniformMatrix4fv(transformationLocation,false,new Float32Array(this.transformationMatrix.matrixData));
    }

    unbindTransformation(transformationLocation)
    {
        gl.uniformMatrix4fv(transformationLocation,null);
    }

    createBinding(attribType,location,size,attribDatatype,normalize)
    {
        gl.bindVertexArray(this.modelVAO);
        if (attribType == modelObj.positionType)
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBufferId);
        else if (attribType == modelObj.normalType)
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBufferId);
        else if (attribType == modelObj.textureType)
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBufferId);
        gl.vertexAttribPointer(location, size, attribDatatype, normalize, 0, 0);
        gl.enableVertexAttribArray(location);
        gl.bindBuffer(gl.ARRAY_BUFFER,null);
        gl.bindVertexArray(null);        
    }

    bindModel(programLocations)
    {
        gl.bindVertexArray(this.modelVAO);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.modelElementsArray);
        this.bindColor(programLocations[0]);
        this.bindReflexivity(programLocations[1]); 
        this.bindTransformation(programLocations[2]);  
        this.bindIsLight(programLocations[3]);
    }

    unbindModel(programLocations)
    {
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
        this.unbindColor(programLocations[0]);
        this.unbindReflexivity(programLocations[1]); 
        this.unbindTransformation(programLocations[2]);  
        this.unbindIsLight(programLocations[3]);
    }
}

modelObj.positionType = 0
modelObj.normalType = 1
modelObj.textureType = 2;