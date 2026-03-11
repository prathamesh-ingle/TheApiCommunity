import dotenv from "dotenv";
dotenv.config();

const sendViaBrevo = async(to,subject,htmlContent)=>{
    const response=await fetch("https://api.brevo.com/v3/smtp/email",{
        method:"POST",
        headers:{
            "api-key":process.env.BREVO_API_KEY,
            "Content-Type":"appliaction/json",
        },
        body:JSON.stringify({
            sender:{name:"API Community",email:process.env.GMAIL_USER},
            to:[{email:to}],
            subject:subject,
            htmlContent:htmlContent,
        }),
    });
    if(!response.ok){
      const errorData = await response.text();
    console.error("Brevo API Error:", errorData);
    throw new Error("Failed to send email via Brevo");  
    }
    console.log(`✅ Email sent successfully via Brevo to: ${to}`); 
}

export const sendOtpEmail=async({to,code})=>{
   const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px 20px; background-color: #f3f4f6;">
      <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 40px 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.03);">
        
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; width: 50px; height: 50px; background-color: #d1fae5; color: #059669; border-radius: 12px; font-size: 20px; font-weight: bold; line-height: 50px; margin-bottom: 12px;">
            PN
          </div>
          <div style="color: #10b981; font-weight: 700; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
            API Community Security
          </div>
        </div>

        <h1 style="color: #111827; font-size: 24px; font-weight: 700; text-align: center; margin: 0 0 16px;">
          Verify your identity
        </h1>
        
        <p style="color: #4b5563; font-size: 15px; text-align: center; margin: 0 0 32px; line-height: 1.6;">
          Please enter the verification code below to securely access your account. This code will expire in 5 minutes.
        </p>

        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; font-size: 36px; font-weight: 800; letter-spacing: 12px; padding: 16px 32px; border-radius: 8px;">
            ${code}
          </div>
        </div>

        <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 0 0 24px;" />

        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0 0 8px; line-height: 1.5;">
          If you didn't request this code, you can safely ignore this email.
        </p>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
          &copy; ${new Date().getFullYear()} API community. All rights reserved.
        </p>
        
      </div>
    </div>
  `; 

  try{
    await sendViaBrevo(to,"Your API community verification code",html);
  }
  catch(error){
    console.error("❌Failed to send OTP Email", error);
     throw error;
  }
 
};