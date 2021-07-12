const express = require("express");
const cors = require("cors");
const { v4, validate } = require("uuid");


const app = express();

function logRequest(request, response, next){
  const { method, url} = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
}

function validateRepositoryId(request, response, next){
  const { id } = request.params;
  

  if(!validate(id)){
    return response.status(400).json({error: 'Invalid project ID.'});
  }

  return next();

}

app.use(express.json());
app.use(cors());
app.use(logRequest);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const likes = 0;
  const repository = { id: v4(), title, url, techs, likes};
  
  repositories.push(repository);

  return response.json(repository);
  // TODO
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: 'Project not found.'});
  }

  const likes = repositories[repositoryIndex].likes;
  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  };

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);
  // TODO
});

app.delete("/repositories/:id", validateRepositoryId,  (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: 'Project not found.'});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

  // TODO
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: 'Project not found.'});
  }

  repository = repositories[repositoryIndex];

  repository.likes = repository.likes + 1;

  return response.json(repository);
  // TODO
});

module.exports = app;
