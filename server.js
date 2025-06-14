require('dotenv').config();
const express = require('express');
const app = express();
//BD
const mongoose = require('mongoose');
const mysql = require('mysql2/promise');

//swagger
const swaggerDocs = require('./swagger');
//S3
const AWS = require('aws-sdk');

//Log
const { logInfo, logError } = require('./logger');

app.use(express.json());

const cors = require('cors');
app.use(cors({
    origin: 'http://dsm-vot-front-p2.duckdns.org', // ou use '*' para liberar para todos
    credentials: true
}));

/**
* @swagger
* tags:
*   - name: CRUD MongoDb
*     description: Operações de CRUD para usuários no MongoDb.
*   - name: Buckets
*     description: Operações de Listar buckets, upload e remoção de arquivo para um bucket S3.
*/


//#region CRUD MongoDb
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => logInfo('MongoDB conectado', null))
    .catch(err => logError('Erro ao logar mongodb' + err, null, err));

const UserSchema = new mongoose.Schema({
    nome: String,
    email: String
});

const User = mongoose.model('Usuario', UserSchema);

/**
 * @swagger
 * /mongodb/testar-conexao:
 *   get:
 *     tags:
 *       - CRUD MongoDb
 *     summary: Testa a conexão com o MongoDB
 *     description: Verifica se a aplicação consegue se conectar ao MongoDB.
 *     responses:
 *       200:
 *         description: Conexão bem-sucedida
 *       500:
 *         description: Erro na conexão com o MongoDB
 */
app.get('/mongodb/testar-conexao', async (req, res) => {
    try {
        //Tentando conectar ao MongoDB
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        const user = await User.findOne(); //Consulta simples (primeiro usuário encontrado)

        logInfo('Conexão com o MongoDB efetuada com sucesso', req);

        if (user) {
            res.status(200).send('Conexão com o MongoDB bem-sucedida e usuário encontrado!');
        } else {
            res.status(200).send('Conexão com o MongoDB bem-sucedida, mas nenhum usuário encontrado.');
        }
    } catch (error) {
        await logError('Erro ao conectar no MongoDb' + error, req, error);
        res.status(500).send('Erro na conexão com o MongoDB');
    }
});

/**
 * @swagger
 * /usuarios:
 *   post:
 *     tags:
 *       - CRUD MongoDb
 *     summary: Criar um novo usuário
 *     description: Este endpoint cria um novo usuário no sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do usuário
 *               email:
 *                 type: string
 *                 description: Email do usuário
 *             required:
 *               - nome
 *               - email
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID do usuário
 *                 nome:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Requisição inválida.
 */
app.post('/usuarios', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        logInfo('Usuário criado', req);
        res.status(201).send(user);
    } catch (error) {
        logError("Erro ao criar usuário", req, error?.message || error.toString());
        res.status(500).send('Ocorreu um erro interno');
    }
});

/**
 * @swagger
 * /usuarios:
 *   get:
 *     tags:
 *       - CRUD MongoDb
 *     summary: Listar todos os usuários
 *     description: Este endpoint retorna todos os usuários cadastrados no sistema.
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nome:
 *                     type: string
 *                   email:
 *                     type: string
 */
app.get('/usuarios', async (req, res) => {
    try {
        const users = await User.find();
        logInfo('Usuários encontrados', req, users);
        res.send(users);
    } catch (error) {
        logError("Erro ao buscar usuários", req, error);
        res.status(500).send('Ocorreu um erro interno');
    }

});

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     tags:
 *       - CRUD MongoDb
 *     summary: Obter um usuário específico
 *     description: Este endpoint retorna um usuário baseado no ID fornecido.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Usuário não encontrado.
 */
app.get('/usuarios/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('Usuário não encontrado');

        logInfo('Usuário encontrado', req, user);
        res.send(user);
    } catch (error) {
        logError("Erro ao buscar usuário", req, error);
        res.status(500).send('Ocorreu um erro interno');
    }

});

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     tags:
 *       - CRUD MongoDb
 *     summary: Atualizar um usuário específico
 *     description: Este endpoint atualiza um usuário baseado no ID fornecido.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Usuário não encontrado.
 */
