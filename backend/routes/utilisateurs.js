import express from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tartiflette';

const router = express.Router();

// C : creer des users dans la base de donnees
router.post('/', async (req, res) => {
    try {
        const { email, nomutilisateur, motdepasse } = req.body;
        const sql = "INSERT INTO utilisateur (email, nomutilisateur, motdepasse, roleutilisateur) VALUES ($1, $2, $3, 'admin') RETURNING *";
        const params = [email, nomutilisateur, motdepasse];
        await req.db.query(sql, params);
        res.status(201).json({ email, nomutilisateur, motdepasse, roleutilisateur: 'admin' });
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// R : recuperer tous les users de la base de donnees
router.get('/', async (req, res) => {
    try {
        const sql = "SELECT email, nomutilisateur, motdepasse FROM utilisateur WHERE roleutilisateur = 'admin'";
        const { rows } = await req.db.query(sql);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error retrieving admins:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// R : recuperer un admin de la base de donnees
router.get('/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const sql = "SELECT email, nomutilisateur, motdepasse FROM utilisateur WHERE email = $1 AND roleutilisateur = 'admin'";
        const { rows } = await req.db.query(sql, [email]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error retrieving admin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// U : modifier un admin dans la base de donnees
router.put('/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const { nomutilisateur, motdepasse } = req.body;
        const sql = "UPDATE utilisateur SET nomutilisateur = $1, motdepasse = $2 WHERE email = $3";
        const params = [nomutilisateur, motdepasse, email];
        const result = await req.db.query(sql, params);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.status(200).json({ message: 'Admin updated successfully' });
    } catch (error) {
        console.error('Error updating admin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// D : supprimer un admin de la base de donnees
router.delete('/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const sql = 'DELETE FROM utilisateur WHERE email = $1';
        const result = await req.db.query(sql, [email]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Validation des champs et authentification
router.post('/auth', async (req, res) => {
    try {
        const { email, nomutilisateur, motdepasse } = req.body;
        const errors = [];
        // Vérification des champs requis
        if ((!email && !nomutilisateur) || !motdepasse) {
            errors.push('Email ou nom d\'utilisateur et mot de passe sont obligatoires');
        }
        // Utilisation d'une regex plus simple et sûre pour valider l'email
        if (email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            errors.push('Email invalide');
        }
        if (nomutilisateur && nomutilisateur.length < 3) {
            errors.push('Le nom d\'utilisateur doit contenir au moins 3 caractères');
        }
        // envoyer une reponse d'erreur si des champs sont invalides
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        let sql, params;
        if (email) {
            sql = "SELECT * FROM utilisateur WHERE email = $1 AND roleutilisateur = 'admin'";
            params = [email];
        } else {
            sql = "SELECT * FROM utilisateur WHERE nomutilisateur = $1 AND roleutilisateur = 'admin'";
            params = [nomutilisateur];
        }

        const { rows } = await req.db.query(sql, params);
        if (rows.length > 0 && rows[0].motdepasse === motdepasse) {
            // Générer le token JWT
            const payload = {
                email: rows[0].email,
                nomutilisateur: rows[0].nomutilisateur,
                roleutilisateur: rows[0].roleutilisateur
            };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
            res.status(200).json({ message: 'Login successful', token });
        } else {
            res.status(401).json({ error: 'Identifiants incorrects' });
        }
    } catch (error) {
        console.error('Error validating fields:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;