const amqp = require("amqplib");

const RECV_QUEUES = [
  'RecvStartUniversityName',
  'RecvStartUniversityID',
  'RecvStartUniversityLocation'
];
const SEND_QUEUES = [
  'SendUniversityName',
  'SendUniversityID',
  'SendUniversityLocation'
];

let channel;

async function connectRabbitMQ() {
  const rabbitUrl = process.env.RABBIT || 'amqp://localhost'; // env 변수 사용, 없으면 localhost 기본
  const connection = await amqp.connect(rabbitUrl);
  channel = await connection.createChannel();

  // 모든 RECV 큐 선언
  for (const queue of RECV_QUEUES) {
    await channel.assertQueue(queue, { durable: false });
  }

  return channel;
}

// university_url을 전송
async function sendUniversityURL(university_url, sendQueueName) {
  if (!channel) await connectRabbitMQ();
  let recvQueueName;
  if(sendQueueName == 'SendUniversityName'){
    recvQueueName = 'RecvStartUniversityName';
  } else if(sendQueueName == 'SendUniversityID'){
    recvQueueName = 'RecvStartUniversityID';
  } else if(sendQueueName == 'SendUniversityLocation'){
    recvQueueName = 'RecvStartUniversityLocation'
  } else{
    console.log("명시되지 않은 sendQueueName 입니다.");
  }

  channel.sendToQueue(
    sendQueueName,  // 올바르게 인자로 받은 큐 이름 사용
    Buffer.from(JSON.stringify({ university_url })),
    {
      replyTo: recvQueueName,
    }
  );
}

// university data 수신
async function receiveUniversityData(queueName) {
  if (!channel) await connectRabbitMQ();

  if (!RECV_QUEUES.includes(queueName)) {
    throw new Error(`알 수 없는 수신 큐: ${queueName}`);
  }

  // 최대 10번까지, 300ms 간격으로 메시지 수신 시도
  for (let i = 0; i < 10; i++) {
    const msg = await channel.get(queueName, { noAck: false });
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      channel.ack(msg);
      return data;
    }
    // 메시지가 없으면 300ms 대기 후 재시도
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  throw new Error(`${queueName} 큐에서 메시지를 받지 못했습니다.`);
}
module.exports = {
  sendUniversityURL,
  receiveUniversityData
};