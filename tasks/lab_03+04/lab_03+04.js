const express = require('express');
const mysql = require('mysql2');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const app = express();
const port = 3000;
app.use(express.json());
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test',
});

db.connect((err) => {
    if (err) {
        console.error('Blad polaczenia z baza danych MySQL:', err);
    } else {
        console.log('Polaczono z baza danych MySQL');
    }
});

// Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'CRUD API',
            version: '1.0.0',
            description: 'Yahor Prykhodzka, 20975 Informatyka 4 rok, Testowanie opragramowania',
        },
    },
    apis: ['./tasks/**/*.js'], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

/**
 * @swagger
 * /persons:
 *   get:
 *     description: Zapytanie o wszystkie dane osob z tabeli persons
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */
app.get('/persons', (req, res) => {
    db.query('SELECT * FROM persons', (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(results);
        }
    });
});

/**
 * @swagger
 * /persons/{id}:
 *   get:
 *     description: Pobieranie danych osob wedlug id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identyfikator osoby
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Nie znaleziono osoby
 *       500:
 *         description: Internal Server Error
 */
app.get('/persons/:id', (req, res) => {
    const personId = req.params.id;
    db.query(
        'SELECT * FROM persons WHERE id = ?',
        [personId],
        (err, results) => {
            if (err) {
                res.status(500).send(err.message);
            } else if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).send('Person not found');
            }
        }
    );
});

/**
 * @swagger
 * /persons:
 *   post:
 *     description: Dodac osobe
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 3
 *               lastName:
 *                 type: string
 *                 minLength: 3
 *     responses:
 *       201:
 *         description: Osoba dodana
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
app.post('/persons', (req, res) => {
    const { firstName, lastName } = req.body;

    if (
        !firstName ||
        !lastName ||
        firstName.length < 3 ||
        lastName.length < 3
    ) {
        res.status(400).send('Invalid data');
        return;
    }

    db.query(
        'INSERT INTO persons (firstName, lastName) VALUES (?, ?)',
        [firstName, lastName],
        (err, results) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                const insertedPersonId = results.insertId;
                res.status(201).json({
                    id: insertedPersonId,
                    firstName,
                    lastName,
                });
            }
        }
    );
});

/**
 * @swagger
 * /persons/{id}:
 *   put:
 *     description: Aktualizacja osoby według id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID osoby
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 3
 *               lastName:
 *                 type: string
 *                 minLength: 3
 *     responses:
 *       200:
 *         description: Osoba zaktulizowana
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Niema takiej osoby
 *       500:
 *         description: Internal Server Error
 */
app.put('/persons/:id', (req, res) => {
    const personId = req.params.id;
    const { firstName, lastName } = req.body;

    if (
        !firstName ||
        !lastName ||
        firstName.length < 3 ||
        lastName.length < 3
    ) {
        res.status(400).send('Invalid data');
        return;
    }

    db.query(
        'UPDATE persons SET firstName = ?, lastName = ? WHERE id = ?',
        [firstName, lastName, personId],
        (err, results) => {
            if (err) {
                res.status(500).send(err.message);
            } else if (results.affectedRows > 0) {
                res.json({ id: personId, firstName, lastName });
            } else {
                res.status(404).send('Person not found');
            }
        }
    );
});

/**
 * @swagger
 * /persons/{id}:
 *   delete:
 *     description: Usun osobe wedlug id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID osoby
 *     responses:
 *       200:
 *         description: Osoba usunieta
 *       404:
 *         description: Niema takiej osoby
 *       500:
 *         description: Internal Server Error
 */
app.delete('/persons/:id', (req, res) => {
    const personId = req.params.id;
    db.query('DELETE FROM persons WHERE id = ?', [personId], (err, results) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (results.affectedRows > 0) {
            res.send('Person deleted successfully');
        } else {
            res.status(404).send('Person not found');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
