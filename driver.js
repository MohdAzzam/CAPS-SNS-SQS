const { Consumer } = require('sqs-consumer');

// produce messages to the vendor queue

const uuid = require('uuid').v4;
const { Producer } = require('sqs-producer');

const producer = Producer.create({
  queueUrl: `https://sqs.us-east-1.amazonaws.com/007032026064/vendor`,
  region: `us-east-1`,
});

let counter = 0;
///////////////////////////////////////
 
const app = Consumer.create({
  queueUrl: 'https://sqs.us-east-1.amazonaws.com/007032026064/packages',
  handleMessage: async (msg) => {
    // do some work with `message`
    let parsedBody = JSON.parse(msg.Body);
    let myOrder = JSON.parse(parsedBody.Message);
    console.log(myOrder);
    // console.log("text is =", myOrder.orderItem);
    // console.log("store is =", myOrder.storeName);
    await acknowledgement();
  }
});
 

app.on('error', (err) => {
  console.error(err.message);
});
 
app.on('processing_error', (err) => {
  console.error(err.message);
});
 
app.start();

///////////////////////////////////

function acknowledgement() {
  setTimeout(async () => {
  
    try {
      const message = {
        id: uuid(),
        body: `Message #${counter++}. Delivery successful!}`,
      };
  
      const response = await producer.send(message);
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  }, Math.floor(Math.random() * 5000));
}