import express from 'express';

let router = express.Router();

// C : creer des mots dans la base de donnees
router.post('/', async (req, res) => {
    try {
        const { motfrancais, motpatois, cheminimage, cheminaudio } = req.body;
        const sql = 'INSERT INTO mot (motfrancais, motpatois, cheminimage, cheminaudio) VALUES ($1, $2, $3, $4) RETURNING idmot';
        const params = [motfrancais, motpatois, cheminimage, cheminaudio];
        const { rows } = await req.db.query(sql, params);
        res.status(201).json({ idmot: rows[0].idmot, motfrancais, motpatois, cheminimage, cheminaudio });
    } catch (error) {
        console.error('Error creating word:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// R : recuperer tous les mots de la base de donnees
router.get('/', async (req, res) => {
    try {
        const sql = 'SELECT idmot, motfrancais, motpatois, cheminimage, cheminaudio FROM mot';
        const { rows } = await req.db.query(sql);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching mots:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// R : recuperer un mot de la base de donnees
router.get('/:idmot', async (req, res) => {
    try {
        const { idmot } = req.params;
        const sql = 'SELECT idmot, motfrancais, motpatois, cheminimage, cheminaudio FROM mot WHERE idmot = $1';
        const { rows } = await req.db.query(sql, [idmot]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Word not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error retrieving word:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// U : modifier un mot dans la base de donnees
router.put('/:idmot', async (req, res) => {
    try {
        const { idmot } = req.params;
        const { motfrancais, motpatois, cheminimage, cheminaudio } = req.body;
        const sql = 'UPDATE mot SET motfrancais = $1, motpatois = $2, cheminimage = $3, cheminaudio = $4 WHERE idmot = $5';
        const params = [motfrancais, motpatois, cheminimage, cheminaudio, idmot];
        await req.db.query(sql, params);
        res.status(200).json({ message: 'Word updated successfully' });
    } catch (error) {
        console.error('Error updating word:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// D : supprimer un mot de la base de donnees
router.delete('/:idmot', async (req, res) => {
    try {
        const { idmot } = req.params;
        // Delete related progress first
        await req.db.query('DELETE FROM user_mot_progres WHERE idmot = $1', [idmot]);
        // Then delete the mot
        await req.db.query('DELETE FROM mot WHERE idmot = $1', [idmot]);
        res.status(200).json({ message: 'Word deleted successfully' });
    } catch (error) {
        console.error('Error deleting word:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;