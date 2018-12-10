class spotLight
{
    constructor(lightPos,lightDir,lightCutOff,lightColor,ambientIntensity,diffuseIntensity,specularIntensity)
    {
        this.lightPosition = lightPos;
        this.lightColor = lightColor;
        this.ambientIntensity = ambientIntensity;
        this.diffuseIntensity = diffuseIntensity;
        this.specularIntensity = specularIntensity;
        this.lightDir = lightDir;
        this.lightCutOff = lightCutOff;
    }

    bindLight(programLocations)
    {
        gl.uniform4f(programLocations[0],this.lightPosition[0],this.lightPosition[1],this.lightPosition[2],this.lightPosition[3]);
        gl.uniform4f(programLocations[1],this.lightColor[0],this.lightColor[1],this.lightColor[2],this.lightColor[3]);
        this.bindIntensities(programLocations[2],programLocations[3],programLocations[4]);
        gl.uniform3f(programLocations[5],this.lightDir[0],this.lightDir[1],this.lightDir[2]);
        gl.uniform1f(programLocations[6],this.lightCutOff)
    }

    unbindLight(programLocations)
    {
        gl.uniform4f(programLocations[0],null,null,null,null);
        gl.uniform4f(programLocations[1],null,null,null,null);
        gl.uniform4f(programLocations[2],null,null,null,null);
        gl.uniform1f(programLocations[3],null);
        this.unbindLight(programLocations[2],programLocations[3],programLocations[4]);
    }

    bindIntensities(ambientLocation,diffuseLocation,specularLocation)
    {
        gl.uniform1f(ambientLocation,this.ambientIntensity);
        gl.uniform1f(diffuseLocation,this.diffuseIntensity);
        gl.uniform1f(specularLocation,this.specularIntensity);
    }
    
    unbindIntensities(ambientLocation,diffuseLocation,specularLocation)
    {
        gl.uniform1f(ambientLocation,null);
        gl.uniform1f(diffuseLocation,null);
        gl.uniform1f(specularLocation,null);
    }

}