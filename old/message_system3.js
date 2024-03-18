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
        this.subscriptions = {}; // Stockage des abonnements par utilisateur
    }

    publish(message) {
        this.emit(message.channel, message);
    }

    subscribe(channel, user, callback) {
        if (!this.subscriptions[user]) {
            this.subscriptions[user] = [];
        }
        this.subscriptions[user].push({ channel, callback });
        this.on(channel, callback);
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

// Définition des abonnements pour les utilisateurs
const userSubscriptions = {
    'Alice': ['sports'],
    'John': ['news']
};

// Connexion utilisateur
function loginUser(user) {
    console.log(`Utilisateur ${user} connecté.`);
    // Activation des abonnements pour l'utilisateur
    userSubscriptions[user].forEach(channel => {
        messageBroker.subscribe(channel, user, channel === 'sports' ? sportsMessageSubscriber : newsMessageSubscriber);
    });
}

// Déconnexion utilisateur
function logoutUser(user) {
    console.log(`Utilisateur ${user} déconnecté.`);
    // Annuler tous les abonnements de l'utilisateur
    messageBroker.unsubscribeAll(user);
}

sendMessage('Alice', 'Un match de football est prévu ce soir.', 'sports');
sendMessage('Bob', 'Un nouveau président a été élu.', 'news');
sendMessage('Charlie', 'Prévisions météorologiques: ensoleillé toute la journée.', 'weather');

loginUser('Alice');

sendMessage('David', 'Nouvelle actualité: une tempête approche.', 'weather');
sendMessage('Eva', 'Des Jeux Olympiques auront lieu l année prochaine.', 'sports');
sendMessage('Frank', 'Un nouveau film est sorti.', 'news');

logoutUser('Alice');
