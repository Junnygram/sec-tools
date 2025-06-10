import PhishingDetector from '@/component/Page/PhishingDetector'
import React from 'react'

export const metadata = {
  title: 'Phishing URL Detector | Security Tools Suite',
  description: 'Analyze URLs for phishing indicators and check against known malicious databases. Protect yourself from online scams and malicious websites.',
  keywords: 'phishing detector, URL analysis, security tool, malicious URL, phishing protection, cybersecurity',
}

const PhishingDetectorPage = () => {
  return (
    <div><PhishingDetector/></div>
  )
}

export default PhishingDetectorPage