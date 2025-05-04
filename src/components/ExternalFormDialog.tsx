
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ExternalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
}

const ExternalFormDialog = ({ open, onOpenChange, title = "Join Synapse" }: ExternalFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="h-[80vh]">
          <iframe 
            src="https://forms.office.com/Pages/ResponsePage.aspx?id=oOiSs5cikEur0hQ02TUEmw25OOWUdUFIpR-T2-mAeKtUNTFRWUtOMU9FOFI4NkZaRzBSSUExU1RNQy4u"
            width="100%" 
            height="100%" 
            frameBorder="0"
            title="Microsoft Form"
            className="rounded-b-lg"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExternalFormDialog;
