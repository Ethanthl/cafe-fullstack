import Express from 'express';
import HealthcheckController from './controllers/HealthcheckController';
import CafeController from './controllers/CafeController';


const router = Express.Router();
router.use('/', HealthcheckController);
router.use('/', CafeController);

export default router;
