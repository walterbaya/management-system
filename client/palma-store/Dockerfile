# Usa una imagen base de Node.js
FROM node:18.2.0

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración del proyecto
COPY package.json package-lock.json ./

# Instala las dependencias usando npm con --legacy-peer-deps
RUN npm install --legacy-peer-deps

# Copia el resto del código del proyecto
COPY . .

# Expone el puerto 3001 (o el que definas en tu .env)
EXPOSE 3001

# Inicia la aplicación en modo desarrollo (similar a npm start)
CMD ["npm", "start"]