
const sendEmail = async ({to, subject, text, html}) => {
    try{
        //simulating sending email
        console.log(`Sending email to: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Text: ${text}`);
        console.log(`HTML: ${html}`)
        
    } catch(error) {
        throw new Error(`Email sending failed ${error.message}`);
        
    }
}

export default sendEmail