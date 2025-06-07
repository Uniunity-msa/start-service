const amqp = require("amqplib");

const RECV_QUEUES = [
  'RecvStartUniversityName',
  'RecvStartUniversityID',
  'RecvStartUniversityLocation', 
  'RecvPostList'
];
const SEND_QUEUES = [
  'SendUniversityName',
  'SendUniversityID',
  'SendUniversityLocation',
  'SendPostList'
];

function generateCorrelationId() {
  return `corr-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

let channel;

async function connectRabbitMQ() {
  const host = process.env.RABBITMQ_HOST || 'localhost';
  const port = process.env.RABBITMQ_PORT || '5672';
  const rabbitUrl = `amqp://${host}:${port}`;
  const connection = await amqp.connect(rabbitUrl);
  channel = await connection.createChannel();

  // 모든 RECV 큐 선언
  for (const queue of RECV_QUEUES) {
    await channel.assertQueue(queue, { durable: false });
  }

  return channel;
}

// university_url을 전송
async function sendUniversityURL(university_url, sendQueueName, correlationId) {
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
      correlationId: correlationId,
    }
  );
}

//post-service로 university_id 수신
async function sendUniversityID(university_id, sendQueueName, correlationId) {
  await channel.assertQueue(sendQueueName, { durable: false });

  if (!channel) await connectRabbitMQ();
  let recvQueueName = 'RecvPostList';
  
  channel.sendToQueue(
    sendQueueName,  // 올바르게 인자로 받은 큐 이름 사용
    Buffer.from(JSON.stringify({university_id})),
    {
      replyTo: recvQueueName,
      correlationId: correlationId,
    }
  );
}

// university data 수신
async function receiveUniversityData(queueName, correlationId) {
  if (!channel) await connectRabbitMQ();

  if (!RECV_QUEUES.includes(queueName)) {
    throw new Error(`알 수 없는 수신 큐: ${queueName}`);
  }

  // 최대 10번까지, 300ms 간격으로 메시지 수신 시도
  for (let i = 0; i < 10; i++) {
    const msg = await channel.get(queueName, { noAck: false });
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      console.log("msg: ", msg);
      // console.log("data: ", data);
      console.dir("data2: ", data, { depth: null });
      // 요청 ID(correlationId)를 확인하여 응답을 매칭
      if (data.correlationId === correlationId) {
        channel.ack(msg);  // 처리 완료된 메시지에 대해 ack
        return data;
      }

      // 응답을 찾지 못한 경우 해당 메시지를 다시 큐에 넣기
      channel.nack(msg, false, true);
    }
    // 메시지가 없으면 300ms 대기 후 재시도
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  throw new Error(`${queueName} 큐에서 메시지를 받지 못했습니다.`);
}


module.exports = {
  sendUniversityURL,
  sendUniversityID,
  receiveUniversityData,
  generateCorrelationId,
};
