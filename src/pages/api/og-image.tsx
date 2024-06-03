import { ImageResponse } from 'next/og';
import { env } from '~/env.mjs';

export const config = {
  runtime: 'edge',
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  return new ImageResponse(
    (
      <div tw="relative flex h-full flex-row-reverse bg-[#c506d6]">
        <div tw="flex h-full w-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            tw="absolute h-[60%] w-full"
            style={{ transform: 'rotate(180deg)' }}
            src={`${env.NEXT_PUBLIC_BASE_URL}/images/footer-wave.svg`}
            alt="podopieczni logo"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            tw="absolute bottom-0 h-[50%] w-full"
            src={`${env.NEXT_PUBLIC_BASE_URL}/images/footer-wave.svg`}
            alt="podopieczni logo"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            tw="h-1/2 w-1/2"
            style={{
              transform: 'translateX(60%) translateY(60%)',
            }}
            src={`${env.NEXT_PUBLIC_BASE_URL}/images/no-profile-picture.svg`}
            alt="Podopieczni logo"
          />
          <div
            tw="absolute left-[-85px] top-[-30px] h-[120%] w-[200px] bg-[#c506d6]"
            style={{
              transform: 'rotate(11deg)',
            }}
          />
        </div>
        <div tw="mt-24 flex w-1/2 flex-col p-[48px] text-white">
          <h1 tw="text-[52px] tracking-tight">
            Szukaj podopiecznych gotowych do adopcji.
          </h1>
          <p tw="text-[26px] text-neutral-100 tracking-tight">
            Pomagamy w znalezieniu zwierząt do adopcji i zarządzaniu danymi
            przez schroniska.
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
