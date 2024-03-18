class Message {
    constructor(author, content, channel) {
        this.author = author;
        this.content = content;
        this.channel = channel;
    }
}

class MessageBroker {
    constructor() {
        this.channels = {};
    }

    publish(message) {
        if (!this.channels[message.channel]) {
            console.log(`Aucun abonné à la chaîne ${message.channel}. Message non publié.`);
            return;
        }

        this.channels[message.channel].forEach(subscriber => {
            subscriber(message);
        });
    }

    subscribe(channel, callback) {
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }

        this.channels[channel].push(callback);
    }
}

// Création d'une instance de MessageBroker
const messageBroker = new MessageBroker();

// Producteur de messages
function sendMessage(author, content, channel) {
    const message = new Message(author, content, channel);
    messageBroker.publish(message);
}

// Consommateur de messages
function messageSubscriber(message) {
    console.log(`[${message.channel}] Nouveau message de ${message.author}: ${message.content}`);
}

// Abonnement à des chaînes spécifiques
messageBroker.subscribe('sports', messageSubscriber);
messageBroker.subscribe('news', messageSubscriber);
messageBroker.subscribe('weather', messageSubscriber);

// Envoi de quelques messages
sendMessage('Alice', 'Un match de football est prévu ce soir.', 'sports');
sendMessage('Bob', 'Un nouveau président a été élu.', 'news');
sendMessage('Charlie', 'Prévisions météorologiques: ensoleillé toute la journée.', 'weather');
sendMessage('Charlie', 'Prévisions météorologiques: ensoleillé toute la journée.', 'IT');
