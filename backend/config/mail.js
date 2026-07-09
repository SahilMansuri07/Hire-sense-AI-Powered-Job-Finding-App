const createmailTemplate = ({
  applicationId,
  fullName,
  jobTitle,
  status,
  createdAt,
}) => {
  const appName = process.env.APP_NAME || "AI Resume Maker";

  const statusColors = {
    submitted: { bg: "#e8f0fe", text: "#0b57d0" },
    "under review": { bg: "#fef9c3", text: "#854d0e" },
    shortlisted: { bg: "#dcfce7", text: "#166534" },
    rejected: { bg: "#fee2e2", text: "#991b1b" },
  };

  const statusStyle =
    statusColors[status?.toLowerCase()] || { bg: "#f3f4f6", text: "#374151" };

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${appName}</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;color:#1f2937;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f8;padding:20px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:10px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.06);">
          <tr>
            <td style="font-size:22px;font-weight:700;color:#0f172a;">${appName}</td>
          </tr>
          <tr>
            <td style="padding-top:8px;font-size:18px;font-weight:600;color:#111827;">
              Application Update
            </td>
          </tr>
          <tr>
            <td style="padding-top:14px;font-size:14px;line-height:1.6;">
              Hello ${fullName},<br />
              Your application for <strong>${jobTitle}</strong> has been updated.
            </td>
          </tr>

          <!-- Status badge -->
          <tr>
            <td align="center" style="padding:22px 0;">
              <div style="display:inline-block;padding:10px 20px;border-radius:8px;background:${statusStyle.bg};color:${statusStyle.text};font-size:16px;letter-spacing:1px;font-weight:700;text-transform:capitalize;">
                ${status}
              </div>
            </td>
          </tr>

          <!-- Application details -->
          <tr>
            <td style="padding-top:8px;">
              <table role="presentation" width="100%" cellpadding="4" cellspacing="0" style="font-size:14px;color:#374151;background:#f9fafb;border-radius:6px;">
                <tr>
                  <td style="padding:12px 16px;color:#6b7280;width:40%;">Application ID</td>
                  <td style="padding:12px 16px;font-weight:600;">${applicationId}</td>
                </tr>
                <tr>
                  <td style="padding:0 16px 12px;color:#6b7280;">Position</td>
                  <td style="padding:0 16px 12px;font-weight:600;">${jobTitle}</td>
                </tr>
                <tr>
                  <td style="padding:0 16px 12px;color:#6b7280;">Applied On</td>
                  <td style="padding:0 16px 12px;">${formattedDate}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding-top:18px;font-size:13px;color:#4b5563;line-height:1.6;">
              You can check the latest status of your application anytime from your dashboard.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
};

export default createmailTemplate;