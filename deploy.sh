docker build -t suhasumesh/multi-client:latest -t suhasumesh/multi-client:$SHA
docker build -t suhasumesh/multi-server:latest -t suhasumesh/multi-server:$SHA
docker build -t suhasumesh/multi-worker:latest -t suhasumesh/multi-worker:$SHA

docker push suhasumesh/multi-client:latest
docker push suhasumesh/multi-server:latest
docker push suhasumesh/multi-worker:latest

docker push suhasumesh/multi-client:$SHA
docker push suhasumesh/multi-server:$SHA
docker push suhasumesh/multi-worker:$SHA

kubectl apply -f k8s

kubectl set image deployments/client-deployment client=suhasumesh/multi-client:$SHA
kubectl set image deployments/server-deployment server=suhasumesh/multi-server:$SHA
kubectl set image deployments/worker-deployment worker=suhasumesh/multi-worker:$SHA