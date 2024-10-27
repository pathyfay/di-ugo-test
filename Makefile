SHELL = /bin/bash
############################ COMMANDE DOCKER Frontend ############################################
start:
	npm install
	npm run dev
stop:
	docker-compose down
start_php:
	php -S localhost:8080

