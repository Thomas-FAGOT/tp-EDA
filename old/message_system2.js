const EventEmitter = require('eventemitter3');

class Message {
    constructor(author, content, channel) {
        this.author = author;
        this.content = content;
        this.channel = channel;
    }
}

class MessageBroker extends EventEmitter {
    constructor() {
        super();
    }

    publish(message) {
        this.emit(message.channel, message);
    }

    subscribe(channel, callback) {
        this.on(channel, callback);
    }
}

// Création d'une instance de MessageBroker
const messageBroker = new MessageBroker();

// Producteur de messages
function sendMessage(author, content, channel) {
    const message = new Message(author, content, channel);
    messageBroker.publish(message);
}

// Consommateur pour les messages de sports
function sportsMessageSubscriber(message) {
    console.log(`[Sports] Nouveau message de ${message.author}: ${message.content}`);
}

// Consommateur pour les messages de nouvelles
function newsMessageSubscriber(message) {
    console.log(`[News] Nouveau message de ${message.author}: ${message.content}`);
}

// Abonnement à des chaînes spécifiques
messageBroker.subscribe('sports', sportsMessageSubscriber);
messageBroker.subscribe('news', newsMessageSubscriber);

// Envoi de quelques messages
sendMessage('Alice', 'Un match de football est prévu ce soir.', 'sports');
sendMessage('Bob', 'Un nouveau président a été élu.', 'news');
sendMessage('Charlie', 'Prévisions météorologiques: ensoleillé toute la journée.', 'weather');
