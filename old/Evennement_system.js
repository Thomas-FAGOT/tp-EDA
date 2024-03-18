const EventEmitter = require('eventemitter3');

// Classe pour représenter un événement
class Evenement {
    constructor(nom, lieu, date) {
        this.nom = nom;
        this.lieu = lieu;
        this.date = date;
    }
}

// Producteur d'événements
class ProducteurEvenements {
    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    start() {
        // Générer un événement toutes les 3 secondes
        this.intervalId = setInterval(() => {
            const nom = `Événement ${Math.floor(Math.random() * 100)}`;
            const lieu = `Lieu ${Math.floor(Math.random() * 100)}`;
            const date = new Date();
            const evenement = new Evenement(nom, lieu, date);
            this.eventEmitter.emit('nouvelEvenement', evenement);
        }, 3000);
    }

    stop() {
        clearInterval(this.intervalId);
    }
}

// Consommateur d'événements
class ConsommateurEvenements {
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    ecouterEvenements() {
        this.eventEmitter.on('nouvelEvenement', (evenement) => {
            console.log(`Nouvel événement : ${evenement.nom}, Lieu : ${evenement.lieu}, Date : ${evenement.date}`);
        });
    }
}

// Création d'une instance de EventEmitter pour être partagée entre le producteur et le consommateur
const eventEmitter = new EventEmitter();

// Création d'instances du producteur et du consommateur en leur passant la même instance de EventEmitter
const producteur = new ProducteurEvenements(eventEmitter);
const consommateur = new ConsommateurEvenements(eventEmitter);

// Lancement du consommateur pour écouter les événements
consommateur.ecouterEvenements();

// Démarrage du producteur pour générer des événements
producteur.start();

// Arrêt du producteur après 15 secondes
setTimeout(() => {
    producteur.stop();
    console.log("Arrêt du producteur.");
}, 15000);
