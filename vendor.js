const AWS = require('aws-sdk');
const faker = require('faker')


AWS.config.update({region:'us-east-1'});
const sns = new AWS.SNS();
const topic = 'arn:aws:sns:us-east-1:007032026064:pickup';

setInterval(() => {
    const message = {
        orderId: faker.datatype.uuid(),
        customer: faker.name.findName(),
        vendorId: 'arn:aws:sns:us-east-1:007032026064:vendor'
    }

    const payload = {
        Message: JSON.stringify(message),
        TopicArn: topic,
    };

    sns.publish(payload).promise()
        .then(data => {
            console.log(data);
        })
        .catch(console.error);
}, 5000);


const { Consumer } = require('sqs-consumer');

const app = Consumer.create({
    queueUrl: 'https://sqs.us-east-1.amazonaws.com/007032026064/vendor',
    handleMessage: handler,
});

function handler(message) {
    console.log(message.Body);
}

app.on('error', (err) => {
    console.error(err.message);
});

app.on('processing_error', (err) => {
    console.error(err.message);
});

app.start();