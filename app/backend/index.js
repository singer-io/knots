import express from 'express';

const app = express();

app.get('/', (req, res) => res.send('This is proof that it works'));

app.listen(4321, () => console.log('Example app listening on port 3000!'));
