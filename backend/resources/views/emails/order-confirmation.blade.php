<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Order Confirmation</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f9fafb; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; }
        .header { background: #059669; padding: 32px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { color: #a7f3d0; margin: 8px 0 0; font-size: 14px; }
        .body { padding: 32px; }
        .order-number { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 24px; }
        .order-number span { font-size: 20px; font-weight: 800; color: #059669; }
        .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #6b7280; margin-bottom: 12px; }
        .info-grid { display: table; width: 100%; margin-bottom: 24px; }
        .info-cell { display: table-cell; padding: 12px; background: #f9fafb; border-radius: 8px; }
        .info-cell strong { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-bottom: 4px; }
        .info-cell span { font-size: 14px; font-weight: 700; color: #111827; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th { text-align: left; padding: 10px 12px; background: #f9fafb; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; }
        td { padding: 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151; }
        .total-row td { font-weight: 800; font-size: 16px; color: #111827; border-top: 2px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { margin: 0; font-size: 12px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Confirmed! ✓</h1>
            <p>Thank you for your purchase</p>
        </div>
        <div class="body">
            <div class="order-number">
                <span>{{ $order->order_number }}</span>
            </div>

            <p class="section-title">Shipping Details</p>
            <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <strong style="color: #111827;">{{ $order->shipping_first_name }} {{ $order->shipping_last_name }}</strong><br>
                <span style="color: #6b7280; font-size: 14px;">
                    {{ $order->shipping_address }}<br>
                    {{ $order->shipping_city }}{{ $order->shipping_state ? ', ' . $order->shipping_state : '' }}
                    {{ $order->shipping_zip }}<br>
                    📞 {{ $order->shipping_phone }}
                </span>
            </div>

            <p class="section-title">Order Items</p>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th style="text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($order->items as $item)
                    <tr>
                        <td>{{ $item->product?->name ?? 'Product #' . $item->product_id }}</td>
                        <td>{{ $item->quantity }}</td>
                        <td style="text-align: right;">৳{{ number_format($item->total, 0) }}</td>
                    </tr>
                    @endforeach
                    <tr class="total-row">
                        <td colspan="2">Total</td>
                        <td style="text-align: right;">৳{{ number_format($order->net_amount, 0) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="footer">
            <p>If you have any questions, reply to this email or contact our support team.</p>
            <p style="margin-top: 8px;">&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
