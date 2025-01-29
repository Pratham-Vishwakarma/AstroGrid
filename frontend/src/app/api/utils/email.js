import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: process.env.FROM_EMAIL_ADDRESS, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
});

//Render The EJS Template
const renderTemplate = async (templateName, data) => {
    const templatePath = path.join(process.cwd(), 'src', 'app', 'api', 'templates');
    const template = path.join(templatePath, `${templateName}.ejs`);    

    return new Promise((resolve, reject) => {
        ejs.renderFile(template, data, (err, html) => {
            if (err) reject(err)
            else resolve(html);            
        })
    })
};

const sendMail = async (to, subject, templateName, templateData) => {
    try {
        const html = await renderTemplate(templateName, templateData);

        const mailOptions = {
            from: `${process.env.FROM_EMAIL_USERNAME} ${process.env.FROM_EMAIL_ADDRESS}`,
            to,
            subject,
            html
        }
        const info = await transporter.sendMail(mailOptions);

        return {message: `Message succesfully sent to ${info.accepted[0]}`}
    } catch (error) {
        throw new Error(error.message)
    }
}

export { sendMail }