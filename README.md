## The problem has been [fixed](https://stackoverflow.com/a/62890003/8586803). Thus the code of this repo works fine now.

---

---

---

> Elasticsearch works fine with Docker compose, but I can't connect to Elasticsearch from inside my Kubernetes cluster

# Setup

## Setup on Ubuntu

1. `yarn install`
2. `sudo apt install docker-compose`
3. `sudo snap install microk8s --classic`
4. `sudo usermod -a -G microk8s $USER`
5. `sudo cp daemon.json /etc/docker/daemon.json && sudo systemctl restart docker`
6. `sudo snap alias microk8s.kubectl kubectl`
7. `microk8s enable dns ingress registry`
8. `microk8s.kubectl apply -f https://download.elastic.co/downloads/eck/1.1.2/all-in-one.yaml`
9. `yarn deploy`

## Setup Generally

1. `yarn install`
2. Make sure `docker-compose` is installed
3. Make sure `kubectl` is istalled and it points to a cluster with ingress and container registry enabled
4. Change `cluster` in the `WORKSPACE` file (line 100) to your cluster name and `image_chroot` (line 101) to your registry
5. `yarn deploy`

# Issue

After the Elasticsearch cluster turnes healthy and the serach service is deployed, you can inspect the logs of the search service with

```
kubectl logs deployment/search-deployment
```

Unfortunately, there is an error:

```
ConnectionError: self signed certificate in certificate chain
```

This only happens when running Elasticsearch inside Kubernetes. Running it with Docker compose (`yarn docker`) works fine. (_probably because security is disabled in the docker compose file_)

# Misc

GitHub Issue: https://github.com/elastic/elasticsearch-js/issues/1255

StackOverflow post: https://stackoverflow.com/questions/62792477

Official documentation: https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-quickstart.html
