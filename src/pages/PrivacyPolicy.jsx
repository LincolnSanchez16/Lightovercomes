const sections = [
  {
    title: 'Information We Collect',
    body: [
      'Light Overcomes currently provides public ministry resources, witness card videos, book previews, store links, and informational pages. You can browse the website without creating an account.',
      'If you contact us, join a future email list, request updates, give feedback, or submit a testimony or message, we may collect the information you choose to provide, such as your name, email address, message content, and communication preferences.',
      'If giving, store, or event features are added later, payment and donation information may be handled by third-party providers such as Subsplash or other payment, store, or ministry platforms. Light Overcomes should not collect full payment card numbers directly on this website.',
    ],
  },
  {
    title: 'How We Use Information',
    body: [
      'We may use information to respond to messages, send requested updates, improve resources, manage future email communication, understand what content is useful, protect the website, and support the ministry purposes of Light Overcomes.',
      'If a newsletter is added, emails should include a way to unsubscribe from future marketing or update messages.',
    ],
  },
  {
    title: 'Cookies, Analytics, and Technical Data',
    body: [
      'The website may collect basic technical information such as browser type, device information, pages visited, referring pages, and approximate usage patterns. This can happen through normal server logs, hosting tools, analytics tools, embedded media, or similar technologies.',
      'Cookies or similar technologies may be used by the website or by third-party services to keep features working, measure site performance, protect against misuse, or support embedded content.',
    ],
  },
  {
    title: 'Third-Party Services',
    body: [
      'This website may link to or embed content from third-party services, including video platforms, store providers, donation platforms, analytics providers, email services, and hosting services.',
      'When you use a third-party service, that provider may collect and process information under its own privacy policy and terms. For future giving, Subsplash may process donor and payment-related information according to its own policies.',
    ],
  },
  {
    title: 'How We Share Information',
    body: [
      'We do not sell personal information. We may share information with service providers who help operate the website, send email, process donations or purchases, provide analytics, host content, secure the site, or support ministry operations.',
      'We may also share information if required by law, to protect rights and safety, to prevent misuse, or with your permission.',
    ],
  },
  {
    title: 'Children',
    body: [
      'Light Overcomes is a faith and ministry resource site, but it is not intended to collect personal information from children under 13. Children should not submit personal information through this website without a parent or guardian.',
      'If we learn that personal information from a child under 13 has been submitted without appropriate parent or guardian involvement, we will take reasonable steps to delete it.',
    ],
  },
  {
    title: 'Data Choices',
    body: [
      'You may ask to update, correct, or delete information you have provided, subject to legal, security, donation, transaction, or recordkeeping needs.',
      'If email updates are added, you may unsubscribe using the method provided in those emails or through the contact method offered by Light Overcomes.',
    ],
  },
  {
    title: 'Security and Retention',
    body: [
      'We use reasonable safeguards for the size and nature of this website, but no website, email system, or online service can guarantee perfect security.',
      'We keep information only as long as reasonably needed for the purposes described in this policy, unless a longer period is needed for legal, donation, accounting, security, or ministry records.',
    ],
  },
  {
    title: 'Changes to This Policy',
    body: [
      'We may update this Privacy Policy as the website, giving tools, email tools, or ministry operations change. The updated version will be posted on this page with a new updated date.',
    ],
  },
  {
    title: 'Contact',
    body: [
      'Questions about this Privacy Policy can be sent through the official contact method provided by Light Overcomes.',
    ],
  },
]

function PrivacyPolicy() {
  return (
    <section className="terms-page container">
      <div className="terms-header">
        <span className="eyebrow">Privacy Policy</span>
        <h1>Privacy Policy</h1>
        <p>Last updated: July 2, 2026</p>
      </div>

      <div className="terms-content" aria-label="Privacy Policy content">
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

export default PrivacyPolicy
