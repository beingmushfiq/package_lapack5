<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New Contact Form Submission</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f9fafb; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; }
        .header { background: #1e40af; padding: 32px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 24px; font-weight: 800; }
        .header p { color: #93c5fd; margin: 8px 0 0; font-size: 14px; }
        .body { padding: 32px; }
        .field { margin-bottom: 20px; }
        .field-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #9ca3af; margin-bottom: 4px; }
        .field-value { font-size: 15px; color: #111827; font-weight: 600; background: #f9fafb; padding: 12px 16px; border-radius: 8px; border: 1px solid #f3f4f6; }
        .message-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 20px; font-size: 15px; color: #1e3a5f; line-height: 1.7; }
        .footer { background: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { margin: 0; font-size: 12px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📨 New Contact Message</h1>
            <p>Someone reached out through the contact form</p>
        </div>
        <div class="body">
            <div class="field">
                <div class="field-label">Name</div>
                <div class="field-value">{{ $submission->name }}</div>
            </div>
            <div class="field">
                <div class="field-label">Email</div>
                <div class="field-value">
                    <a href="mailto:{{ $submission->email }}" style="color: #1e40af; text-decoration: none;">{{ $submission->email }}</a>
                </div>
            </div>
            <div class="field">
                <div class="field-label">Subject</div>
                <div class="field-value">{{ $submission->subject }}</div>
            </div>
            <div class="field">
                <div class="field-label">Message</div>
                <div class="message-box">{{ $submission->message }}</div>
            </div>
        </div>
        <div class="footer">
            <p>This notification was sent from your {{ config('app.name') }} website contact form.</p>
            <p style="margin-top: 8px;">Received at {{ $submission->created_at->format('M d, Y h:i A') }}</p>
        </div>
    </div>
</body>
</html>
