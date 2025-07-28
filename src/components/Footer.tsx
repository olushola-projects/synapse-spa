import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Send, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };
  const socialLinks = [{
    href: 'https://facebook.com/synapsesgrc',
    icon: Facebook,
    label: 'Facebook'
  }, {
    href: 'https://twitter.com/synapsesgrc',
    icon: Twitter,
    label: 'Twitter'
  }, {
    href: 'https://linkedin.com/company/synapsesgrc',
    icon: Linkedin,
    label: 'LinkedIn'
  }, {
    href: 'https://instagram.com/synapsesgrc',
    icon: Instagram,
    label: 'Instagram'
  }, {
    href: 'mailto:admin@joinsynapses.com',
    icon: Mail,
    label: 'Email'
  }];
  return <footer className='relative bg-gradient-to-br from-background via-background to-muted/20 border-t border-border/60'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Newsletter Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} viewport={{
        once: true
      }} className='py-12 border-b border-border/40'>
          <div className='max-w-2xl mx-auto text-center'>
            <h3 className='text-2xl font-bold text-foreground mb-4'>
              Stay Updated with GRC Insights
            </h3>
            <p className='text-muted-foreground mb-6'>
              Get the latest regulatory updates, compliance insights, and industry trends delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className='flex gap-4 max-w-md mx-auto'>
              <Input type='email' placeholder='Enter your email' value={email} onChange={e => setEmail(e.target.value)} className='flex-1 bg-background/50 border-border/60 focus:border-primary/60 backdrop-blur-sm' required />
              <motion.div whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                <Button type='submit' className='bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200' disabled={isSubscribed}>
                  {isSubscribed ? <motion.span initial={{
                  scale: 0
                }} animate={{
                  scale: 1
                }} className='flex items-center gap-2'>
                      ✓ Subscribed!
                    </motion.span> : <>
                      <Send className='h-4 w-4 mr-2' />
                      Subscribe
                    </>}
                </Button>
              </motion.div>
            </form>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className='py-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {/* Brand Section */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.1
          }} viewport={{
            once: true
          }} className='lg:col-span-1'>
              <Link to='/' className='inline-block text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:from-accent hover:to-primary transition-all duration-300'>
                Synapses
              </Link>
              <p className='mt-4 text-muted-foreground max-w-xs leading-relaxed'>
                The global ecosystem where Governance, Risk, and Compliance professionals connect,
                grow, and shape the future of compliance.
              </p>
              <div className='mt-6 flex space-x-3'>
                {socialLinks.map((social, index) => <motion.a key={social.label} href={social.href} target='_blank' rel='noopener noreferrer' whileHover={{
                scale: 1.1,
                y: -2
              }} whileTap={{
                scale: 0.9
              }} initial={{
                opacity: 0,
                scale: 0.8
              }} whileInView={{
                opacity: 1,
                scale: 1
              }} transition={{
                delay: 0.1 * index,
                duration: 0.3
              }} viewport={{
                once: true
              }} className='p-2 rounded-lg bg-background/50 hover:bg-primary/10 border border-border/40 hover:border-primary/30 text-muted-foreground hover:text-primary transition-all duration-200 backdrop-blur-sm' aria-label={social.label}>
                    <social.icon size={18} />
                  </motion.a>)}
              </div>
            </motion.div>

            {/* Platform Links */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }} viewport={{
            once: true
          }} className='space-y-4'>
              <h3 className='font-semibold text-foreground mb-4 text-lg'>Platform</h3>
              <ul className='space-y-3'>
                {[{
                to: '/platform/features',
                label: 'Features'
              }, {
                to: '/platform/solutions',
                label: 'Solutions'
              }, {
                to: '/#features',
                label: 'Integrations'
              }, {
                to: '/ask-dara',
                label: 'Agent'
              }].map((link, index) => <motion.li key={link.to} initial={{
                opacity: 0,
                x: -10
              }} whileInView={{
                opacity: 1,
                x: 0
              }} transition={{
                delay: 0.05 * index
              }} viewport={{
                once: true
              }}>
                    <Link to={link.to} className='text-muted-foreground hover:text-primary transition-colors text-sm flex items-center group'>
                      <ArrowRight className='h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200' />
                      {link.label}
                    </Link>
                  </motion.li>)}
              </ul>
            </motion.div>

            {/* Resources Links */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.3
          }} viewport={{
            once: true
          }} className='space-y-4'>
              <h3 className='font-semibold text-foreground mb-4 text-lg'>Resources</h3>
              <ul className='space-y-3'>
                {[{
                to: '/resources/blog',
                label: 'Blog'
              }, {
                to: '/resources/documentation',
                label: 'Documentation'
              }, {
                to: '/resources/faq',
                label: 'FAQ'
              }, {
                to: '/resources/webinars',
                label: 'Webinars'
              }].map((link, index) => <motion.li key={link.to} initial={{
                opacity: 0,
                x: -10
              }} whileInView={{
                opacity: 1,
                x: 0
              }} transition={{
                delay: 0.05 * index
              }} viewport={{
                once: true
              }}>
                    <Link to={link.to} className='text-muted-foreground hover:text-primary transition-colors text-sm flex items-center group'>
                      <ArrowRight className='h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200' />
                      {link.label}
                    </Link>
                  </motion.li>)}
              </ul>
            </motion.div>

            {/* Company & Legal Links */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.4
          }} viewport={{
            once: true
          }} className='space-y-6'>
              <div className='space-y-4'>
                <h3 className='font-semibold text-foreground mb-4 text-lg'>Company</h3>
                <ul className='space-y-3'>
                  {[{
                  to: '/company/about',
                  label: 'About'
                }, {
                  to: '/company/careers',
                  label: 'Careers'
                }, {
                  to: '/company/contact',
                  label: 'Contact'
                }, {
                  to: '/partners',
                  label: 'Partners'
                }].map((link, index) => <motion.li key={link.to} initial={{
                  opacity: 0,
                  x: -10
                }} whileInView={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  delay: 0.05 * index
                }} viewport={{
                  once: true
                }}>
                      <Link to={link.to} className='text-muted-foreground hover:text-primary transition-colors text-sm flex items-center group'>
                        <ArrowRight className='h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200' />
                        {link.label}
                      </Link>
                    </motion.li>)}
                </ul>
              </div>

              
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} transition={{
        duration: 0.6,
        delay: 0.5
      }} viewport={{
        once: true
      }} className='py-8 border-t border-border/40'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='flex flex-col md:flex-row items-center gap-4'>
              <p className='text-sm text-muted-foreground'>
                &copy; {new Date().getFullYear()} Synapses Technologies Ltd. All rights reserved.
              </p>
              <div className='flex items-center gap-4'>
                <Link to='/legal/privacy' className='text-sm text-muted-foreground hover:text-primary transition-colors'>
                  Privacy Policy
                </Link>
                <span className='text-border'>•</span>
                <Link to='/legal/terms' className='text-sm text-muted-foreground hover:text-primary transition-colors'>
                  Terms of Service
                </Link>
              </div>
            </div>
            <motion.div whileHover={{
            scale: 1.05
          }} className='text-sm text-muted-foreground'>
              Made with ❤️ for GRC professionals worldwide
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>;
};
export default Footer;