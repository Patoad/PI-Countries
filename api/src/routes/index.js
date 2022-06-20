
const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const CountryRoute = require('./country');
const ActivityRoute = require('./activity');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use('/country', CountryRoute);
// router.use('/activity', ActivityRoute);

module.exports = router;