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
        this.subscriptions = {}; 
        this.messagesHistory = {};
    }

    publish(message) {
        this.emit(message.channel, message);
        if (!this.messagesHistory[message.channel]) {
            this.messagesHistory[message.channel] = [];
        }
        this.messagesHistory[message.channel].push(message);
    }

    subscribe(channel, user, callback) {
        if (!this.subscriptions[user]) {
            this.subscriptions[user] = [];
        }
        this.subscriptions[user].push({ channel, callback });
        this.on(channel, callback);

        if (this.messagesHistory[channel]) {
            this.messagesHistory[channel].forEach(message => {
                if (message.channel === channel) {
                    callback(message);
                }
            });
        }
    }

    unsubscribeAll(user) {
        if (this.subscriptions[user]) {
            this.subscriptions[user].forEach(subscription => {
                this.off(subscription.channel, subscription.callback);
            });
            delete this.subscriptions[user];
        }
    }
}

const messageBroker = new MessageBroker();

function sendMessage(author, content, channel) {
    const message = new Message(author, content, channel);
    messageBroker.publish(message);
}

function sportsMessageSubscriber(message) {
    console.log(`[Sports] Nouveau message de ${message.author}: ${message.content}`);
}
function newsMessageSubscriber(message) {
    console.log(`[News] Nouveau message de ${message.author}: ${message.content}`);
}

const userSubscriptions = {
    'Alice': ['sports'],
    'John': ['news']
};

function loginUser(user) {
    console.log(`Utilisateur ${user} connecté.`);
    userSubscriptions[user].forEach(channel => {
        messageBroker.subscribe(channel, user, channel === 'sports' ? sportsMessageSubscriber : newsMessageSubscriber);
    });
}

function logoutUser(user) {
    console.log(`Utilisateur ${user} déconnecté.`);
    messageBroker.unsubscribeAll(user);
}

sendMessage('Alice', 'Un match de football est prévu ce soir.', 'sports');
sendMessage('Bob', 'Un nouveau président a été élu.', 'news');
sendMessage('Charlie', 'Prévisions météorologiques: ensoleillé toute la journée.', 'weather');

loginUser('Eva');

sendMessage('David', 'Nouvelle actualité: une tempête approche.', 'weather');
sendMessage('Eva', 'Des Jeux Olympiques auront lieu l année prochaine.', 'sports');
sendMessage('Frank', 'Un nouveau film est sorti.', 'news');

logoutUser('Eva');
