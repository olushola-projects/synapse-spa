import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

interface InvitationRequest {
  senderName: string;
  senderEmail: string;
  inviteeEmail: string;
  adminEmail: string;
  message: string;
}

// Simple HTML escaping function for email templates
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { senderName, senderEmail, inviteeEmail, adminEmail, message }: InvitationRequest =
      await req.json();

    // Sanitize all input data
    const sanitizedData = {
      senderName: escapeHtml(senderName.trim()),
      senderEmail: escapeHtml(senderEmail.trim()),
      inviteeEmail: escapeHtml(inviteeEmail.trim()),
      adminEmail: escapeHtml(adminEmail.trim()),
      message: escapeHtml(message.trim())
    };

    console.log(
      `Processing invitation from ${sanitizedData.senderEmail} to ${sanitizedData.inviteeEmail}`
    );

    // Send invitation to invitee
    const inviteeEmailResponse = await resend.emails.send({
      from: 'Synapses <invites@joinsynapses.com>',
      to: [sanitizedData.inviteeEmail],
      subject: `${sanitizedData.senderName} invited you to join Synapses`,
      html: getInviteeEmailHTML(sanitizedData.senderName, sanitizedData.message)
    });

    console.log('Invitation email sent:', inviteeEmailResponse);

    // Send confirmation to sender
    const senderEmailResponse = await resend.emails.send({
      from: 'Synapses <invites@joinsynapses.com>',
      to: [sanitizedData.senderEmail],
      subject: "You've sent an invitation to Synapses",
      html: getSenderConfirmationHTML(sanitizedData.senderName, sanitizedData.inviteeEmail)
    });

    console.log('Sender confirmation email sent:', senderEmailResponse);

    // Send notification to admin
    const adminEmailResponse = await resend.emails.send({
      from: 'Synapses <invites@joinsynapses.com>',
      to: [sanitizedData.adminEmail],
      subject: 'New Synapses Invitation',
      html: getAdminNotificationHTML(
        sanitizedData.senderName,
        sanitizedData.senderEmail,
        sanitizedData.inviteeEmail,
        sanitizedData.message
      )
    });

    console.log('Admin notification email sent:', adminEmailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Invitation sent successfully'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  } catch (error: any) {
    console.error('Error in send-invitation function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};

// Email templates
function getInviteeEmailHTML(senderName: string, message: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Synapses Invitation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #4F46E5; }
        .invitation { background: linear-gradient(135deg, #EEF4FF 0%, #F8FAFF 100%); padding: 30px; border-radius: 8px; margin-bottom: 30px; }
        .message { background-color: #f5f5f5; padding: 15px; border-radius: 8px; font-style: italic; margin: 20px 0; }
        .cta-button { display: inline-block; background-color: #4F46E5; color: white; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 40px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Synapses</div>
        <p>Transform Your Expertise With GRC Agents</p>
      </div>
      
      <div class="invitation">
        <h2>You've been invited to join Synapses!</h2>
        <p>${senderName} thinks you'd be interested in Synapses, a platform designed for GRC professionals.</p>
        
        <div class="message">
          <p>"${message}"</p>
        </div>
        
        <p>Synapses is helping GRC professionals navigate regulations, adopt RegTech, enhance their careers, and connect with peers and mentors - all powered by AI.</p>
        
        <center><a href="https://joinsynapses.com" class="cta-button">Learn More</a></center>
      </div>
      
      <p>Synapses provides a centralized, customizable, and AI-driven environment to help GRC professionals stay ahead in a rapidly evolving regulatory landscape.</p>
      
      <div class="footer">
        <p>&copy; 2025 Synapses. All rights reserved.</p>
        <p>If you have any questions, please contact <a href="mailto:support@joinsynapses.com">support@joinsynapses.com</a></p>
      </div>
    </body>
    </html>
  `;
}

function getSenderConfirmationHTML(senderName: string, inviteeEmail: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Invitation Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #4F46E5; }
        .confirmation { background: linear-gradient(135deg, #EEF4FF 0%, #F8FAFF 100%); padding: 30px; border-radius: 8px; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 40px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Synapses</div>
        <p>Transform Your Expertise With GRC Agents</p>
      </div>
      
      <div class="confirmation">
        <h2>Your invitation has been sent!</h2>
        <p>Hi ${senderName},</p>
        <p>We've sent your invitation to <strong>${inviteeEmail}</strong>.</p>
        <p>Thank you for helping us grow the Synapses community! We'll let you know when they sign up.</p>
      </div>
      
      <div class="footer">
        <p>&copy; 2025 Synapses. All rights reserved.</p>
        <p>If you have any questions, please contact <a href="mailto:support@joinsynapses.com">support@joinsynapses.com</a></p>
      </div>
    </body>
    </html>
  `;
}

function getAdminNotificationHTML(
  senderName: string,
  senderEmail: string,
  inviteeEmail: string,
  message: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Invitation Notification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>New Synapses Invitation</h2>
      
      <p><strong>From:</strong> ${senderName} (${senderEmail})</p>
      <p><strong>To:</strong> ${inviteeEmail}</p>
      <p><strong>Message:</strong> "${message}"</p>
      
      <p>This notification is for your records.</p>
    </body>
    </html>
  `;
}

serve(handler);
