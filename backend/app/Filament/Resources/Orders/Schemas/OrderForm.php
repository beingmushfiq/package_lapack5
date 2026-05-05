<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Schemas\Components\Grid;
use Filament\Forms\Components\Repeater;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Placeholder;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Grid::make(3)
                    ->schema([
                        Section::make('Order Info')
                            ->schema([
                                TextInput::make('order_number')
                                    ->placeholder('Auto-generated')
                                    ->disabled()
                                    ->dehydrated(fn ($state) => filled($state)),
                                Select::make('status')
                                    ->options([
                                        'pending' => 'Pending',
                                        'confirmed' => 'Confirmed',
                                        'processing' => 'Processing',
                                        'shipped' => 'Shipped',
                                        'delivered' => 'Delivered',
                                        'cancelled' => 'Cancelled',
                                        'returned' => 'Returned',
                                    ])
                                    ->required()
                                    ->native(false),
                                Select::make('payment_status')
                                    ->options([
                                        'pending' => 'Pending',
                                        'paid' => 'Paid',
                                        'failed' => 'Failed',
                                        'refunded' => 'Refunded',
                                    ])
                                    ->required(),
                            ])
                            ->columnSpan(1),

                        Section::make('Customer Details')
                            ->schema([
                                TextInput::make('customer_name')
                                    ->required(),
                                TextInput::make('customer_phone')
                                    ->required(),
                                TextInput::make('customer_email')
                                    ->email(),
                                Grid::make(2)
                                    ->schema([
                                        TextInput::make('district'),
                                        TextInput::make('area'),
                                    ]),
                                Textarea::make('shipping_address')
                                    ->required()
                                    ->rows(3),
                            ])
                            ->columnSpan(2),
                    ]),

                Section::make('Order Items')
                    ->schema([
                        Repeater::make('items')
                            ->relationship()
                            ->schema([
                                Select::make('product_id')
                                    ->relationship('product', 'name')
                                    ->required()
                                    ->reactive()
                                    ->afterStateUpdated(function ($state, callable $set) {
                                        $product = \App\Models\Product::find($state);
                                        $set('price', $product?->price ?? 0);
                                        $set('product_name', $product?->name ?? '');
                                    }),
                                TextInput::make('quantity')
                                    ->numeric()
                                    ->default(1)
                                    ->required()
                                    ->reactive(),
                                TextInput::make('price')
                                    ->numeric()
                                    ->prefix('৳')
                                    ->required()
                                    ->reactive(),
                                Placeholder::make('total')
                                    ->content(fn ($get) => '৳' . number_format(($get('quantity') ?? 0) * ($get('price') ?? 0), 2)),
                            ])
                            ->columns(4)
                            ->defaultItems(1)
                            ->live()
                            ->afterStateUpdated(function (callable $get, callable $set) {
                                $total = collect($get('items'))->sum(function ($item) {
                                    return ($item['quantity'] ?? 0) * ($item['price'] ?? 0);
                                });
                                $set('total_amount', $total);
                                $set('payable_amount', $total + ($get('shipping_cost') ?? 0) - ($get('discount_amount') ?? 0));
                            }),
                    ]),

                Grid::make(2)
                    ->schema([
                        Section::make('Financials')
                            ->schema([
                                TextInput::make('total_amount')
                                    ->numeric()
                                    ->prefix('৳')
                                    ->required()
                                    ->readOnly(),
                                TextInput::make('shipping_cost')
                                    ->numeric()
                                    ->prefix('৳')
                                    ->default(0)
                                    ->live()
                                    ->afterStateUpdated(function (callable $get, callable $set) {
                                        $set('payable_amount', ($get('total_amount') ?? 0) + ($get('shipping_cost') ?? 0) - ($get('discount_amount') ?? 0));
                                    }),
                                TextInput::make('discount_amount')
                                    ->numeric()
                                    ->prefix('৳')
                                    ->default(0)
                                    ->live()
                                    ->afterStateUpdated(function (callable $get, callable $set) {
                                        $set('payable_amount', ($get('total_amount') ?? 0) + ($get('shipping_cost') ?? 0) - ($get('discount_amount') ?? 0));
                                    }),
                                TextInput::make('payable_amount')
                                    ->numeric()
                                    ->prefix('৳')
                                    ->required()
                                    ->readOnly()
                                    ->helperText('Final amount to be paid by customer.'),
                                TextInput::make('coupon_code'),
                            ])
                            ->columnSpan(1),

                        Section::make('Logistics & Courier')
                            ->schema([
                                TextInput::make('courier_name')
                                    ->placeholder('e.g. steadfast'),
                                TextInput::make('courier_tracking_id'),
                                TextInput::make('courier_status')
                                    ->disabled(),
                                Textarea::make('admin_note')
                                    ->label('Internal Admin Note')
                                    ->rows(3),
                            ])
                            ->columnSpan(1),
                    ]),
            ]);
    }
}
