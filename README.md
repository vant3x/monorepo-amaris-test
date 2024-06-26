# Mi Proyecto Monorepo Angular NestJS/FastAPI con DynamoDB

## Requisitos Previos

- Docker y Docker Compose
- Node.js y npm
- Python 3
- AWS CLI 

## Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/vant3x/monorepo-amaris-test.git    


Bash
npm install # En la raíz del proyecto
cd frontend-funds
npm install  # Dentro de la carpeta del frontend

Correr en local

docker-compose up --build

Frontend: http://localhost:4200

Backend Nest: http://localhost:3000

Backend FastAPI: http://localhost:8000


Desplegar en AWS (CloudFormation)

1.Autenticación en AWS CLI:
aws configure

2. Desplegar la plantilla de CloudFormation:

aws cloudformation deploy --template-file infrastructure/cloudformation.yml --stack-name <NOMBRE_DEL_STACK>

Reemplaza <NOMBRE_DEL_STACK> con un nombre para tu stack.


