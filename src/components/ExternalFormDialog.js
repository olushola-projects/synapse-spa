import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// React import removed - using modern JSX transform
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
const ExternalFormDialog = ({ open, onOpenChange, title = 'Join Synapses' }) => {
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: 'sm:max-w-4xl max-h-[90vh] p-0 overflow-hidden', children: [_jsx(DialogHeader, { className: 'p-6 pb-0', children: _jsx(DialogTitle, { className: 'text-xl', children: title }) }), _jsx("div", { className: 'h-[80vh]', children: _jsx("iframe", { src: 'https://forms.office.com/Pages/ResponsePage.aspx?id=oOiSs5cikEur0hQ02TUEmw25OOWUdUFIpR-T2-mAeKtUNTFRWUtOMU9FOFI4NkZaRzBSSUExU1RNQy4u', width: '100%', height: '100%', frameBorder: '0', title: 'Microsoft Form', className: 'rounded-b-lg', allowFullScreen: true }) })] }) }));
};
export default ExternalFormDialog;
