const AWS = require('aws-sdk');
const createId = require('hash-generator')

const handler = async({pathParameters, httpMethod, body})=>{

    const dynamodb = new AWS.DynamoDB({
        apiVersion: '2012-8-10',
        endpoint: 'http://dynamodb:8000',
        region: 'us-west-2',
        credentials: {
            accessKeyId: '2345',
            secretAccessKey: '2345'
    }
    });

    const docClient = new AWS.DynamoDB.DocumentClient({
        apiVersion: '2012-08-10',
        service: dynamodb
    });

    const { TableNames: tablas } = await dynamodb.listTables().promise()
    if (!tablas.includes('Envio')) {
        return {
            statusCode: 400,
            headers: { "content-type": "text/json" },
            body: 'Por favor crea las tablas que estan en el archivo createTable.js'
        }
    }

    switch (httpMethod) {

        case 'GET':
            const findEnvioById = (pathParameters || {}).idEnvio || false;
            if (findEnvioById) {
                const findEnvioParams = {
                    TableName: 'Envio',
                    Key: {
                        id: findEnvioById,
                    }
                };

                const envio = await docClient.get(findEnvioParams).promise()
                return {
                    statusCode: 200,
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(envio)
                }
            }

            const findParams = {
                TableName: 'Envio',
                IndexName: 'EnviosPendientesIndex'
            };

            try {
                const envios = await docClient.scan(findParams).promise()
                return {
                    statusCode: 200,
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(envios)
                }
            } catch (err) {
                console.log(err)
                return {
                    statusCode: 500,
                    headers: { "content-type": "text/plain" },
                    body: 'Error al intentar obtener los envios.'
                };
            }

        case 'POST':
            const createParams = {
                TableName: 'Envio',
                Item: {
                    id: createId(01),
                    fechaAlta: new Date().toISOString(),
                    ...JSON.parse(body),
                    pendiente: new Date().toISOString(),
                }
            }

            try {
                await docClient.put(createParams).promise()
                return {
                    statusCode: 200,
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(createParams.Item)
                };
            } catch {
                return {
                    statusCode: 500,
                    headers: { "content-type": "text/plain" },
                    body: 'Error al intentar crear el envio.'
                };
            }

            case 'PUT':
            const id_Envio = (pathParameters || {}).id_Envio || false;

            const updateParams = {
                TableName: 'Envio',
                Key: {
                    id: id_Envio
                },
                UpdateExpression: 'REMOVE pendiente',
                ConditionExpression: 'attribute_exists(pendiente)'
            }

            try {
                await docClient.update(updateParams).promise()
                return {
                    statusCode: 200,
                    headers: { "content-type": "text/plain" },
                    body: `Success: Envío con el id ${id_Envio} fue entregado correctamente.`
                };
            } catch {
                return {
                    statusCode: 500,
                    headers: { "content-type": "text/plain" },
                    body: `Error al crear el envío ${id_Envio}.`
                };
            }

            default:
            return {
                statusCode: 501,
                headers: { "content-type": "text/plain" },
                body: `Error: Método ${httpMethod} no soportado.`
            };

    }
}

exports.handler = handler;