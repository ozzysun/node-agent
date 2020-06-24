rm ~/bcc/dockerimages/node-agent.tar
docker container stop myagent
docker container rm myagent
docker image rm node-agent
docker build -t node-agent .
docker save node-mq-socket > ~/bcc/dockerimages/node-agent.tar