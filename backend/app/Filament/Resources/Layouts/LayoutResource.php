<?php

namespace App\Filament\Resources\Layouts;

use App\Filament\Resources\Layouts\Pages\CreateLayout;
use App\Filament\Resources\Layouts\Pages\EditLayout;
use App\Filament\Resources\Layouts\Pages\ListLayouts;
use App\Models\Layout;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\KeyValue;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Actions\EditAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Support\Icons\Heroicon;

class LayoutResource extends Resource
{
    protected static ?string $model = Layout::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedViewColumns;

    protected static string|\UnitEnum|null $navigationGroup = 'CMS';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Grid::make(2)->schema([
                    TextInput::make('name')
                        ->required()
                        ->maxLength(255)
                        ->live(onBlur: true)
                        ->afterStateUpdated(fn ($set, $state) => $set('slug', \Illuminate\Support\Str::slug($state))),
                    TextInput::make('slug')
                        ->required()
                        ->maxLength(255)
                        ->unique(ignoreRecord: true),
                ]),
                Grid::make(2)->schema([
                    TextInput::make('container_width')
                        ->label('Container Width')
                        ->default('1440px')
                        ->helperText('e.g. 1440px, 100%, 1200px'),
                    Toggle::make('is_default')
                        ->label('Default Layout')
                        ->helperText('Only one layout can be default'),
                ]),
                Grid::make(3)->schema([
                    Toggle::make('show_header')
                        ->label('Show Header')
                        ->default(true),
                    Toggle::make('show_footer')
                        ->label('Show Footer')
                        ->default(true),
                    Toggle::make('show_sub_navbar')
                        ->label('Show Sub Navbar')
                        ->default(true),
                ]),
                Section::make('Global Styles')
                    ->description('CSS variables applied to all pages using this layout')
                    ->collapsed()
                    ->schema([
                        KeyValue::make('global_styles')
                            ->columnSpanFull()
                            ->addActionLabel('Add Style')
                            ->keyLabel('CSS Property')
                            ->valueLabel('Value'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('slug')
                    ->color('gray'),
                TextColumn::make('container_width')
                    ->label('Width'),
                IconColumn::make('show_header')
                    ->boolean()
                    ->label('Header'),
                IconColumn::make('show_footer')
                    ->boolean()
                    ->label('Footer'),
                IconColumn::make('is_default')
                    ->boolean()
                    ->label('Default'),
                TextColumn::make('pages_count')
                    ->counts('pages')
                    ->label('Pages'),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListLayouts::route('/'),
            'create' => CreateLayout::route('/create'),
            'edit' => EditLayout::route('/{record}/edit'),
        ];
    }
}
