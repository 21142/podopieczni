import { generateComponents } from '@uploadthing/react';
import { type fileRouter } from '~/server/api/routers/uploadthing';

export const { UploadButton } = generateComponents<fileRouter>();
