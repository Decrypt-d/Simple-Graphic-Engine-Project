class light
{
    constructor(lightPos,lightColor,ambientIntensity,diffuseIntensity,specularIntensity)
    {
        this.lightPosition = lightPos;
        this.lightColor = lightColor;
        this.ambientIntensity = ambientIntensity;
        this.diffuseIntensity = diffuseIntensity;
        this.specularIntensity = specularIntensity;
    }

    bindLight(programLocations)
    {
        gl.uniform4f(programLocations[0],this.lightPosition[0],this.lightPosition[1],this.lightPosition[2],this.lightPosition[3]);
        gl.uniform4f(programLocations[1],this.lightColor[0],this.lightColor[1],this.lightColor[2],this.lightColor[3]);
        this.bindIntensities(programLocations[2],programLocations[3],programLocations[4]);
    }

    unbindLight(programLocations)
    {
        gl.uniform4f(programLocations[0],null,null,null,null);
        gl.uniform4f(programLocations[1],null,null,null,null);
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