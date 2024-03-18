const EventEmitter = require('eventemitter3');

class Commande {
    constructor(type, quantite) {
        this.type = type;
        this.quantite = quantite;
    }
}

class CommandeBroker extends EventEmitter {
    constructor() {
        super();
    }

    passerCommande(commande) {
        this.emit('nouvelleCommande', commande);
    }

    traiterCommande(type, callback) {
        this.on(type, callback);
    }
}

// Création d'une instance de CommandeBroker
const commandeBroker = new CommandeBroker();

// Producteur de commandes
function passerNouvelleCommande(type, quantite) {
    const nouvelleCommande = new Commande(type, quantite);
    commandeBroker.passerCommande(nouvelleCommande);
}

// Consommateur pour les commandes de livraison
function consommateurLivraison(commande) {
    console.log(`[Livraison] Nouvelle commande: ${commande.quantite} ${commande.type}`);
}

// Consommateur pour les commandes de facturation
function consommateurFacturation(commande) {
    console.log(`[Facturation] Nouvelle commande: ${commande.quantite} ${commande.type}`);
}

// Consommateur pour les commandes de stock
function consommateurStock(commande) {
    console.log(`[Stock] Nouvelle commande: ${commande.quantite} ${commande.type}`);
}

// Traitement des commandes de livraison
commandeBroker.traiterCommande('livraison', consommateurLivraison);

// Traitement des commandes de facturation
commandeBroker.traiterCommande('facturation', consommateurFacturation);

// Traitement des commandes de stock
commandeBroker.traiterCommande('stock', consommateurStock);

// Simulation de nouvelles commandes
passerNouvelleCommande('livraison', 10);
passerNouvelleCommande('facturation', 5);
passerNouvelleCommande('stock', 20);
