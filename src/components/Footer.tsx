
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            <div className="col-span-2">
              <Link to="/" className="text-2xl font-display font-bold text-synapse-primary">
                Synapses
              </Link>
              <p className="mt-4 text-gray-600 max-w-xs">
                The global ecosystem where Governance, Risk, and Compliance professionals connect, grow, and shape the future of compliance.
              </p>
              <div className="mt-6 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-synapse-primary transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-synapse-primary transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-synapse-primary transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-synapse-primary transition-colors">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/platform/features" className="text-gray-600 hover:text-synapse-primary">Features</Link></li>
                <li><Link to="/platform/solutions" className="text-gray-600 hover:text-synapse-primary">Solutions</Link></li>
                <li><Link to="/#integrations" className="text-gray-600 hover:text-synapse-primary">Integrations</Link></li>
                <li><Link to="/ask-dara" className="text-gray-600 hover:text-synapse-primary">AI Copilot</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/resources/blog" className="text-gray-600 hover:text-synapse-primary">GRC Blog</Link></li>
                <li><Link to="/resources/documentation" className="text-gray-600 hover:text-synapse-primary">Documentation</Link></li>
                <li><Link to="/resources/faq" className="text-gray-600 hover:text-synapse-primary">FAQ</Link></li>
                <li><Link to="/resources/webinars" className="text-gray-600 hover:text-synapse-primary">Webinars</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/company/about" className="text-gray-600 hover:text-synapse-primary">About</Link></li>
                <li><Link to="/company/careers" className="text-gray-600 hover:text-synapse-primary">Careers</Link></li>
                <li><Link to="/company/contact" className="text-gray-600 hover:text-synapse-primary">Contact</Link></li>
                <li><Link to="/partners" className="text-gray-600 hover:text-synapse-primary">Partners</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/legal/privacy" className="text-gray-600 hover:text-synapse-primary">Privacy</Link></li>
                <li><Link to="/legal/terms" className="text-gray-600 hover:text-synapse-primary">Terms</Link></li>
                <li><Link to="/legal/security" className="text-gray-600 hover:text-synapse-primary">Security</Link></li>
                <li><Link to="/legal/cookies" className="text-gray-600 hover:text-synapse-primary">Cookies</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="py-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Synapses Technologies Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <Link to="/legal/privacy" className="text-sm text-gray-500 hover:text-synapse-primary">
                Privacy Policy
              </Link>
              <span className="text-gray-300">|</span>
              <Link to="/legal/terms" className="text-sm text-gray-500 hover:text-synapse-primary">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
