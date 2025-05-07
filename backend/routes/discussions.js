import express from 'express';

let router = express.Router();

// C : creer une discussion dans la base de donnees
router.post('/', async (req, res) => {
    try {
        const { nomdiscussion } = req.body;
        const sql = 'INSERT INTO discussion (nomdiscussion) VALUES ($1) RETURNING *';
        const params = [nomdiscussion];
        const { rows } = await req.db.query(sql, params);
        res.status(201).json({ message: 'Discussion created successfully', discussion: rows[0] });
    } catch (error) {
        console.error('Error creating discussion:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// R : recuperer toutes les discussions de la base de donnees
router.get('/', async (req, res) => {
    try {
        const sql = 'SELECT iddiscussion, nomdiscussion FROM discussion ORDER BY iddiscussion';
        const { rows } = await req.db.query(sql);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching discussions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// R : recuperer une discussion de la base de donnees
router.get('/:iddiscussion', async (req, res) => {
    try {
        const { iddiscussion } = req.params;
        const sql = 'SELECT iddiscussion, nomdiscussion FROM discussion WHERE iddiscussion = $1';
        const { rows } = await req.db.query(sql, [iddiscussion]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Discussion not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error retrieving discussion:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// U : modifier une discussion dans la base de donnees
router.put('/:iddiscussion', async (req, res) => {
    try {
        const { iddiscussion } = req.params;
        const { nomdiscussion } = req.body;
        const sql = 'UPDATE discussion SET nomdiscussion = $1 WHERE iddiscussion = $2 RETURNING *';
        const params = [nomdiscussion, iddiscussion];
        const result = await req.db.query(sql, params);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Discussion not found' });
        }
        res.status(200).json({ message: 'Discussion updated successfully', discussion: result.rows[0] });
    } catch (error) {
        console.error('Error updating discussion:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// D : supprimer une discussion de la base de donnees
router.delete('/:iddiscussion', async (req, res) => {
    try {
        const { iddiscussion } = req.params;
        const sql = 'DELETE FROM discussion WHERE iddiscussion = $1';
        const result = await req.db.query(sql, [iddiscussion]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Discussion not found' });
        }
        res.status(200).json({ message: 'Discussion deleted successfully' });
    } catch (error) {
        console.error('Error deleting discussion:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Export the router
export default router;