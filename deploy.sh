#!/bin/bash

# Configuración
STACK_NAME="amaris-fullstack"
REGION="us-east-1"  # Cambia esto a tu región de AWS, por ejemplo "us-east-1"
ECR_REPO_NAME="${STACK_NAME}-backend"

# 1. Desplegar el stack de CloudFormation
echo "Desplegando stack de CloudFormation..."
aws cloudformation deploy \
  --template-file infrastructure/e2e.yml \
  --stack-name $STACK_NAME \
  --parameter-overrides \
    AwsAccessKeyId=$AWS_ACCESS_KEY_ID \
    AwsSecretAccessKey=$AWS_SECRET_ACCESS_KEY \
    TwilioAccountSid=$TWILIO_ACCOUNT_SID \
    TwilioAuthToken=$TWILIO_AUTH_TOKEN \
    TwilioPhoneNumber=$TWILIO_PHONE_NUMBER \
  --capabilities CAPABILITY_IAM \
  --region $REGION

# 2. Construir y subir la imagen de Docker del backend
echo "Construyendo y subiendo imagen de Docker del backend..."
cd fastapi-funds # Asegúrate de que esta es la ruta correcta a tu carpeta de backend
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com
docker build -t $ECR_REPO_NAME .
docker tag $ECR_REPO_NAME:latest $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com/$ECR_REPO_NAME:latest
docker push $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com/$ECR_REPO_NAME:latest
cd ..

# 3. Obtener la URL del backend
BACKEND_URL=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='BackendUrl'].OutputValue" --output text --region $REGION)

# 4. Construir el frontend
echo "Construyendo el frontend..."
cd frontend  # Asegúrate de que esta es la ruta correcta a tu carpeta de frontend
npm install
ng build --prod
cd ..

# 5. Reemplazar la URL del backend en el frontend
echo "Reemplazando la URL del backend en el frontend..."
sed -i "s|\${BACKEND_URL}|$BACKEND_URL|g" frontend/dist/*/main*.js

# 6. Subir el frontend a S3
echo "Subiendo el frontend a S3..."
FRONTEND_BUCKET=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='FrontendBucketName'].OutputValue" --output text --region $REGION)
aws s3 sync frontend/dist/* s3://$FRONTEND_BUCKET/ --delete --region $REGION

# 7. Obtener la URL del frontend
FRONTEND_URL=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='FrontendUrl'].OutputValue" --output text --region $REGION)

echo "Despliegue completado."
echo "Frontend URL: $FRONTEND_URL"
echo "Backend URL: $BACKEND_URL"
