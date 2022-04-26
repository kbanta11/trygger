require('dotenv').config();
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendEmail = async (msg: sgMail.MailDataRequired | sgMail.MailDataRequired[]) => {
    try {
        let result = await sgMail.send(msg);
        console.log('SUCCESS: %s', JSON.stringify(result));
        return true;
    } catch (e) {
        console.log('Error: %s', e);
        return false;
    }
}