app.put('/usuarios/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).send('Usuário não encontrado');

        logInfo('Usuário atualizado', req, user);
        res.send(user);
    } catch (error) {
        logError("Erro ao atualizar usuário", req, error);
        res.status(500).send('Ocorreu um erro interno');
    }
});

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     tags:
 *       - CRUD MongoDb
 *     summary: Remover um usuário específico
 *     description: Este endpoint remove um usuário baseado no ID fornecido.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário removido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Usuário não encontrado.
 */
app.delete('/usuarios/:id', async (req, res) => {
    try {
        const result = await User.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).send('Usuário não encontrado');
        }

        logInfo('Usuário removido', req);
        res.send({ message: 'Usuário removido com sucesso' });
    } catch (error) {
        logError("Erro ao remover usuário", req, error)
        res.status(500).send('Ocorreu um erro interno');
    }

});
//#endregion

//#region S3
AWS.config.update({
    region: process.env.REGION,
});

const s3 = new AWS.S3();

/**
 * @swagger
 * /buckets:
 *   get:
 *     summary: Lista todos os buckets
 *     tags: 
 *       - Buckets
 *     responses:
 *       200:
 *         description: Lista de todos os buckets
 */
app.get('/buckets', async (req, res) => {
    try {
        const data = await s3.listBuckets().promise();
        logInfo('Buckets encontrados', req, data.Buckets);
        res.status(200).json(data.Buckets);
    } catch (error) {
        logError("Erro ao buscar buckets", req, error);
        res.status(500).json({ error: 'Erro ao listar buckets', details: error });
    }
});

/**
 * @swagger
 * /buckets/{bucketName}:
 *   get:
 *     summary: Lista os objetos de um bucket
 *     tags: 
 *       - Buckets
 *     parameters:
 *       - in: path
 *         name: bucketName
 *         required: true
 *         description: Nome do bucket
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista dos objetos do bucket
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/S3Object'
 */

app.get('/buckets/:bucketName', async (req, res) => {
    const { bucketName } = req.params;
    const params = {
        Bucket: bucketName,
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        logInfo('Objetos encontrados', req, data.Contents);
        res.status(200).json(data.Contents);
    } catch (error) {
        logError("Erro ao buscar objetos", req, error);
        res.status(500).json({ error: 'Erro ao listar objetos do bucket', details: error });
    }
});

/**
 * @swagger
 * /buckets/upload:
 *   post:
 *     summary: Faz o upload de um arquivo para um bucket
 *     tags: 
 *       - Buckets
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Arquivo enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 */
//Utilizar alguma lib para fazer o upload/strem de arquivos, sugestão: multer
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

app.post('/buckets/upload', upload.single('file'), async (req, res) => {

    const bucketName = process.env.BUCKET_NAME;

    const params = {
        Bucket: bucketName,
        Key: req.file.originalname,
        Body: req.file.buffer,
    };

    try {
        const data = await s3.upload(params).promise();
        logInfo('Upload efetuado', req, data);
        res.status(200).json({ message: 'Upload realizado com sucesso', data });
    } catch (error) {
        logError("Erro ao efetuar upload", req, error);
        res.status(500).json({ error: 'Erro ao fazer upload', details: error });
    }
});


/**
 * @swagger
 * /buckets/file/{fileName}:
 *   delete:
 *     summary: Deleta um arquivo específico de um bucket
 *     tags: 
 *       - Buckets
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         description: Nome do arquivo a ser deletado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Arquivo deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Arquivo não encontrado no bucket
 */
app.delete('/buckets/file/:fileName', async (req, res) => {
    const { fileName } = req.params;
    const bucketName = process.env.BUCKET_NAME;

    const params = {
        Bucket: bucketName,
        Key: fileName,
    };

    try {
        await s3.headObject(params).promise(); // Verifica se o arquivo existe
        await s3.deleteObject(params).promise(); // Deleta
        logInfo(`Arquivo ${fileName} deletado do bucket ${bucketName}`, req);
        res.status(200).json({ message: `Arquivo '${fileName}' deletado com sucesso do bucket '${bucketName}'` });
    } catch (error) {
        if (error.code === 'NotFound') {
            res.status(404).json({ error: 'Arquivo não encontrado no bucket' });
        } else {
            logError("Erro ao deletar arquivo do bucket", req, error);
            res.status(500).json({ error: 'Erro ao deletar o arquivo', details: error });
        }
    }
});
//#endregion

