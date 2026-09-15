// AP CS Principles Big Idea 5 — Impact of Computing (21-26%)

export const APCSP_UNIT_5 = {
  number: 5,
  title: 'Impact of Computing',
  weight: '21-26%',
  subunits: [
    {
      code: '5.1',
      title: 'Beneficial and harmful effects',
      content:
`Computing transforms society — both ways.

**Beneficial.**
- **Communication**: instant global contact.
- **Access to information**: Wikipedia, online courses.
- **Healthcare**: imaging, electronic records, drug discovery.
- **Science**: simulations, big data, AI.
- **Productivity**: automation, collaboration tools.
- **Accessibility**: assistive tech for people with disabilities.
- **Entertainment**: games, streaming, social media.
- **Economy**: e-commerce, gig economy.

**Harmful.**
- **Misinformation, polarization**: amplified by algorithms.
- **Job displacement**: automation replacing roles.
- **Privacy erosion**: pervasive tracking.
- **Mental health**: social media, attention extraction.
- **Cyberbullying, harassment**: amplified at scale.
- **Surveillance**: by states and corporations.
- **Energy consumption**: data centers, crypto.
- **Inequality**: digital divide.
- **Addiction**: designed engagement loops.

**Dual use.** Same tech can be both. Facial recognition: finds missing persons; enables mass surveillance.

**Unintended consequences.** Developers rarely foresee all impacts.
- Social media designed for connection → became polarization machine.
- Recommendation algorithms designed for engagement → amplified extremes.
- GPS made navigation easy → atrophied spatial memory.

**Bias in computing.**
- Algorithms reflect training data, which reflects history (often biased).
- Examples: facial recognition worse on darker skin, hiring algorithms biased against women, predictive policing reinforcing existing patterns.
- Mitigation: diverse data, audits, transparency, regulation.`,
    },
    {
      code: '5.2',
      title: 'Digital divide',
      content:
`**Digital divide.** Gap between those with access to computing and those without.

**Dimensions:**
- **Access**: do you have a device? Internet?
- **Quality**: high-speed vs dial-up, modern phone vs old.
- **Skills**: can you use it effectively?
- **Use**: do you use it for productive activities or just entertainment?

**Where it shows up:**
- **Income**: rich/poor.
- **Geography**: urban/rural.
- **Country**: developed/developing.
- **Age**: younger more fluent.
- **Disability**: accessibility gaps.

**Consequences.**
- Education: kids without internet fall behind.
- Jobs: online applications, remote work.
- Healthcare: telemedicine.
- Government: services moving online.
- Civic participation.

**Examples:**
- Covid pandemic exposed K-12 internet gaps.
- Rural broadband still patchy in US.
- Many African countries skipped landlines for mobile.

**Solutions:**
- Public broadband investments.
- Community wifi.
- Affordable devices (e.g., Chromebooks).
- Digital literacy programs.
- Subsidies (e.g., FCC Lifeline).

**Tension.** As more services move online, those left out fall further behind.`,
    },
    {
      code: '5.3',
      title: 'Computing innovations',
      content:
`Examples of important computing innovations and impacts.

**Search engines.** Make information findable. Concentrated power in few platforms.

**Smartphones.** Computing always with you. Changed photography, navigation, banking, dating.

**Social media.** Connection at scale; also misinformation, polarization, mental health.

**Cloud computing.** Made startups cheap to launch; concentrated infrastructure in few providers.

**GPS.** Civilian use enabled ride-share, mapping, asset tracking. Concerns about tracking.

**Machine learning.**
- Recommendation engines (Netflix, YouTube).
- Speech recognition (Siri, Alexa).
- Image classification.
- Translation.
- Predictive text.
- Generative AI (since ~2022): text, images, code.

**Blockchain / crypto.**
- Decentralized ledgers.
- Bitcoin, Ethereum.
- Smart contracts.
- Energy concerns; speculative bubbles; scams.

**Internet of Things (IoT).**
- Connected devices: thermostats, doorbells, cars, appliances.
- Convenience, automation.
- Security risks (botnets, eavesdropping).

**Driverless / autonomous vehicles.**
- Safety potential.
- Job displacement (driving).
- Ethical dilemmas (trolley problems).

**Considerations for any innovation:**
- Who benefits?
- Who is harmed?
- What are unintended consequences?
- How will it be misused?
- Is regulation needed?`,
    },
    {
      code: '5.4',
      title: 'Privacy and security',
      content:
`**Privacy.** Control over your personal information.

**Personally identifiable information (PII).** Name, address, SSN, email, phone, location, photos.

**How data is collected:**
- Forms.
- Cookies, tracking pixels.
- Device fingerprinting.
- Location services.
- Public records.
- Data brokers aggregating from many sources.

**Privacy threats:**
- Identity theft.
- Stalking, harassment.
- Discrimination (insurance, hiring).
- Manipulation (targeted ads/disinfo).

**Privacy laws.**
- **HIPAA**: US medical privacy.
- **FERPA**: US education records.
- **COPPA**: US children online.
- **GDPR**: EU general data protection (strict, fines).
- **CCPA**: California consumer privacy.

**Security.** Protecting data and systems from attack.

**Threats:**
- **Malware**: viruses, worms, ransomware.
- **Phishing**: tricking users into giving credentials.
- **SQL injection**: malicious database queries.
- **DDoS**: overwhelming server with traffic.
- **Man-in-the-middle**: intercepting communication.
- **Zero-day exploits**: unknown vulnerabilities.

**Defenses:**
- **Strong passwords**: long, unique. Use password managers.
- **Two-factor authentication (2FA)**: password + code/key.
- **Updates**: patch known vulnerabilities.
- **Encryption**: scramble data so only authorized can read.
- **Firewalls**: filter network traffic.
- **Antivirus / endpoint protection**.
- **Security training**: humans are weakest link.

**Encryption basics.**
- **Symmetric** (AES): same key for encrypt/decrypt. Fast.
- **Asymmetric / public-key** (RSA, ECC): public key encrypts, private decrypts. Enables HTTPS, email signing.
- **Hashing** (SHA-256): one-way; for passwords, file integrity.

**HTTPS.** TLS encryption layered on HTTP. Browser shows padlock when in use.

**Cybersecurity.** Industry/field defending against threats. Major shortage of workers globally.`,
    },
    {
      code: '5.5',
      title: 'Intellectual property and licensing',
      content:
`Computing creates and shares lots of content. Who owns it?

**Copyright.** Automatic legal protection for creative works.
- Books, music, art, code.
- Lasts decades (author\'s life + 70 years in US).
- Fair use: limited use for criticism, education, parody.

**Patents.** Protect inventions. ~20 years. Software patents controversial.

**Trademarks.** Protect brand names, logos.

**Trade secrets.** Protected by keeping secret (e.g., Google\'s algorithm).

**Open source.** Code licensed for free use, modification, distribution.
- **MIT, BSD**: permissive — can be used in proprietary products.
- **GPL**: copyleft — derivatives must also be open source.
- **Apache 2.0**: permissive + patent grant.

**Creative Commons.** Licenses for non-code (writing, images, music).
- CC BY: must credit author.
- CC BY-SA: + must share alike.
- CC0: public domain.

**Piracy.** Unauthorized copying and distribution.
- Music, movies, software.
- Easier than ever; harder to police.
- DRM (digital rights management) tries to prevent; often fails.

**Ethics of AI training.**
- Models trained on web data, copyrighted works.
- Lawsuits over whether this is fair use.
- Authors, artists, news organizations contesting.

**Plagiarism.** Using someone\'s work without credit. Different from copyright (plagiarism is academic/ethical, copyright is legal).

**Citing sources.** Always credit ideas/words/data from others. Doubly important in AI age — easy to get away with copying, but reputation is everything.`,
    },
  ],
  keyConcepts: [
    'Computing has beneficial and harmful effects, often the same tech.',
    'Bias in algorithms reflects training data and historical inequities.',
    'Digital divide: access, quality, skills, use gaps.',
    'PII = personally identifiable information; many laws protect it.',
    'Security threats: malware, phishing, DDoS, injection.',
    'Defenses: passwords, 2FA, updates, encryption, training.',
    'HTTPS = HTTP + TLS encryption (padlock).',
    'Copyright is automatic; open source uses permissive (MIT) or copyleft (GPL) licenses.',
    'Creative Commons for non-code work.',
  ],
  practice: [
    {
      q: 'A facial-recognition system has 95% accuracy on light skin but only 70% on dark. Why?',
      a: 'Training data biased toward light-skin faces. The algorithm learned what it was shown. Mitigation: more diverse training data, audits, transparency.',
    },
  ],
  pitfalls: [
    '"Free service" — usually means you\'re the product (data sold to advertisers).',
    '"Strong password = special character" — length matters more than special chars.',
    '"Anonymized data is safe" — often re-identifiable.',
  ],
};
