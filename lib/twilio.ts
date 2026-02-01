
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

let client: any;

if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
}

export const sendOTP = async (phone: string) => {
    if (!client || !verifyServiceSid) {
        console.warn('Twilio credentials not found, simulating OTP send');
        return { success: true, sid: 'mock-sid' };
    }

    try {
        const formatPhone = phone.startsWith('+') ? phone : `+91${phone}`; // Default to India
        const verification = await client.verify.v2.services(verifyServiceSid)
            .verifications
            .create({ to: formatPhone, channel: 'sms' });
        return { success: true, status: verification.status };
    } catch (error) {
        console.error('Twilio send OTP error:', error);
        return { success: false, error };
    }
};

export const verifyOTP = async (phone: string, code: string) => {
    if (!client || !verifyServiceSid) {
        console.warn('Twilio credentials not found, simulating OTP verify');
        // For development without Twilio, verify against a mock code '123456' or similar logic if needed
        return { success: true, status: 'approved' };
    }

    try {
        const formatPhone = phone.startsWith('+') ? phone : `+91${phone}`;
        const verification_check = await client.verify.v2.services(verifyServiceSid)
            .verificationChecks
            .create({ to: formatPhone, code });

        return {
            success: verification_check.status === 'approved',
            status: verification_check.status
        };
    } catch (error) {
        console.error('Twilio verify OTP error:', error);
        return { success: false, error };
    }
};
