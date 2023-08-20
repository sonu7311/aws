sudo docker-compose down
sudo docker system prune -af
sudo docker-compose up -d --force-recreate
#sudo docker stop "website"
#sudo docker container prune -f
#sudo docker image rm node-web-app
#sudo docker build -t node-web-app .
#sudo docker run --name "website" -p 80:8080 -d node-web-app 
