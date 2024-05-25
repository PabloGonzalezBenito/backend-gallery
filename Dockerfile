FROM node:16

# Crear el directorio de la aplicación
WORKDIR /usr/src/app

# Copiar los archivos de package.json y package-lock.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto en el que la aplicación escuchará
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]