# 📊 SDN Supervision - Tableau de Bord de Monitoring Réseau

Une application web de supervision et de monitoring en temps réel pour les réseaux Software-Defined (SDN) via un contrôleur Ryu.

## 📋 Table des matières

- [À propos](#à-propos)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [API REST](#api-rest)
- [Structure du projet](#structure-du-projet)
- [Licence](#licence)

## 🎯 À propos

**SDN Supervision** est un tableau de bord web de monitoring en temps réel pour les réseaux SDN. Cette application permet aux administrateurs réseau de :
- Visualiser l'ensemble des commutateurs OpenFlow connectés
- Surveiller les statistiques de trafic par port (paquets, octets)
- Mettre à jour les données automatiquement chaque 5 secondes
- Analyser les performances réseau en temps réel

L'application communique avec l'API REST du contrôleur Ryu pour récupérer les données de supervision des switches et ports du réseau SDN.

## ✨ Fonctionnalités

### Interface Web
- **Sélecteur de commutateurs** : Dropdown dynamique listant tous les switches connectés
- **Tableau de statistiques en temps réel** :
  - Numéro du port
  - Paquets reçus (RX Packets)
  - Paquets transmis (TX Packets)
  - Octets reçus (RX Bytes)
  - Octets transmis (TX Bytes)
- **Rafraîchissement automatique** : Mise à jour toutes les 5 secondes
- **Sélection dynamique** : Changement instantané des statistiques lors du changement de switch
- **Interface responsive** : Tableau formaté et facile à consulter

### Backend Flask
- Endpoints API REST pour récupérer les switchs
- Endpoint pour obtenir les statistiques détaillées par port
- Gestion d'erreurs gracieuse avec valeurs par défaut
- Filtrage et formatage des données

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Interface Web HTML/CSS/JavaScript              │
│              (Frontend - templates/index.html)              │
└────────────────────┬────────────────────────────────────────┘
                     │
         Fetch API (JSON REST)
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend Flask (app.py)                         │
│         - /api/switches - /api/ports/{dpid}                │
└────────────────────┬────────────────────────────────────────┘
                     │
         HTTP Requests (REST API)
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Ryu Controller REST API                         │
│          (Port 8080 - localhost:8080)                       │
│   /stats/switches - /stats/port/{dpid}                     │
└────────────────────┬────────────────────────────────────────┘
                     │
         OpenFlow Protocol (1.3)
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            Commutateurs OpenFlow (Switches)                 │
│           Collecte des statistiques réseau                 │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Prérequis

- **Python 3.7+**
- **Flask** : Framework web backend
- **Requests** : Client HTTP pour communiquer avec Ryu
- **Ryu** : Contrôleur OpenFlow avec API REST
- **Navigateur moderne** : Support de Fetch API (ES6)
- **Accès à une API REST Ryu** sur `http://localhost:8080`

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/Uriel-Ondo/sdn_supervision.git
cd sdn_supervision
```

### 2. Créer un environnement virtuel (recommandé)

```bash
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
```

### 3. Installer les dépendances

```bash
pip install -r requirements.txt
```

Ou manuellement :
```bash
pip install flask requests
```

## ⚙️ Configuration

### Démarrer le contrôleur Ryu

Avant de lancer l'application de supervision, démarrez le contrôleur Ryu :

```bash
ryu-manager ofctl_rest.py
```

L'API REST sera disponible sur `http://localhost:8080`

### Ajuster l'URL de l'API Ryu

Modifiez la variable `RYU_REST_URL` dans `app.py` si votre contrôleur Ryu s'exécute sur une autre adresse/port :

```python
RYU_REST_URL = 'http://127.0.0.1:8080'  # À modifier selon votre configuration
```

## 🎮 Utilisation

### Lancer l'application

```bash
python app.py
```

L'application sera accessible sur `http://localhost:5000`

### Navigation

1. **Accès au tableau de bord** : Ouvrez `http://localhost:5000` dans votre navigateur
2. **Sélection du commutateur** : Utilisez le dropdown "Switch" pour choisir le switch à monitorer
3. **Consultation des statistiques** : Visualisez les statistiques de trafic par port
4. **Mise à jour automatique** : Les données se rafraîchissent automatiquement toutes les 5 secondes

### Interprétation des données

- **Port** : Numéro du port physique sur le switch
- **RX Packets** : Nombre total de paquets reçus sur ce port
- **TX Packets** : Nombre total de paquets transmis depuis ce port
- **RX Bytes** : Nombre total d'octets reçus sur ce port
- **TX Bytes** : Nombre total d'octets transmis depuis ce port

## 🔌 API REST

### Endpoints

#### Lister tous les switches connectés (GET)
```bash
curl http://localhost:5000/api/switches
```

**Réponse** :
```json
[1, 2, 3]
```

#### Obtenir les statistiques de ports pour un switch (GET)
```bash
curl http://localhost:5000/api/ports/1
```

**Réponse** :
```json
[
  {
    "port_no": 1,
    "rx_packets": 1050,
    "tx_packets": 980,
    "rx_bytes": 125000,
    "tx_bytes": 115000
  },
  {
    "port_no": 2,
    "rx_packets": 2100,
    "tx_packets": 1960,
    "rx_bytes": 250000,
    "tx_bytes": 230000
  }
]
```

## 📁 Structure du projet

```
sdn_supervision/
├── app.py                   # Application Flask principale
├── templates/
│   └── index.html          # Page HTML de supervision
├── static/
│   └── app.js              # Logique JavaScript frontend
├── README.md               # Ce fichier
├── LICENSE                 # Licence MIT
└── requirements.txt        # Dépendances Python
```

## 🔐 Sécurité

⚠️ **Recommandations pour la production** :
- Utilisez HTTPS (ajoutez SSL/TLS)
- Implémentez une authentification utilisateur
- Limitez l'accès à l'API REST du contrôleur Ryu
- Ajoutez une validation et sanitisation des entrées
- Utilisez des variables d'environnement pour les configurations sensibles
- Désactivez le mode debug : `app.run(debug=False)`

## 🛠️ Dépannage

### Le tableau de bord affiche "No data" ou est vide

**Solutions** :
1. Vérifiez que le contrôleur Ryu est lancé : `ryu-manager ofctl_rest.py`
2. Vérifiez l'adresse/port dans `RYU_REST_URL`
3. Testez la connexion :
   ```bash
   curl http://localhost:8080/stats/switches
   ```
4. Assurez-vous qu'au moins un switch OpenFlow est connecté au contrôleur

### L'API Ryu ne répond pas

```bash
# Vérifiez que Ryu écoute sur le port 8080
netstat -an | grep 8080

# Consultez les logs de Ryu
# Redémarrez le contrôleur
```

### Les données ne se mettent pas à jour

- Vérifiez la console de votre navigateur (F12) pour les erreurs JavaScript
- Vérifiez que le switch est toujours connecté au contrôleur
- Vérifiez la connexion réseau entre l'application et le contrôleur

### Erreur CORS

Si vous voyez une erreur CORS dans la console :
- Cela signifie que l'API Ryu et l'app Flask ne sont pas sur le même domaine
- Utilisez le même serveur Flask pour servir les deux (configuration par défaut)

## 📊 Informations supplémentaires

### Fréquence de rafraîchissement

Le tableau se met à jour **automatiquement chaque 5 secondes**. Vous pouvez modifier cette valeur dans `static/app.js` :

```javascript
setInterval(fetchPorts, 5000);  // 5000ms = 5 secondes
```

### Limitation des données affichées

Seules les statistiques essentielles sont affichées pour simplifier l'interface. D'autres statistiques disponibles auprès du contrôleur Ryu peuvent être ajoutées en modifiant le filtrage dans `app.py`.

## 📚 Ressources utiles

- [Documentation Ryu](https://ryu.readthedocs.io/)
- [OpenFlow 1.3 Specification](https://opennetworking.org/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [REST API Ryu](https://github.com/osrg/ryu/wiki/REST_API)
- [Software-Defined Networking (SDN)](https://www.opennetworking.org/)

## 📝 Licence

Ce projet est sous licence **MIT**. Consultez le fichier [LICENSE](LICENSE) pour plus de détails.

---

**Auteur** : Uriel-Ondo  
**Créé** : Juin 2025  
**Dernière mise à jour** : Mars 2026
