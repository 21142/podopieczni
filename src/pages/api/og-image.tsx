import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          tw="w-full h-[60%] top-0 absolute"
          style={{ transform: "rotate(180deg)" }}
          src={`${
            process.env.NEXT_PUBLIC_BASE_URL as string
          }/images/footer-wave.svg`}
          alt="podopieczni logo"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          tw="w-full h-[50%] bottom-0 absolute"
          src={`${
            process.env.NEXT_PUBLIC_BASE_URL as string
          }/images/footer-wave.svg`}
          alt="podopieczni logo"
        />
        <div tw="flex flex-col items-center text-center pt-5">
          <h1 tw="text-[52px] mb-5">
            Szukaj podopiecznych gotowych do adopcji.
          </h1>
          <p tw="text-[32px]">
            Pomagamy w adopcji i zarządzaniu danymi zwierząt.
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
