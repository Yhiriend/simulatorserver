const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'simulator.db')
});

const Catalogue = sequelize.define('Catalogue', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'catalogue',
    timestamps: false
});

const Processes = sequelize.define('Processes', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    PID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    priority: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_catalogue: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Catalogue,
            key: 'id'
        }
    }
}, {
    tableName: 'processes',
    timestamps: false
});

sequelize.sync().then(() => {
    console.log('Base de datos sincronizada');
});

app.post('/catalogue', async (req, res) => {
    const { id, name } = req.body;
    try {
        const newCatalogue = await Catalogue.create({ id, name });
        res.status(201).json(newCatalogue);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/processes', async (req, res) => {
    const { PID, name, user, description, priority, id_catalogue } = req.body;
    try {
        const newProcess = await Processes.create({ PID, name, user, description, priority, id_catalogue });
        res.status(201).json(newProcess);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/createTxtFile', async (req, res) => {
    try {
        const filePath = await createTxtFile(req.body);
        console.log(`Archivo ${filePath} creado exitosamente`);
        res.status(201).json({ message: `Archivo ${filePath} creado exitosamente` });
    } catch (error) {
        console.error('Error al crear el archivo:', error);
        res.status(500).json({ error: 'Error interno del servidor al crear el archivo' });
    }
});

function createTxtFile(processData) {
    const { PID, name, description } = processData;
    const fileName = `${name}_${PID}.txt`;
    const filePath = path.join('file_by_process', fileName);
    const fileContent = `${description.slice(0, [description.length - 2])}`;

    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, fileContent, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(filePath);
            }
        });
    });
}

app.get('/readTxtFile/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join('file_by_process', fileName);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            res.status(500).json({ error: 'Error interno del servidor al leer el archivo' });
        } else {
            console.log(`Archivo ${fileName} leído exitosamente`);
            res.status(200).json({ fileName: fileName, content: data });
        }
    });
});

app.get('/catalogue', async (req, res) => {
    try {
        const catalogues = await Catalogue.findAll();
        res.status(200).json(catalogues);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/processes', async (req, res) => {
    try {
        const processes = await Processes.findAll();
        res.status(200).json(processes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
