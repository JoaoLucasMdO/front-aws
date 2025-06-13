# Imagem base do Node.js
FROM node:18-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install --force

# Copia o restante dos arquivos
COPY . .

# Expõe a porta padrão do React (3000)
EXPOSE 3000

# Comando para iniciar a aplicação em modo dev
CMD ["npm", "start"]
