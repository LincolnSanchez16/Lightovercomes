const sections = [
  {
    title: 'Acceptance of These Terms',
    body: [
      'By using this website, you agree to these Terms of Service. If you do not agree, please do not use the website.',
      'Light Overcomes may update these terms from time to time. The updated version will apply when it is posted on this page.',
    ],
  },
  {
    title: 'Purpose of This Website',
    body: [
      'Light Overcomes exists to share Christian resources, witness card videos, book previews, and related ministry content for knowing Jesus, growing in faith, and living transformed.',
      'The content on this website is faith-based encouragement and discipleship material. It is not legal, medical, financial, mental health, or professional counseling advice.',
    ],
  },
  {
    title: 'Intellectual Property and Permitted Use',
    body: [
      'Unless otherwise stated, the text, designs, videos, graphics, book previews, witness card concepts, logos, page layouts, and other content on this website are owned by Light Overcomes or used with permission.',
      'You may view the site, share links, and use the resources for personal, church, or ministry encouragement in a non-commercial way. You may not copy, sell, modify, repackage, scrape, or redistribute the site content, design, code, videos, book previews, or graphics without written permission.',
      'Bible quotations, third-party media, payment services, embedded videos, and linked resources may be subject to their own copyright, license, and usage terms.',
    ],
  },
  {
    title: 'Videos, Book Previews, and Witness Cards',
    body: [
      'The witness videos, book previews, and card resources are provided for spiritual encouragement and outreach. They should not be presented as official statements from any church, denomination, publisher, or organization unless that relationship is clearly stated on the website.',
      'Book previews are limited excerpts or summaries intended to help visitors understand the resource. Purchasing, downloading, printing, or sharing a full resource may be governed by separate store, publisher, or platform terms.',
    ],
  },
  {
    title: 'Store, Donations, and Third-Party Services',
    body: [
      'Store links, checkout pages, donation tools, video platforms, analytics tools, or other services may be operated by third parties. Their own terms, privacy practices, refund policies, and security practices may apply.',
      'Unless a page, receipt, or official communication specifically says otherwise, do not assume that any payment, purchase, gift, or contribution through or related to this website is tax-deductible.',
      'If Light Overcomes accepts charitable contributions in the future, donors are responsible for keeping the written records and receipts required for their own tax situation.',
    ],
  },
  {
    title: 'User Submissions',
    body: [
      'If you send Light Overcomes a testimony, message, photo, video, idea, feedback, or other submission, you represent that you have the right to send it and that it does not violate someone else\'s rights.',
      'By sending a submission, you give Light Overcomes permission to review it, respond to it, and use it for ministry, communication, improvement, or promotional purposes unless we agree otherwise in writing.',
    ],
  },
  {
    title: 'Acceptable Use',
    body: [
      'You agree not to misuse the website, interfere with its operation, attempt unauthorized access, upload malicious code, harvest data, impersonate others, or use the website in a way that is unlawful, harmful, deceptive, or abusive.',
    ],
  },
  {
    title: 'Third-Party Links',
    body: [
      'This website may link to external websites, stores, video platforms, ministries, or resources. Light Overcomes is not responsible for third-party content, availability, security, policies, or practices.',
    ],
  },
  {
    title: 'Disclaimer and Limitation of Liability',
    body: [
      'This website and its content are provided as available and without warranties of any kind. Light Overcomes does not guarantee that the website will always be available, error-free, secure, or uninterrupted.',
      'To the fullest extent allowed by law, Light Overcomes will not be liable for damages arising from your use of, inability to use, or reliance on this website or any linked third-party service.',
    ],
  },
  {
    title: 'Contact',
    body: [
      'Questions about these terms can be sent through the official contact method provided by Light Overcomes.',
    ],
  },
]

function TermsOfService() {
  return (
    <section className="terms-page container">
      <div className="terms-header">
        <span className="eyebrow">Terms of Service</span>
        <h1>Terms of Service</h1>
        <p>Last updated: July 2, 2026</p>
      </div>

      <div className="terms-content" aria-label="Terms of Service content">
        {sections.map((section) => (
          <section className="terms-section" key={section.title}>
            <h2>{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    </section>
  )
}

export default TermsOfService
