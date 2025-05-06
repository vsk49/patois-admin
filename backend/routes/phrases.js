import express from 'express';

let router = express.Router();

// C : creer une phrase dans la base de donnees
router.post('/', async (req, res) => {
    try {
        const { phrasefrancais, phrasepatois, cheminaudio, iddiscussion } = req.body;
        const sql = 'INSERT INTO phrase (phrasefrancais, phrasepatois, cheminaudio, iddiscussion) VALUES ($1, $2, $3, $4) RETURNING *';
        const params = [phrasefrancais, phrasepatois, cheminaudio, iddiscussion];
        const { rows } = await req.db.query(sql, params);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error creating phrase:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// R : recuperer toutes les phrases de la base de donnees
router.get('/', async (req, res) => {
    try {
        const sql = 'SELECT phrasefrancais, phrasepatois, cheminaudio, iddiscussion FROM phrase';
        const { rows } = await req.db.query(sql);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error retrieving phrases:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// R : recuperer une phrase de la base de donnees
router.get('/:idphrase', async (req, res) => {
    try {
        const { idphrase } = req.params;
        const sql = 'SELECT phrasefrancais, phrasepatois, cheminaudio, iddiscussion FROM phrase WHERE idphrase = $1';
        const { rows } = await req.db.query(sql, [idphrase]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Phrase not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error retrieving phrase:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// U : modifier une phrase dans la base de donnees
router.put('/:idphrase', async (req, res) => {
    try {
        const { idphrase } = req.params;
        const { phrasefrancais, phrasepatois, cheminaudio, iddiscussion } = req.body;
        const sql = 'UPDATE phrase SET phrasefrancais = $1, phrasepatois = $2, cheminaudio = $3, iddiscussion = $4 WHERE idphrase = $5';
        const params = [phrasefrancais, phrasepatois, cheminaudio, iddiscussion, idphrase];
        const result = await req.db.query(sql, params);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Phrase not found' });
        }
        res.status(200).json({ message: 'Phrase updated successfully' });
    } catch (error) {
        console.error('Error updating phrase:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// D : supprimer une phrase de la base de donnees
router.delete('/:idphrase', async (req, res) => {
    try {
        const { idphrase } = req.params;
        const sql = 'DELETE FROM phrase WHERE idphrase = $1';
        const result = await req.db.query(sql, [idphrase]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Phrase not found' });
        }
        res.status(200).json({ message: 'Phrase deleted successfully' });
    } catch (error) {
        console.error('Error deleting phrase:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;