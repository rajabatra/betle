# Docker Compose Scripts

- docker-compose.yaml: contains the production deployment, using the default container commands. Our initial approach is to use this on a single VM and then transition to a more scalable platform once demand necessitates. Usually we just run

```{sh}
docker compose -f docker-compose.yaml up
```

- docker-compose-dev.yaml: contains a dev environment for local testing and hot reloads of the frontend/backend. By default, it creates a local mysql database with a persistent volume. Hot reloads can be run with docker compose watch:

```{sh}
docker compose -f docker-compose-dev.yaml watch frontend backend
```
