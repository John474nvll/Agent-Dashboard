import axios from "axios";
import twilio from "twilio";

// Types for our service
export interface VoiceCallParams {
  to: string;
  agentId: string;
}

export interface WhatsAppParams {
  to: string;
  message: string;
}

class ExternalServices {
  private twilioClient: any;
  private retellApiKey: string | undefined;
  private whatsappToken: string | undefined;
  private whatsappPhoneId: string | undefined;

  constructor() {
    this.retellApiKey = process.env.RETELL_API_KEY;
    this.whatsappToken = process.env.WHATSAPP_TOKEN;
    this.whatsappPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
    }
  }

  // Retell AI Integration
  async createRetellCall(params: VoiceCallParams) {
    if (!this.retellApiKey) {
      console.warn("RETELL_API_KEY not set. Simulating call.");
      return { call_id: "mock_retell_" + Date.now() };
    }

    try {
      const response = await axios.post(
        "https://api.retellai.com/v2/create-phone-call",
        {
          from_number: process.env.TWILIO_PHONE_NUMBER,
          to_number: params.to,
          agent_id: params.agentId,
        },
        {
          headers: { Authorization: `Bearer ${this.retellApiKey}` },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Retell API Error:", error.response?.data || error.message);
      throw new Error("Failed to create Retell call");
    }
  }

  // Meta WhatsApp SDK Integration
  async sendWhatsAppMessage(params: WhatsAppParams) {
    if (!this.whatsappToken || !this.whatsappPhoneId) {
      console.warn("WhatsApp credentials not set. Simulating message.");
      return { success: true, message_id: "mock_wa_" + Date.now() };
    }

    try {
      const response = await axios.post(
        `https://graph.facebook.com/v17.0/${this.whatsappPhoneId}/messages`,
        {
          messaging_product: "whatsapp",
          to: params.to,
          type: "text",
          text: { body: params.message },
        },
        {
          headers: { Authorization: `Bearer ${this.whatsappToken}` },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("WhatsApp API Error:", error.response?.data || error.message);
      throw new Error("Failed to send WhatsApp message");
    }
  }

  // Twilio Voice/SMS Fallback
  async sendTwilioSMS(to: string, message: string) {
    if (!this.twilioClient) {
      console.warn("Twilio credentials not set. Simulating SMS.");
      return { sid: "mock_sms_" + Date.now() };
    }

    return await this.twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
  }
}

export const externalServices = new ExternalServices();
