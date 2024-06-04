import Head from 'next/head';
import { env } from '~/env.mjs';

type Props = {
  title: string;
  description: string;
  keywords: string;
  type: string;
  url: string;
  canonical?: string;
  author?: string;
  twitterHandle?: string;
};

const HeadMeta = ({
  title,
  description,
  keywords,
  type,
  url,
  canonical,
  author,
  twitterHandle,
}: Props) => {
  return (
    <Head>
      <title>{title}</title>
      <meta charSet="UTF-8" />
      <meta
        httpEquiv="X-UA-Compatible"
        content="IE=Edge,chrome=1"
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      />
      <meta
        name="description"
        property="og:description"
        content={description}
      />
      <meta
        name="keywords"
        content={keywords}
      />
      <meta
        name="author"
        content={author ?? 'podopieczni'}
      />
      <link
        rel="canonical"
        href={canonical ?? url}
      />
      <link
        rel="icon"
        href="/favicon.ico"
      />
      <meta
        property="og:title"
        content={title}
      />
      <meta
        property="og:description"
        content={description}
      />
      <meta
        property="og:type"
        content={type}
      />
      <meta
        property="og:locale"
        content="pl_PL"
      />
      <meta
        property="og:url"
        content={url ?? `${env.NEXT_PUBLIC_BASE_URL}/api/og-image`}
      />
      <meta
        property="og:image"
        content={`${url}/api/og-dynamic`}
      />
      <meta
        property="og:site_name"
        content="podopieczni"
      />
      <meta
        name="twitter:card"
        content="summary"
      />
      <meta
        name="twitter:site"
        content={twitterHandle ?? '@podopieczni'}
      />
      <meta
        name="twitter:title"
        content={title}
      />
      <meta
        name="twitter:description"
        content={description}
      />
      <meta
        name="twitter:image"
        content={url ?? `${env.NEXT_PUBLIC_BASE_URL}/api/og-image`}
      />
      <meta
        property="fb:admins"
        content={'222'}
      />
    </Head>
  );
};

export default HeadMeta;
