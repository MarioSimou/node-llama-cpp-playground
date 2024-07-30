## Setup

```bash
# Install dependencies
npm i
npm run download

# Run the app locally
npm run start:dev

# Build docker image
npm run build:docker
```

## Deploy service

```bash
# Build image
npm run build:docker

# Tag image
SERVICE_NAME=api
REGION=europe-west3
PROJECT=[google project name]
REPOSITORY=[artifacts repository name]
REPOSITORY_URI=$REGION-docker.pkg.dev/$PROJECT/$REPOSITORY/$SERVICE_NAME

docker tag $SERVICE_NAME $REPOSITORY_URI

# Push in Artifacts Registry
gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://$REGION-docker.pkg.dev
docker push $REPOSITORY_URI

# Deploy
gcloud run deploy api --cpu-boost --memory 4Gi --cpu 2 --concurrency 10 --allow-unauthenticated --image $REPOSITORY_URI
```

## Call service

```bash
curl -X POST http://localhost:8080/api/v1/analyze --header 'Content-Type: application/json' --data '{"question": "What is your name?"}'
```
