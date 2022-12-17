import Head from 'next/head';

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
      <meta charSet="UTF-8" />
      <title>{title}</title>
      <meta
        name="description"
        property="og:description"
        content={description}
      />
      <meta
        property="og:title"
        content={title}
      />
      <meta
        name="keywords"
        content={keywords}
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
        name="author"
        content={author ?? 'podopieczni'}
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      />
      <meta
        property="og:url"
        content={url}
      />
      <meta
        property="og:image"
        content={`${url}/api/og-image`}
      />
      <meta
        property="og:site_name"
        content="podopieczni"
      />
      <meta
        name="twitter:card"
        content="sumarry"
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
        content={`${url}/api/og-image`}
      />
      <meta
        property="fb:admins"
        content={'222'}
      />
      <link
        rel="canonical"
        href={canonical ?? url}
      />
      <link
        rel="icon"
        href="/favicon.ico"
      />
    </Head>
  );
};

export default HeadMeta;
