<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #{{ $order->order_number }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            font-size: 14px;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            display: table;
            width: 100%;
            margin-bottom: 30px;
            border-bottom: 2px solid #10b981;
            padding-bottom: 20px;
        }
        .header-col {
            display: table-cell;
            vertical-align: top;
        }
        .header-left {
            width: 50%;
        }
        .header-right {
            width: 50%;
            text-align: right;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #111827;
            margin: 0;
        }
        .logo span {
            color: #10b981;
        }
        .invoice-title {
            font-size: 24px;
            font-weight: bold;
            color: #6b7280;
            text-transform: uppercase;
            margin: 0 0 5px 0;
        }
        .info-section {
            display: table;
            width: 100%;
            margin-bottom: 30px;
        }
        .info-col {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }
        .info-col h3 {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            margin: 0 0 10px 0;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
        }
        .info-col p {
            margin: 0 0 5px 0;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .table th, .table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        .table th {
            background-color: #f9fafb;
            font-size: 12px;
            text-transform: uppercase;
            color: #6b7280;
        }
        .table td {
            font-size: 14px;
            color: #1f2937;
        }
        .text-right {
            text-align: right !important;
        }
        .totals {
            width: 50%;
            float: right;
        }
        .totals-table {
            width: 100%;
            border-collapse: collapse;
        }
        .totals-table td {
            padding: 8px 12px;
            border-bottom: 1px solid #f3f4f6;
        }
        .totals-table tr:last-child td {
            border-bottom: none;
            font-weight: bold;
            font-size: 16px;
            color: #10b981;
            border-top: 2px solid #e5e7eb;
        }
        .footer {
            clear: both;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-col header-left">
                <h1 class="logo">Amar<span>Shop</span></h1>
                <p>
                    Dhanmondi, Dhaka-1205<br>
                    Bangladesh<br>
                    info@amarshop.com.bd<br>
                    +880 1234 567890
                </p>
            </div>
            <div class="header-col header-right">
                <h2 class="invoice-title">INVOICE</h2>
                <p>
                    <strong>Invoice #:</strong> {{ $order->order_number }}<br>
                    <strong>Date:</strong> {{ $order->created_at->format('M d, Y') }}<br>
                    <strong>Status:</strong> <span style="text-transform: capitalize;">{{ $order->payment_status }}</span>
                </p>
            </div>
        </div>

        <div class="info-section">
            <div class="info-col">
                <h3>Bill To</h3>
                <p>
                    <strong>{{ $order->customer_name }}</strong><br>
                    {{ $order->shipping_address }}<br>
                    {{ $order->area ? $order->area . ', ' : '' }}{{ $order->district }}<br>
                    {{ $order->customer_phone }}<br>
                    {{ $order->customer_email }}
                </p>
            </div>
            <div class="info-col">
                <h3>Order Details</h3>
                <p>
                    <strong>Order Status:</strong> <span style="text-transform: capitalize;">{{ $order->status }}</span><br>
                    <strong>Payment Method:</strong> <span style="text-transform: capitalize;">{{ str_replace('_', ' ', $order->payment_method) }}</span><br>
                    @if($order->courier_name)
                    <strong>Courier:</strong> <span style="text-transform: capitalize;">{{ $order->courier_name }}</span><br>
                    @endif
                    @if($order->courier_tracking_id)
                    <strong>Tracking ID:</strong> {{ $order->courier_tracking_id }}<br>
                    @endif
                </p>
            </div>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th class="text-right">Qty</th>
                    <th class="text-right">Unit Price</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td>
                        {{ $item->product_name }}
                        @if($item->variation)
                            <br><small style="color: #6b7280;">({{ is_array($item->variation) ? implode(', ', $item->variation) : $item->variation }})</small>
                        @endif
                    </td>
                    <td class="text-right">{{ $item->quantity }}</td>
                    <td class="text-right">৳{{ number_format($item->price, 2) }}</td>
                    <td class="text-right">৳{{ number_format($item->total, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="totals">
            <table class="totals-table">
                <tr>
                    <td>Subtotal</td>
                    <td class="text-right">৳{{ number_format($order->total_amount, 2) }}</td>
                </tr>
                <tr>
                    <td>Shipping</td>
                    <td class="text-right">৳{{ number_format($order->shipping_cost, 2) }}</td>
                </tr>
                @if($order->discount_amount > 0)
                <tr>
                    <td>Discount @if($order->coupon_code) ({{ $order->coupon_code }}) @endif</td>
                    <td class="text-right">-৳{{ number_format($order->discount_amount, 2) }}</td>
                </tr>
                @endif
                <tr>
                    <td><strong>Total</strong></td>
                    <td class="text-right"><strong>৳{{ number_format($order->payable_amount, 2) }}</strong></td>
                </tr>
            </table>
        </div>

        <div class="footer">
            <p>Thank you for shopping with AmarShop!</p>
            <p>If you have any questions about this invoice, please contact support.</p>
        </div>
    </div>
</body>
</html>
