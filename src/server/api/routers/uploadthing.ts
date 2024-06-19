import { createUploadthing, type FileRouter } from 'uploadthing/next-legacy';
import { getServerAuthSession } from '~/lib/auth';

const f = createUploadthing();

export const fileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .middleware(async (req) => {
      const session = await getServerAuthSession(req);

      if (!session) throw new Error('Unauthorized');

      return { userId: session.user.id };
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);
    }),
  documentUploader: f({
    pdf: { maxFileSize: '4MB' },
    image: { maxFileSize: '4MB' },
  })
    .middleware(async (req) => {
      const session = await getServerAuthSession(req);

      if (!session) throw new Error('Unauthorized');

      return { userId: session.user.id };
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);
    }),
} satisfies FileRouter;

export type fileRouter = typeof fileRouter;
