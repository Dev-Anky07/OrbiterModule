import amqp, { Connection, Channel, ConsumeMessage } from 'amqplib/callback_api';

class RabbitMQ {
    private connection!: Connection;
    public channel!: Channel;

    constructor(private uri: string) { }

    public connect(): Promise<Channel> {
        return new Promise((resolve, reject) => {
            const options = {
                clientProperties: {
                    connection_name: 'maker-client-v1'
                }
            };
            amqp.connect(this.uri, options, (err: any, conn: Connection) => {
                if (err) {
                    return reject(err);
                }


                this.connection = conn;

                conn.createChannel((err: any, channel: Channel) => {
                    if (err) {
                        return reject(err);
                    }
                    this.channel = channel;
                    resolve(channel);
                });
            });
        });
    }

    public async publish(exchange: string, routingKey: string, message: string) {
        return await this.channel.publish(exchange, routingKey, Buffer.from(message));
    }

    public subscribe(queue: string, onMessage: (msg: ConsumeMessage | null) => void) {
        // this.channel.assertQueue(queue, { durable: true });
        this.channel.consume(queue, onMessage, { noAck: true });
    }

    public close() {
        this.connection.close();
    }
}

export default RabbitMQ;
