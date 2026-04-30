<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice - {{ $order->order_number }}</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 14px; color: #333; }
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; }
        .header { display: table; width: 100%; border-bottom: 2px solid #eee; padding-bottom: 20px; }
        .logo { font-size: 28px; font-weight: bold; color: #ff6b00; }
        .info { display: table; width: 100%; margin-top: 20px; }
        .info-col { display: table-cell; width: 50%; vertical-align: top; }
        .table { width: 100%; border-collapse: collapse; margin-top: 30px; }
        .table th { background: #f8f9fa; text-align: left; padding: 10px; border-bottom: 2px solid #dee2e6; }
        .table td { padding: 10px; border-bottom: 1px solid #eee; }
        .totals { margin-top: 30px; text-align: right; }
        .totals-row { margin-bottom: 5px; }
        .grand-total { font-size: 18px; font-weight: bold; color: #ff6b00; margin-top: 10px; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="invoice-box">
        <div class="header">
            <div class="logo">AmarShop</div>
            <div style="text-align: right;">
                Invoice #: {{ $order->order_number }}<br>
                Date: {{ $order->created_at->format('d M, Y') }}
            </div>
        </div>

        <div class="info">
            <div class="info-col">
                <strong>From:</strong><br>
                AmarShop E-commerce<br>
                Dhaka, Bangladesh<br>
                Phone: +880 1234 567890<br>
                Email: support@amarshop.com
            </div>
            <div class="info-col" style="text-align: right;">
                <strong>To:</strong><br>
                {{ $order->customer_name }}<br>
                {{ $order->phone }}<br>
                {{ $order->address }}<br>
                {{ $order->area }}, {{ $order->district }}
            </div>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td>
                        {{ $item->product_name }}
                        @if($item->variation)
                            <br><small>({{ collect($item->variation)->map(fn($v, $k) => "$k: $v")->implode(', ') }})</small>
                        @endif
                    </td>
                    <td>৳{{ number_format($item->price, 2) }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>৳{{ number_format($item->total, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="totals">
            <div class="totals-row">Subtotal: ৳{{ number_format($order->subtotal, 2) }}</div>
            <div class="totals-row">Shipping: ৳{{ number_format($order->shipping_cost, 2) }}</div>
            @if($order->discount > 0)
                <div class="totals-row">Discount: -৳{{ number_format($order->discount, 2) }}</div>
            @endif
            <div class="grand-total">Total: ৳{{ number_format($order->payable_amount, 2) }}</div>
        </div>

        <div class="footer">
            Thank you for shopping with AmarShop!<br>
            This is a computer-generated invoice.
        </div>
    </div>
</body>
</html>
