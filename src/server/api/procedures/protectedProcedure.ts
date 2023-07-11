import { isAuthed } from '../middlewares/authMiddleware';
import { t } from '../trpc';

const protectedProcedure = t.procedure.use(isAuthed);

export default protectedProcedure;
