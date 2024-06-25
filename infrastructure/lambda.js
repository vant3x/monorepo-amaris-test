const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' }); 

module.exports.sendEmail = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No se proporcionó cuerpo en la solicitud' })
    };
  }

  const { to, subject, body } = JSON.parse(event.body);

  if (!to || !subject || !body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Faltan campos requeridos (to, subject, body)' })
    };
  }

  const params = {
    Destination: { 
      ToAddresses: [to]
    },
    Message: {
      Body: {
        Text: { Data: body }
      },
      Subject: { Data: subject }
    },
    Source: process.env.FROM_EMAIL
  };

  try {
    await ses.sendEmail(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Correo enviado exitosamente' })
    };
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al enviar el correo', error: error.message })
    };
  }
};