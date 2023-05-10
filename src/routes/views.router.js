import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('chat', { title:'FamilyChat'}); // De momento solo renderizaremos la vista, no pasaremos objeto.
})

export default router;