//#region MySQL
// Conexão MySQL
const mysqlPool = mysql.createPool({
    host: process.env.CNN_MYSQL_DB_HOST.replace(/"/g, ''),
    user: process.env.CNN_MYSQL_DB_USER.replace(/"/g, ''),
    password: process.env.CNN_MYSQL_DB_PASSWORD.replace(/"/g, ''),
    database: process.env.CNN_MYSQL_DB_NAME.replace(/"/g, ''),
    port: process.env.CNN_MYSQL_DB_PORT.replace(/"/g, ''),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Produto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do produto
 *         nome:
 *           type: string
 *           description: Nome do produto
 *         preco:
 *           type: number
 *           format: float
 *           description: Preço do produto
 *         estoque:
 *           type: integer
 *           description: Quantidade em estoque
 */

/**
 * @swagger
 * /produtos:
 *   get:
 *     tags:
 *       - Produtos
 *     summary: Listar todos os produtos
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 */
app.get('/produtos', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query('SELECT * FROM produtos');
        logInfo('Produtos listados com sucesso', req, rows);
        res.json(rows);
    } catch (error) {
        logError("Erro ao buscar produtos", req, error?.message || error.toString());
        res.status(500).send('Erro ao buscar produtos');
    }
});

/**
 * @swagger
 * /produtos:
 *   post:
 *     tags:
 *       - Produtos
 *     summary: Criar um novo produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Produto'
 *     responses:
 *       201:
 *         description: Produto criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 */
app.post('/produtos', async (req, res) => {
    try {
        const { nome, preco, estoque } = req.body;
        const [result] = await mysqlPool.query(
            'INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)',
            [nome, preco, estoque]
        );
        const produtoCriado = { id: result.insertId, nome, preco, estoque };
        logInfo('Produto criado com sucesso', req, produtoCriado);
        res.status(201).json(produtoCriado);
    } catch (error) {
        logError("Erro ao criar produto", req, error?.message || error.toString());
        res.status(500).send('Erro ao criar produto');
    }
});

/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     tags:
 *       - Produtos
 *     summary: Buscar produto por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado
 */
app.get('/produtos/:id', async (req, res) => {
    try {
        const [rows] = await mysqlPool.query('SELECT * FROM produtos WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).send('Produto não encontrado');
        logInfo('Produto encontrado', req, rows[0]);
        res.json(rows[0]);
    } catch (error) {
        logError("Erro ao buscar produto", req, error?.message || error.toString());
        res.status(500).send('Erro ao buscar produto');
    }
});

/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     tags:
 *       - Produtos
 *     summary: Atualizar produto por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Produto'
 *     responses:
 *       200:
 *         description: Produto atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado
 */
app.put('/produtos/:id', async (req, res) => {
    try {
        const { nome, preco, estoque } = req.body;
        const [result] = await mysqlPool.query(
            'UPDATE produtos SET nome = ?, preco = ?, estoque = ? WHERE id = ?',
            [nome, preco, estoque, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).send('Produto não encontrado');
        const produtoAtualizado = { id: req.params.id, nome, preco, estoque };
        logInfo('Produto atualizado com sucesso', req, produtoAtualizado);
        res.json(produtoAtualizado);
    } catch (error) {
        logError("Erro ao atualizar produto", req, error?.message || error.toString());
        res.status(500).send('Erro ao atualizar produto');
    }
});

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     tags:
 *       - Produtos
 *     summary: Remover produto por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto removido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Produto não encontrado
 */
app.delete('/produtos/:id', async (req, res) => {
    try {
        const [result] = await mysqlPool.query('DELETE FROM produtos WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).send('Produto não encontrado');
        logInfo('Produto removido com sucesso', req, { id: req.params.id });
        res.json({ message: 'Produto removido' });
    } catch (error) {
        logError("Erro ao remover produto", req, error?.message || error.toString());
        res.status(500).send('Erro ao remover produto');
    }
});
//#endregion


swaggerDocs(app);
app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
