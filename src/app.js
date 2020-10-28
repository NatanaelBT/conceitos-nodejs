const express = require("express");
const cors = require("cors");

const { v4: uuid_v4, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next){
  const { id } = request.params;


  if(!isUuid(id)){
      return response.status(400).json(
          { error: 'Invalid repository ID.'}
      );
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
  
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid_v4(),
    title,
    url, 
    techs, 
    likes: 0

  };

  repositories.push(repository);

  return response.json(repository);
  
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const { title, url, techs } = request.body;

  const repositoryId = repositories.findIndex(repository => repository.id === id);

  if(repositoryId < 0){
    return response.status(400).json({ error:'Repository not found'});
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryId].likes,

  };

  repositories[repositoryId] = repository;

  return response.status(200).json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryId = repositories.findIndex(repository => repository.id === id);

  if(repositoryId < 0){
    return response.status(400).json({ error:'Repository not found'});
  }

  repositories.splice(repositoryId, 1);

  return response.status(204).send();



});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryId = repositories.findIndex(repository => repository.id === id);

  if(repositoryId < 0){
    return response.status(400).json({ error:'Repository not found'});
  }

   repositories[repositoryId].likes +=1;

   return response.json(repositories[repositoryId]);


});

module.exports = app;
