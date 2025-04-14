
import { Facebook, Twitter, Linkedin, Instagram, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            <div className="col-span-2">
              <a href="#" className="text-2xl font-display font-bold text-synapse-primary">
                Synapse
              </a>
              <p className="mt-4 text-gray-600 max-w-xs">
                The global ecosystem where GRC professionals connect, grow, and shape the future of compliance.
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
                <li><a href="#" className="text-gray-600 hover:text-synapse-primary">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-synapse-primary">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-synapse-primary">Integrations</a></li>
                <li><a href="#" className="text-gray-600 hover:text-synapse-primary">Enterprise</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-synapse-primary">GRC Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-synapse-primary">Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-synapse-primary">Community</a></li>
                <li><a href="#" className="text-gray-600 hover:text-synapse-primary">Webinars</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-synapse-primary">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-synapse-primary">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-synapse-primary">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-synapse-primary">Partners</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-synapse-primary">Privacy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-synapse-primary">Terms</a></li>
                <li><a href="#" className="text-gray-600 hover:text-synapse-primary">Security</a></li>
                <li><a href="#" className="text-gray-600 hover:text-synapse-primary">Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="py-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Synapse Technologies Ltd. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-500 hover:text-synapse-primary">
              Privacy Policy
            </a>
            <span className="mx-2 text-gray-300">|</span>
            <a href="#" className="text-sm text-gray-500 hover:text-synapse-primary">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
