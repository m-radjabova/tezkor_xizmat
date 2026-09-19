import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Tezkor Xizmat'
const DEFAULT_DESCRIPTION = 'O‘zbekistondagi ishonchli xizmat ko‘rsatuvchilarni toping, taqqoslang va bog‘laning.'

type SeoProps = {
  title?: string
  description?: string
  canonicalPath?: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
  jsonLd?: Record<string, unknown>
}

function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalPath,
  image,
  type = 'website',
  noindex = false,
  jsonLd,
}: SeoProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const origin = import.meta.env.VITE_SITE_URL || (typeof window === 'undefined' ? '' : window.location.origin)
  const canonicalUrl = canonicalPath && origin ? new URL(canonicalPath, origin).toString() : undefined
  const imageUrl = image && origin ? new URL(image, origin).toString() : undefined

  return (
    <Helmet>
      <html lang="uz" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      {canonicalUrl && !noindex && <link rel="canonical" href={canonicalUrl} />}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="uz_UZ" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  )
}

export { DEFAULT_DESCRIPTION, SITE_NAME }
export default Seo