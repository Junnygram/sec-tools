'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Globe,
  Shield,
  Server,
  Lock,
  AlertTriangle,
} from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-background to-secondary/20">
      <div className="container px-4 py-12 mx-auto flex-1 flex flex-col">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative w-full max-w-4xl mx-auto mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 mix-blend-multiply z-10"></div>
              <img
                src="/hack.jpg"
                alt="Cybersecurity"
                className="w-full h-64 object-contain object-center"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-white px-4 text-center text-shadow-lg">
                  Security Tools Suite
                </h1>
              </div>
            </motion.div>
          </div>
          <p className="mt-4 text-xl text-muted-foreground">
            Powerful security tools for ethical hackers, developers, and
            security professionals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            <Link href="/userchecker" className="block">
              <div className="bg-card border border-border rounded-lg p-6 h-full hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-indigo-500/10 rounded-full">
                    <Search className="h-6 w-6 text-indigo-500" />
                  </div>
                  <h2 className="text-2xl font-bold ml-3">Username Checker</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  Check username availability across multiple social media
                  platforms and websites.
                </p>
                <div className="flex justify-end">
                  <span className="text-indigo-500 font-medium">
                    Try it now →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Link href="/whoislookup" className="block">
              <div className="bg-card border border-border rounded-lg p-6 h-full hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-teal-500/10 rounded-full">
                    <Globe className="h-6 w-6 text-teal-500" />
                  </div>
                  <h2 className="text-2xl font-bold ml-3">WHOIS Lookup</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  Discover domain registration details, ownership information,
                  and expiration dates.
                </p>
                <div className="flex justify-end">
                  <span className="text-teal-500 font-medium">
                    Try it now →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Link href="/dnslookup" className="block">
              <div className="bg-card border border-border rounded-lg p-6 h-full hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-full">
                    <Server className="h-6 w-6 text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-bold ml-3">DNS Lookup</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  Check DNS records including A, AAAA, MX, TXT, and NS records
                  for any domain.
                </p>
                <div className="flex justify-end">
                  <span className="text-blue-500 font-medium">
                    Try it now →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Link href="/sslchecker" className="block">
              <div className="bg-card border border-border rounded-lg p-6 h-full hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-green-500/10 rounded-full">
                    <Shield className="h-6 w-6 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold ml-3">SSL Checker</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  Verify SSL certificate validity, expiration dates, and
                  security details for any website.
                </p>
                <div className="flex justify-end">
                  <span className="text-green-500 font-medium">
                    Try it now →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Link href="/portscanner" className="block">
              <div className="bg-card border border-border rounded-lg p-6 h-full hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-full">
                    <Lock className="h-6 w-6 text-purple-500" />
                  </div>
                  <h2 className="text-2xl font-bold ml-3">Port Scanner</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  Scan for open ports on a server to identify potential security
                  vulnerabilities.
                </p>
                <div className="flex justify-end">
                  <span className="text-purple-500 font-medium">
                    Try it now →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link href="/phishing-detector" className="block">
              <div className="bg-card border border-border rounded-lg p-6 h-full hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-red-500/10 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold ml-3">Phishing Detector</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  Analyze URLs for phishing indicators and check against known
                  malicious databases.
                </p>
                <div className="flex justify-end">
                  <span className="text-red-500 font-medium">Try it now →</span>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-6">
            Security Tools for Everyone
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our suite of security tools is designed to help developers, security
            professionals, and curious users explore and understand the digital
            landscape. Use these tools responsibly and ethically.
          </p>
        </motion.div>
      </div>

      <footer className="text-center text-muted-foreground py-6">
        <p>Security Tools Suite &copy; {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}

// #
