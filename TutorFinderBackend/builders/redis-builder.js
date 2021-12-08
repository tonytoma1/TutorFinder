const { createClient } = require('redis');

class RedisBuilder {
    redisClient;
    subscriber;
    constructor(redisClient, subscriber) {
        this.redisClient = redisClient;
        this.subscriber = subscriber;
    }

    static async build(url) {
        let client;
        let sub;
        if(url)
            client = createClient(url);
        else
            client = createClient();

        await client.connect();
        sub = client.duplicate();
        await sub.connect();
        
        return new RedisBuilder(client, sub);
    }

    getRedisClient(){
        return this.redisClient;
    }

    getSubscriber() {
        return this.subscriber;
    }
    
}

module.exports = {RedisBuilder}