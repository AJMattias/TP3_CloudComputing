# TP3_CloudComputing
 ## Datos
 Mattias Alejandro
 Legajo: 29225
 ##Correr el proyecto 
  npm install
  docker container rm dynamodb
  docker network create awslocal
  docker run --rm -p 8000:8000 --network awslocal --name dynamodb amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb
  sam local start-api --docker-network awslocal
  
##Ingresar a:
http://localhost:8000/shell

##Ejecutar:
sam local start-api --docker-network awslocal
