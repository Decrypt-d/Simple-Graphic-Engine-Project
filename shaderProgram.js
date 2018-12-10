class shaderProgram {
    constructor()
    {
        this._vertexShaderID = null;
        this._fragmentShaderID = null;
        this.programID = null;   
    }

    static createShader(shaderId, shaderType) {
        var shaderScript = document.getElementById(shaderId);
        if (!shaderScript)
            return null;
        var shaderSource = "";
        var currentChild = shaderScript.firstChild;
        while (currentChild) {
            if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
                shaderSource += currentChild.textContent;
            }
            currentChild = currentChild.nextSibling;
        }
        var shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }


    generateProgram(shaders)
    {
        if (this.programID)
        {
            alert("Failed To Generate New Program because it already Exists")
            return null;
        }
        var programId = gl.createProgram();
        for (var i = 0; i < shaders.length; ++i)
            gl.attachShader(programId,shaders[i]);
        gl.linkProgram(programId);
        if (!gl.getProgramParameter(programId,gl.LINK_STATUS))
        {
            alert("Failed To Link Program");
            return null;
        }
        this.programID = programId;
    }


    useProgram()
    {
        if (!this.programID)
        {
            alert("Failed To Load Program. The Program Does Not Exist");
            return null;
        }
        gl.useProgram(this.programID);
    }

    unbindProgram()
    {
        if (!this.programID)
        {
            alert("Failed To Load Program. The Program Does Not Exist");
            return null;
        }
        gl.useProgram(null);
    }

}



