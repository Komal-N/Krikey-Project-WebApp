const express = require('express');
const app = express();
const port = 8080;
const pool = require('./db');

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error executing query', err.stack);
    } else {
        console.log('Connected to PostgreSQL:', res.rows[0].now);
    }
});

/**
 * Get all authors in the database filtered by author_name if provided
 */
app.get('/top-authors', async (req, res) => {
    const authorName = req.query.author_name;

    const query = `
    SELECT a.id, a.name, a.email, SUM(si.item_price * si.quantity) AS total_revenue
    FROM authors a
    JOIN books b ON a.id = b.author_id
    JOIN sale_items si ON b.id = si.book_id
    GROUP BY a.id, a.name, a.email
    ${authorName ? `HAVING a.name = '${authorName}'` : ''}
    ORDER BY total_revenue DESC
    LIMIT 10;
    `;

    const authorQuery = `SELECT * FROM authors WHERE name = '${authorName}'`;

    if (authorName) {
        const result = await pool.query(authorQuery);
        if (result.rowCount === 0) {
            res.status(401).json({ message: 'Bad Request. Error finding author' });
            return;
        }
    }

    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving authors' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});