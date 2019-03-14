## This is a Kubernetes sample repository with React and Nginx

## Clone

```
$ git clone git@github.com:euonymus/react-nginx-k8s.git
```

## How to run on local

```
$ cd react-nginx-k8s/k8s/my-app
$ npm install
$ npm start
```

## How to run on Docker

```
$ cd react-nginx-k8s/k8s/my-app
$ npm run build
$ docker build --rm -f Dockerfile -t euonymus/simple-react:[versioning-tag] .
$ docker run -it --rm --name simple-react -p 8005:8000 euonymus/simple-react:[versioning-tag]
```

## How to run on Kubernetes
Before begin, you have to create Docker Image as above

```
$ kubectl create namespace simple-react
$ kubectl config set-context simple-react --namespace=simple-react --user=docker-for-desktop --cluster=docker-for-desktop-cluster
$ kubectl config use-context simple-react
$ kubectl apply -f k8s/my-app
```

