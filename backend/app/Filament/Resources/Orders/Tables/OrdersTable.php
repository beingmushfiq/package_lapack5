<?php

namespace App\Filament\Resources\Orders\Tables;

use App\Models\Order;
use App\Services\CourierService;
use App\Services\SmsService;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Notifications\Notification;

class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('order_number')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('customer_name')
                    ->searchable()
                    ->description(fn (Order $record) => $record->customer_phone),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'gray',
                        'confirmed' => 'info',
                        'processing' => 'warning',
                        'shipped' => 'primary',
                        'delivered' => 'success',
                        'cancelled', 'returned' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('payable_amount')
                    ->money('BDT')
                    ->sortable(),
                TextColumn::make('courier_name')
                    ->label('Courier')
                    ->toggleable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                ActionGroup::make([
                    EditAction::make(),
                    Action::make('downloadInvoice')
                        ->label('Invoice')
                        ->icon('heroicon-m-document-arrow-down')
                        ->color('success')
                        ->url(fn (Order $record): string => route('orders.invoice', $record))
                        ->openUrlInNewTab(),
                    DeleteAction::make(),
                    
                    Action::make('send_to_courier')
                        ->label('Send to Courier')
                        ->icon('heroicon-o-truck')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(function (Order $record, CourierService $courierService) {
                            $result = $courierService->sendToCourier($record);
                            
                            if ($result['success']) {
                                Notification::make()
                                    ->title('Sent to Courier!')
                                    ->body("Tracking ID: {$result['tracking_id']}")
                                    ->success()
                                    ->send();
                            } else {
                                Notification::make()
                                    ->title('Error Sending to Courier')
                                    ->body($result['message'])
                                    ->danger()
                                    ->send();
                            }
                        })
                        ->visible(fn (Order $record) => empty($record->courier_tracking_id)),

                    Action::make('resend_sms')
                        ->label('Resend Order SMS')
                        ->icon('heroicon-o-chat-bubble-left')
                        ->color('info')
                        ->action(function (Order $record, SmsService $smsService) {
                            $smsService->sendOrderSms($record, 'order_placed');
                            Notification::make()->title('SMS Sent!')->success()->send();
                        }),
                ]),
            ])
            ->bulkActions([
                //
            ]);
    }
}
