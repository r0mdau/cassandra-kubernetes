# cassandra-k8s

Create a cassandra cluster on a kubernetes cluster at home, using multiple laptops.

## Steps

### Pre requisites

Add orange-incubator helm repo :

    helm repo add orange-incubator https://orange-kubernetes-charts-incubator.storage.googleapis.com/

### Creating kubernetes cluster

This part refers to an other git repo I made : https://github.com/r0mdau/ansible-kubernetes . 
There are details about the next steps.

I copy pasted in this repo files needed to create a k8s cluster using multiple laptops.

You must install laptop-1 first because it contains kubernetes master node.

#### Install laptop-1

    cd laptop-1
    vagrant up
    cp kubernetes-setup/kubeconfig ~/.kube/config
    
Check everything works fine using kubectl :

    kubectl get nodes

    
#### Install laptop-2

Same commands as laptop-1 without copying the kubeconfig.

#### Install laptop-x

Use laptop-2 configurations as template. 
You have to customize ipv4 addresses in the vagrant file.

For this cassandra cluster configuration, these 2 laptops are needed, no more.
More laptops is for fun and going further, like setting 2 datacenters using Multi-CassKop.

#### Install Rancher local-path feature
Usefull to dynamically provision local storage.

    kubectl apply -f local-path-storage.yaml


### Creating cassandra cluster

#### Install CassKop

CassKop is a nice kubernetes operator developed by Orange OpenSource : https://github.com/Orange-OpenSource/casskop

We will work in a dedicated namespace : cassandra

    kubectl create namespace cassandra
    kubens cassandra
    
And apply CassKop CustomResourceDefinitions :
    
    kubectl apply -f cassandra/casskop/db.orange.com_cassandra_1_clusters_crd.yaml
    kubectl apply -f cassandra/casskop/db.orange.com_cassandra_2_backups_crd.yaml
    kubectl apply -f cassandra/casskop/db.orange.com_cassandra_3_restores_crd.yaml
    
Use helm to deploy the cassandra operator :

    helm install casskop --namespace=cassandra orange-incubator/cassandra-operator
    
#### Launch cassandra

    kubectl apply -f cassandra/cassandra-configmap-v1.yaml
    kubectl apply -f cassandra/cassandracluster.yaml
        
In this cluster, we use only 1 rack and want 4 cassandra nodes on it.
And ask for running only 1 cassandra node per k8s node.

#### Test cassandra

    kubectl exec -ti cassandra-demo-dc1-rack1-0 -c cassandra -- nodetool status

### Install example app

TODO