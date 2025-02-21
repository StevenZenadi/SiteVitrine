# Utilise une image Node.js légère
FROM node:16-alpine

WORKDIR /app

# Copie les fichiers de configuration et installe les dépendances
COPY package.json package-lock.json ./
RUN npm install

# Copie le reste du code
COPY . .

# Expose le port utilisé par le front-end (ici 3000)
EXPOSE 3000

# Commande de démarrage (ajuste selon ton script start)
CMD ["npm", "start"]
