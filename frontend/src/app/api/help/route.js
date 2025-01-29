import { sendMail } from "../utils/email";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, useremail, rating, message } = body;

    // Send email
    const emailResponse = await sendMail(
      process.env.TO_EMAIL_ADDRESS,
      "Help & Feedback From Calender App",
      'email',
      {
        templateTitle: 'Email From Calendar App',
        emailTitle: `Email From ${name}`,
        name,
        useremail,
        rating,
        message,
      }
    );

    return new Response(JSON.stringify(emailResponse), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error?.message || "Unknown error" }), { status: 400 });
  }
}
