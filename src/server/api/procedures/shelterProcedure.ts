import { isShelterAssociated } from '../middlewares/authMiddleware';
import { t } from '../trpc';

const shelterProcedure = t.procedure.use(isShelterAssociated);

export default shelterProcedure;
