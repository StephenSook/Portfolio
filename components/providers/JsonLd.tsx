/** Person structured data for search engines. Server component. */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Stephen Sookra",
    url: "https://stephensookra.com",
    jobTitle: "Software Engineer",
    email: "mailto:stephensookra@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Atlanta",
      addressRegion: "GA",
      addressCountry: "US",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Kennesaw State University",
    },
    sameAs: [
      "https://github.com/StephenSook",
      "https://www.linkedin.com/in/stephen-sookra",
    ],
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "Full-Stack Development",
      "Computer Vision",
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
