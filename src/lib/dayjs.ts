import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(duration);

export type Dayjs = dayjs.Dayjs;

export type { ConfigType } from 'dayjs';

export default dayjs;
