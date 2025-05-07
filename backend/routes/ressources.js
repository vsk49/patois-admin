import express from 'express';

let router = express.Router();

// C : creer une ressource dans la base de donnees
router.post('/', async (req, res) => {
    try {
        const { nomressource, typeressource, contenu, cheminimage, cheminaudio } = req.body;
        const sql = 'INSERT INTO ressource (nomressource, typeressource, contenu, cheminimage, cheminaudio) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const params = [nomressource, typeressource, contenu, cheminimage, cheminaudio];
        const { rows } = await req.db.query(sql, params);
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Failed to create resource' });
        }
        res.status(201).json({ message: 'Resource created successfully', ressource: rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// R : recuperer toutes les ressources de la base de donnees
router.get('/', async (req, res) => {
    try {
        const sql = 'SELECT idressource, nomressource, typeressource, contenu, cheminimage, cheminaudio FROM ressource';
        const { rows } = await req.db.query(sql);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No resources found' });
        }
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// R : recuperer une ressource dans la base de donnees
router.get('/:idressource', async (req, res) => {
    try {
        const { idressource } = req.params;
        const sql = 'SELECT idressource, nomressource, typeressource, contenu, cheminimage, cheminaudio FROM ressource WHERE idressource = $1';
        const params = [idressource];
        const { rows } = await req.db.query(sql, params);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Resource not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// U : mettre a jour une ressource dans la base de donnees
router.put('/:idressource', async (req, res) => {
    try {
        const { idressource } = req.params;
        const { nomressource, typeressource, contenu, cheminimage, cheminaudio } = req.body;
        const sql = 'UPDATE ressource SET nomressource = $1, typeressource = $2, contenu = $3, cheminimage = $4, cheminaudio = $5 WHERE idressource = $6 RETURNING *';
        const params = [nomressource, typeressource, contenu, cheminimage, cheminaudio, idressource];
        const { rowCount, rows } = await req.db.query(sql, params);
        if (rowCount === 0) {
            return res.status(404).json({ error: 'Resource not found' });
        }
        res.status(200).json({ message: 'Resource updated successfully', ressource: rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// D : supprimer une ressource dans la base de donnees
router.delete('/:idressource', async (req, res) => {
    try {
        const { idressource } = req.params;
        const sql = 'DELETE FROM ressource WHERE idressource = $1';
        const params = [idressource];
        const result = await req.db.query(sql, params);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Resource not found' });
        }
        res.status(200).json({ message: 'Resource deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;