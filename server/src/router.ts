import Express from 'express';
import HealthcheckController from './controllers/HealthcheckController';
import CafeController from './controllers/CafeController';
import EmployeeController from './controllers/EmployeeController';


const router = Express.Router();
router.use('/', HealthcheckController);
router.use('/', CafeController);
router.use('/', EmployeeController);

export default router;
