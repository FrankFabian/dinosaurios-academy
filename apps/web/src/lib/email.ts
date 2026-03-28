type SendStudentClaimEmailInput = {
  to: string;
  studentName: string;
  claimUrl: string;
};

type SendEmailResult =
  | { ok: true; provider: "resend" | "log" }
  | { ok: false; error: string };

export async function sendStudentClaimEmail(input: SendStudentClaimEmailInput): Promise<SendEmailResult> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CLAIM_EMAIL_FROM || process.env.RESEND_FROM_EMAIL;

  if (!resendApiKey || !fromEmail) {
    console.info("[claim-email:fallback]", {
      to: input.to,
      studentName: input.studentName,
      claimUrl: input.claimUrl,
    });
    return { ok: true, provider: "log" };
  }

  const subject = "Complete your Dinosaurios Academy account";
  const html = `
    <p>Hi ${input.studentName},</p>
    <p>Your student profile was created at Dinosaurios Academy.</p>
    <p>To link your Google account and access the portal, open this link:</p>
    <p><a href="${input.claimUrl}">${input.claimUrl}</a></p>
    <p>This link expires in 24 hours.</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [input.to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Failed to send email");
    return { ok: false, error: errorText };
  }

  return { ok: true, provider: "resend" };
}
