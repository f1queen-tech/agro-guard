import type { Language, RiskType } from "@shared/schema";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const alertMessages: Record<Language, Record<RiskType, (description: string) => string>> = {
  en: {
    drought: (desc) => `DROUGHT ALERT: ${desc}. Please consider supplementary irrigation and water conservation measures.`,
    flood: (desc) => `FLOOD WARNING: ${desc}. Ensure proper drainage and move equipment to higher ground.`,
    pest: (desc) => `PEST RISK ALERT: ${desc}. Monitor crops closely and consider preventive pest control measures.`,
  },
  es: {
    drought: (desc) => `ALERTA DE SEQUIA: ${desc}. Por favor considere riego suplementario y medidas de conservacion de agua.`,
    flood: (desc) => `ALERTA DE INUNDACION: ${desc}. Asegure un drenaje adecuado y mueva equipos a terreno mas alto.`,
    pest: (desc) => `ALERTA DE PLAGAS: ${desc}. Monitoree los cultivos de cerca y considere medidas preventivas de control de plagas.`,
  },
  hi: {
    drought: (desc) => `सूखा चेतावनी: ${desc}. कृपया पूरक सिंचाई और जल संरक्षण उपायों पर विचार करें।`,
    flood: (desc) => `बाढ़ चेतावनी: ${desc}. उचित जल निकासी सुनिश्चित करें और उपकरण को ऊंची जमीन पर ले जाएं।`,
    pest: (desc) => `कीट जोखिम चेतावनी: ${desc}. फसलों की बारीकी से निगरानी करें और निवारक कीट नियंत्रण उपायों पर विचार करें।`,
  },
};

export class SMSService {
  async sendSMS(to: string, message: string): Promise<boolean> {
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      console.warn("Twilio credentials not configured. SMS would be sent:", { to, message });
      return true;
    }

    try {
      const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
      
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            From: TWILIO_PHONE_NUMBER,
            To: to,
            Body: message,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Twilio API error: ${error}`);
      }

      return true;
    } catch (error) {
      console.error("Error sending SMS:", error);
      throw new Error("Failed to send SMS");
    }
  }

  generateAlertMessage(riskType: RiskType, description: string, language: Language): string {
    const messageTemplate = alertMessages[language]?.[riskType];
    if (!messageTemplate) {
      return alertMessages.en[riskType](description);
    }
    return messageTemplate(description);
  }

  async sendAlert(
    to: string,
    riskType: RiskType,
    description: string,
    language: Language
  ): Promise<boolean> {
    const message = this.generateAlertMessage(riskType, description, language);
    return this.sendSMS(to, message);
  }
}

export const smsService = new SMSService();
