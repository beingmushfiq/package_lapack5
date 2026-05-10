<?php

namespace App\Filament\Resources\ThemeSettings;

use App\Models\ThemeSetting;
use App\Services\CmsApiService;
use Filament\Actions\Action;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ColorColumn;
use Filament\Support\Icons\Heroicon;
use BackedEnum;

class ThemeSettingResource extends Resource
{
    protected static ?string $model = ThemeSetting::class;
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedSwatch;
    protected static string|\UnitEnum|null $navigationGroup = 'CMS';
    protected static ?string $navigationLabel = 'Theme Settings';
    protected static ?int $navigationSort = 5;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Color Palette')
                ->icon('heroicon-o-swatch')
                ->description('Brand colors used throughout the frontend.')
                ->schema([
                    Grid::make(3)->schema([
                        ColorPicker::make('color_primary')->label('Primary Color')
                            ->helperText('Main brand color (buttons, links, highlights)'),
                        ColorPicker::make('color_primary_dark')->label('Primary Dark')
                            ->helperText('Hover state for primary'),
                        ColorPicker::make('color_secondary')->label('Secondary Color'),
                        ColorPicker::make('color_accent')->label('Accent Color')
                            ->helperText('Used for badges, sale tags'),
                        ColorPicker::make('color_danger')->label('Danger / Error'),
                        ColorPicker::make('color_success')->label('Success Color'),
                        ColorPicker::make('color_background')->label('Page Background'),
                        ColorPicker::make('color_surface')->label('Surface / Card Background'),
                        ColorPicker::make('color_text')->label('Text Color'),
                        ColorPicker::make('color_text_muted')->label('Muted Text'),
                    ]),
                ]),

            Section::make('Typography')
                ->icon('heroicon-o-pencil-square')
                ->description('Font families and base sizes.')
                ->schema([
                    Grid::make(2)->schema([
                        Select::make('font_primary')
                            ->label('Primary Font')
                            ->options([
                                'Inter' => 'Inter',
                                'Roboto' => 'Roboto',
                                'Outfit' => 'Outfit',
                                'Poppins' => 'Poppins',
                                'Nunito' => 'Nunito',
                                'DM Sans' => 'DM Sans',
                                'Plus Jakarta Sans' => 'Plus Jakarta Sans',
                                'Lato' => 'Lato',
                                'Open Sans' => 'Open Sans',
                            ])
                            ->searchable(),
                        Select::make('font_heading')
                            ->label('Heading Font')
                            ->options([
                                'Inter' => 'Inter',
                                'Roboto' => 'Roboto',
                                'Outfit' => 'Outfit',
                                'Poppins' => 'Poppins',
                                'Nunito' => 'Nunito',
                                'DM Sans' => 'DM Sans',
                                'Plus Jakarta Sans' => 'Plus Jakarta Sans',
                                'Lato' => 'Lato',
                                'Open Sans' => 'Open Sans',
                            ])
                            ->searchable(),
                        TextInput::make('font_size_base')
                            ->label('Base Font Size')
                            ->placeholder('16px'),
                        TextInput::make('line_height_base')
                            ->label('Line Height')
                            ->placeholder('1.5'),
                    ]),
                ]),

            Section::make('Border Radius')
                ->icon('heroicon-o-squares-2x2')
                ->schema([
                    Grid::make(4)->schema([
                        TextInput::make('border_radius_sm')->label('Radius SM')->placeholder('6px'),
                        TextInput::make('border_radius_md')->label('Radius MD')->placeholder('12px'),
                        TextInput::make('border_radius_lg')->label('Radius LG')->placeholder('20px'),
                        TextInput::make('border_radius_full')->label('Radius Full')->placeholder('9999px'),
                    ]),
                ]),

            Section::make('Container & Layout')
                ->icon('heroicon-o-rectangle-group')
                ->schema([
                    TextInput::make('container_max_width')
                        ->label('Max Container Width')
                        ->placeholder('1440px'),
                ]),

            Section::make('Shadows')
                ->icon('heroicon-o-cube')
                ->collapsed()
                ->schema([
                    Grid::make(1)->schema([
                        TextInput::make('shadow_sm')->label('Shadow SM')->placeholder('0 1px 2px 0 rgba(0,0,0,0.05)'),
                        TextInput::make('shadow_md')->label('Shadow MD')->placeholder('0 4px 6px -1px rgba(0,0,0,0.1)'),
                        TextInput::make('shadow_lg')->label('Shadow LG')->placeholder('0 10px 15px -3px rgba(0,0,0,0.1)'),
                    ]),
                ]),

            Section::make('Animations')
                ->icon('heroicon-o-sparkles')
                ->collapsed()
                ->schema([
                    Grid::make(3)->schema([
                        Toggle::make('enable_animations')->label('Enable Animations')->default(true),
                        TextInput::make('animation_duration')->label('Duration')->placeholder('300ms'),
                        Select::make('animation_easing')
                            ->label('Easing')
                            ->options([
                                'ease' => 'Ease',
                                'ease-in' => 'Ease In',
                                'ease-out' => 'Ease Out',
                                'ease-in-out' => 'Ease In Out',
                                'linear' => 'Linear',
                            ]),
                    ]),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('key')->searchable()->sortable(),
                TextColumn::make('label')->searchable(),
                TextColumn::make('group')->badge(),
                TextColumn::make('type')->badge()->color('gray'),
                TextColumn::make('value')->limit(40),
                TextColumn::make('updated_at')->dateTime()->sortable(),
            ])
            ->defaultSort('group');
    }

    public static function getPages(): array
    {
        return [
            'index' => \App\Filament\Resources\ThemeSettings\Pages\ManageThemeSettings::route('/'),
        ];
    }

    public static function getHeaderActions(): array
    {
        return [
            Action::make('clear_cache')
                ->label('Clear Theme Cache')
                ->icon('heroicon-o-arrow-path')
                ->color('warning')
                ->action(function () {
                    app(CmsApiService::class)->clearCache('theme');
                    Notification::make()
                        ->title('Theme cache cleared!')
                        ->success()
                        ->send();
                }),
        ];
    }
}
