import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Loknath Solution'
const SITE_URL  = 'https://loknathasolution.com'
const DEFAULT_IMG = `${SITE_URL}/og-image.png`

export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage = DEFAULT_IMG,
  type = 'website',
  noIndex = false,
  schema = null
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Stationery, Toys & Digital Services`
  const url = canonical ? `${SITE_URL}${canonical}` : SITE_URL

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={url} />

      {/* OG */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={type} />

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  )
}