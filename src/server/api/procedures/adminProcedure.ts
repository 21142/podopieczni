import { isAdmin } from '../middlewares/authMiddleware';
import { t } from '../trpc';

const adminProcedure = t.procedure.use(isAdmin);

export default adminProcedure;
