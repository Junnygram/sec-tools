'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UsernameSearch } from '../UserSerach';
import { ResultsList } from '../Result';
import { HowItWorks } from '../How';
import { checkUsernameAvailability, CheckResult } from '../lib/usernameChecker';
import { Search, Eye, Shield, Zap } from 'lucide-react';

const UserCheck = () => {
  const [username, setUsername] = useState<string>('');
  const [results, setResults] = useState<CheckResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showIcons, setShowIcons] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowIcons(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async (searchUsername: string) => {
    setIsLoading(true);
    setUsername(searchUsername);
    try {
      const data = await checkUsernameAvailability(searchUsername);
      setResults(data);
    } catch (error) {
      // console.error('Error checking username:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Floating icons animation variants
  const iconsContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const iconVariant = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  // Text reveal animation
  const textReveal = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    }),
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute rounded-full bg-primary/5 w-96 h-96 top-1/4 -left-48"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute rounded-full bg-secondary/10 w-64 h-64 bottom-1/4 -right-32"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 2,
          }}
        />
      </div>

      <div className="container px-4 py-12 mx-auto flex-1 flex flex-col relative z-10 h-full">
        <motion.div
          className="text-center mb-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
        >
          <motion.h1
            className="text-5xl font-extrabold tracking-tight lg:text-6xl bg-clip-text  bg-gradient-to-r from-primary to-secondary"
            custom={0}
            variants={textReveal}
          >
            Username Web Detective
          </motion.h1>
          <motion.p
            className="mt-4 text-xl text-muted-foreground"
            custom={1}
            variants={textReveal}
          >
            Check username availability across multiple platforms
          </motion.p>

          {/* Animated icon row */}
          <AnimatePresence>
            {showIcons && (
              <motion.div
                className="flex justify-center gap-8 mt-6"
                variants={iconsContainer}
                initial="hidden"
                animate="show"
              >
                <motion.div
                  variants={iconVariant}
                  className="flex flex-col items-center"
                >
                  <div className="p-3 bg-primary/10 rounded-full mb-2">
                    <Search className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm">Search</span>
                </motion.div>
                <motion.div
                  variants={iconVariant}
                  className="flex flex-col items-center"
                >
                  <div className="p-3 bg-secondary/10 rounded-full mb-2">
                    <Eye className="w-6 h-6 text-secondary" />
                  </div>
                  <span className="text-sm">Discover</span>
                </motion.div>
                <motion.div
                  variants={iconVariant}
                  className="flex flex-col items-center"
                >
                  <div className="p-3 bg-accent/10 rounded-full mb-2">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <span className="text-sm">Protect</span>
                </motion.div>
                <motion.div
                  variants={iconVariant}
                  className="flex flex-col items-center"
                >
                  <div className="p-3 bg-primary/10 rounded-full mb-2">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm">Secure</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Search box with enhanced animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.6,
            duration: 0.8,
            type: 'spring',
            damping: 12,
          }}
          className="w-full max-w-2xl mx-auto"
        >
          <UsernameSearch onSearch={handleSearch} isLoading={isLoading} />
        </motion.div>

        {/* Results title with typing effect */}
        <AnimatePresence mode="wait">
          {username && (
            <motion.div
              key="results-title"
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.5,
                type: 'spring',
                stiffness: 100,
              }}
            >
              <motion.h2
                className="text-2xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Results for "
                <motion.span
                  className="text-primary"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.3,
                    },
                  }}
                >
                  {username.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: i * 0.05 },
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.span>
                "
              </motion.h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results list with staggered animation */}
        <motion.div
          className="flex-1 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center mt-12"
              >
                <motion.div
                  className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ResultsList results={results} isLoading={isLoading} />
                {!results.length && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <HowItWorks />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Animated footer */}
      <motion.footer
        className="relative z-10 text-center text-muted-foreground py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <p>
          <motion.span
            animate={{
              color: ['#888', '#666', '#888'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="font-medium"
          >
            Username Web Detective
          </motion.span>{' '}
          &copy; {new Date().getFullYear()}
        </p>
      </motion.footer>
    </div>
  );
};

export default UserCheck;
