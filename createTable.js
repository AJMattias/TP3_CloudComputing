let params = {
    TableName: 'Envio',
    KeySchema: [
        {
            AttributeName: 'Id',
            KeyType: 'HASH',
        }
    ],
    AttributeDefinitions: [
        {
            AttributeName: 'Id',
            AttributeType: 'S'
        },
        {
            AttributeNAme:'fechaAlta',
            AttributeType: 'S'
        },
        {
            AttributeNAme:'destino',
            AttributeType: 'S'
        },
        {
            AttributeNAme:'email',
            AttributeType: 'S'
        },
        {
            AttributeNAme:'pendiente',
            AttributeType: 'S'
        }
        ],
};

let indexParams = {
    TableName: 'Envio',
    AttributeDefinitions: [
        {
            AttributeName: 'id',
            AttributeType: 'S'
        },
        {
            AttributeName: 'pendiente',
            AttributeType: 'S'
        }],
    GlobalSecondaryIndexUpdates: [{
        Create: {
            IndexName: 'EnviosPendientesIndex',
            KeySchema: [
                {
                    'AttributeName': 'id',
                    'KeyType': 'HASH'
                },
                {
                    'AttributeName': 'pendiente',
                    'KeyType': 'RANGE'
                }
            ],
            Projection: {
                ProjectionType: 'INCLUDE',
                NonKeyAttributes: ['pendiente']
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
            },
        },
    },
    ],
};

dynamodb.createTable(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else {
        dynamodb.updateTable(indexParams, function (err, data) {
            if (err) ppJson(err);
            else console.log("Tablas e indices creados correctamente")
        }
        );
    }
}
);