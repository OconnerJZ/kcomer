import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "qsCome",
  description = "Explora y descubre lugares para tu antojo del día",
  image = "https://media.qscome.com.mx/og-image.jpg",
  url = "https://qscome.com.mx",
  type = "website",
}) => {
  const siteTitle = `${title} | qsCome`;
  return (
    <Helmet>
      {/* Meta tags básicos */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Adicionales */}
      <meta name="theme-color" content="#000000" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
