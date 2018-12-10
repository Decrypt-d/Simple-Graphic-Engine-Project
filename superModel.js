class superModel 
{
    constructor(){
        this.models = [];
        this.transformationMatrix = identityMatrix();
        this.bindModel.bind(this);
        this.isSuperModel = true;
        this.programLocations = [];
    }


    draw()
    {
        for (let i = 0; i < this.models.length; ++i)
        {
            this.models[i].bindModel(this.programLocations);
            var temp = this.models[i].transformationMatrix;
            this.models[i].transformation(multiplyMatrix(this.transformationMatrix,this.models[i].transformationMatrix));
            if (this.models[i].isSuperModel)
                this.models[i].draw();
            else
            {
                this.models[i].bindTransformation(this.programLocations[2])
                gl.drawElements(gl.TRIANGLES, this.models[i].indicesSize, gl.UNSIGNED_INT, 0);
            }
            this.models[i].transformation(temp);
            
        }
    }

    addModel(modelObj)
    {
        this.models.push(modelObj);
    }
    
    transformation(transformMatrix)
    {
        this.transformationMatrix = transformMatrix;
    }

    bindModel(programLocations)
    {
        this.programLocations = programLocations;
    }

}