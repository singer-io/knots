import express from 'express';

const app = express();
const PORT = 4321; // Random number that's unikely to clash with other apps

app.get('/', (req, res) => res.send('This is proof that it works'));

app.listen(PORT, () => console.log(`Knot server running on port ${PORT}`));
