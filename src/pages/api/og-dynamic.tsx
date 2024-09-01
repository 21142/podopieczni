import { ImageResponse } from 'next/og';
import { type NextRequest } from 'next/server';
import { env } from '~/env.mjs';
import { truncate } from '~/lib/utils';

export const config = {
  runtime: 'edge',
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const name = searchParams.get('name');
  const description = searchParams.get('description');
  const image = searchParams.get('image');

  return new ImageResponse(
    (
      <div tw="relative flex h-full flex-row-reverse bg-[#c506d6]">
        <div tw="flex h-full w-2/3 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              image ??
              `${env.NEXT_PUBLIC_BASE_URL}/images/no-profile-picture.svg`
            }
            tw="object-contain -mt-24"
            alt="Podopieczni logo"
          />
          <div
            tw="absolute left-[-85px] top-[-30px] h-[120%] w-[150px] bg-[#c506d6]"
            style={{
              transform: 'rotate(13deg)',
            }}
          />
        </div>
        {name && description && description.length > 0 && (
          <div tw="mt-24 flex w-1/3 flex-col p-[48px] text-white">
            <h1 tw="text-[52px] tracking-tight">{name}</h1>
            <p tw="text-[26px] text-neutral-100 tracking-tight">
              {truncate(decodeURI(description)) ??
                'Podopieczny poszukujący kochającego opiekuna i bezpiecznego domu.'}
            </p>
          </div>
        )}
        {name && !description && (
          <div tw="mt-42 flex w-1/3 flex-col p-[48px] text-white">
            <h1 tw="text-[52px] tracking-tight">{name}</h1>
            <p tw="text-[26px] text-neutral-100 tracking-tight">
              Podopieczny poszukujący kochającego opiekuna i bezpiecznego domu.
            </p>
          </div>
        )}
        {name && description?.length === 0 && (
          <div tw="mt-24 flex w-1/3 flex-col p-[48px] text-white">
            <h1 tw="text-[52px] tracking-tight">{name}</h1>
            <p tw="text-[26px] text-neutral-100 tracking-tight">
              Zobacz naszych podopiecznych szukających nowego domu
            </p>
          </div>
        )}
        {!name && !description && (
          <div tw="mt-auto flex w-1/3 flex-col p-[48px] text-white">
            <h1 tw="text-[38px] tracking-tight leading-tight">
              Podopieczny poszukujący kochającego opiekuna i bezpiecznego domu.
            </h1>
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
