<x-filament-panels::page>
    <div class="max-w-7xl mx-auto space-y-12 pb-20">
        
        {{-- ── Navigation & Status ── --}}
        <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-white/5 pb-8">
            <div>
                <h2 class="text-3xl font-light tracking-tight text-gray-900 dark:text-white">Design System</h2>
                <p class="text-sm text-gray-500 mt-1">Orchestrate your brand's visual language across all touchpoints.</p>
            </div>
            <div class="flex items-center gap-3">
                <button wire:click="resetDefaults" wire:confirm="Reset to factory settings?" class="text-xs font-medium text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    Reset Defaults
                </button>
                <div class="h-4 w-px bg-gray-200 dark:bg-white/10 mx-2"></div>
                <button wire:click="save" class="relative inline-flex items-center justify-center px-8 py-2.5 text-sm font-medium text-white transition-all bg-gray-900 dark:bg-white dark:text-gray-950 rounded-full hover:shadow-lg active:scale-[0.98]">
                    Save Changes
                </button>
            </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {{-- ── Left: Configuration ── --}}
            <div class="lg:col-span-2 space-y-16">
                
                {{-- 01. Color Architecture --}}
                <section class="space-y-8">
                    <div class="flex items-baseline gap-3">
                        <span class="text-xs font-medium text-gray-400 tabular-nums">01</span>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Color Architecture</h3>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        @foreach([
                            ['key' => 'color_primary', 'label' => 'Primary Accent'],
                            ['key' => 'color_primary_dark', 'label' => 'Primary Hover'],
                            ['key' => 'color_secondary', 'label' => 'Secondary'],
                            ['key' => 'color_accent', 'label' => 'Promotion'],
                            ['key' => 'color_background', 'label' => 'Page Base'],
                            ['key' => 'color_surface', 'label' => 'Elevated Surface'],
                            ['key' => 'color_text', 'label' => 'Content Primary'],
                            ['key' => 'color_text_muted', 'label' => 'Content Secondary'],
                        ] as $field)
                            <div class="group relative space-y-3">
                                <div class="flex items-center justify-between">
                                    <label class="text-xs font-semibold uppercase tracking-widest text-gray-500">{{ $field['label'] }}</label>
                                    <span class="text-[10px] font-mono text-gray-300 group-hover:text-gray-600 transition-colors">{{ strtoupper($this->{$field['key']}) }}</span>
                                </div>
                                <div class="flex items-center gap-4 p-1.5 rounded-2xl bg-white dark:bg-white/5 ring-1 ring-gray-200 dark:ring-white/10 transition-all focus-within:ring-gray-900 dark:focus-within:ring-white">
                                    <div class="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm">
                                        <input type="color" wire:model.live="{{ $field['key'] }}"
                                            class="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer p-0 border-none" />
                                    </div>
                                    <input type="text" wire:model.lazy="{{ $field['key'] }}" 
                                        class="flex-1 bg-transparent border-none p-0 text-sm font-mono focus:ring-0 text-gray-700 dark:text-gray-300" />
                                </div>
                            </div>
                        @endforeach
                    </div>
                </section>

                {{-- 02. Typography --}}
                <section class="space-y-8 pt-8">
                    <div class="flex items-baseline gap-3">
                        <span class="text-xs font-medium text-gray-400 tabular-nums">02</span>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Typography & Voice</h3>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                        @php $fonts = ['Inter','Outfit','Plus Jakarta Sans','DM Sans','Roboto','Montserrat']; @endphp
                        @foreach([
                            ['key' => 'font_primary', 'label' => 'Body Typeface', 'type' => 'select'],
                            ['key' => 'font_heading', 'label' => 'Heading Typeface', 'type' => 'select'],
                            ['key' => 'font_size_base', 'label' => 'Base Scale', 'type' => 'text'],
                            ['key' => 'line_height_base', 'label' => 'Leading', 'type' => 'text'],
                        ] as $field)
                            <div class="space-y-2">
                                <label class="text-xs font-semibold uppercase tracking-widest text-gray-500">{{ $field['label'] }}</label>
                                @if($field['type'] === 'select')
                                    <select wire:model="{{ $field['key'] }}" class="w-full bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-gray-900 dark:focus:border-white focus:ring-0 transition-all py-3 px-4">
                                        @foreach($fonts as $f) <option value="{{ $f }}">{{ $f }}</option> @endforeach
                                    </select>
                                @else
                                    <input type="text" wire:model.lazy="{{ $field['key'] }}" class="w-full bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl text-sm focus:border-gray-900 dark:focus:border-white focus:ring-0 transition-all py-3 px-4" />
                                @endif
                            </div>
                        @endforeach
                    </div>
                </section>

                {{-- 03. Interaction --}}
                <section class="space-y-8 pt-8">
                    <div class="flex items-baseline gap-3">
                        <span class="text-xs font-medium text-gray-400 tabular-nums">03</span>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Interaction Design</h3>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                        @foreach([
                            ['key' => 'border_radius_md', 'label' => 'Corner Softness'],
                            ['key' => 'animation_duration', 'label' => 'Motion Velocity'],
                        ] as $field)
                            <div class="space-y-2">
                                <label class="text-xs font-semibold uppercase tracking-widest text-gray-500">{{ $field['label'] }}</label>
                                <input type="text" wire:model.lazy="{{ $field['key'] }}" class="w-full bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl text-sm font-mono focus:border-gray-900 dark:focus:border-white focus:ring-0 transition-all py-3 px-4" />
                            </div>
                        @endforeach
                        
                        <div class="md:col-span-2 flex items-center justify-between p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                            <div class="space-y-1">
                                <p class="text-sm font-medium text-gray-900 dark:text-white">Enable Visual Motion</p>
                                <p class="text-xs text-gray-500">Apply hardware-accelerated animations across the interface.</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" wire:model.live="enable_animations" class="sr-only peer">
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-900 dark:peer-checked:bg-white"></div>
                            </label>
                        </div>
                    </div>
                </section>
            </div>

            {{-- ── Right: Preview ── --}}
            <aside class="lg:col-span-1">
                <div class="sticky top-12 space-y-8">
                    <div class="relative group">
                        <div class="absolute -inset-4 bg-gradient-to-tr from-gray-100 to-white dark:from-white/5 dark:to-transparent rounded-[2.5rem] -z-10 transition-all"></div>
                        
                        <div class="overflow-hidden rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-2xl transition-all duration-700" style="background-color: {{ $color_background }}">
                            {{-- Preview UI --}}
                            <div class="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                                <span class="text-lg font-light tracking-tight transition-all" style="color: {{ $color_text }}; font-family: {{ $font_heading }}, sans-serif">Logo.</span>
                                <div class="flex gap-4">
                                    <div class="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                    <div class="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                </div>
                            </div>

                            <div class="p-10 space-y-10">
                                <div class="space-y-4">
                                    <span class="inline-block text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full text-white" style="background-color: {{ $color_accent }}">Exclusive</span>
                                    <h4 class="text-4xl font-light leading-[1.1] tracking-tight" style="color: {{ $color_text }}; font-family: {{ $font_heading }}, sans-serif">The Purest Blend.</h4>
                                    <p class="text-sm leading-relaxed opacity-70" style="color: {{ $color_text }}; font-family: {{ $font_primary }}, sans-serif">Curating essential traditions for the modern lifestyle.</p>
                                </div>

                                <div class="flex gap-4">
                                    <button class="px-10 py-4 text-xs font-medium uppercase tracking-widest text-white shadow-lg shadow-black/5 transition-all active:scale-[0.98]" 
                                        style="background-color: {{ $color_primary }}; border-radius: {{ $border_radius_md }}">
                                        Explore
                                    </button>
                                </div>

                                <div class="pt-8 space-y-6">
                                    <div class="aspect-[16/9] w-full rounded-3xl overflow-hidden bg-gray-100 dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/5" style="border-radius: {{ $border_radius_md }}">
                                        <div class="w-12 h-12 rounded-full border border-gray-200 dark:border-white/10"></div>
                                    </div>
                                    <div class="flex items-center justify-between">
                                         <div class="space-y-1">
                                            <div class="h-2 w-20 bg-gray-200 dark:bg-white/10 rounded-full"></div>
                                            <div class="h-2 w-12 bg-gray-100 dark:bg-white/5 rounded-full"></div>
                                         </div>
                                         <div class="w-10 h-10 rounded-full" style="background-color: {{ $color_secondary }}"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button wire:click="clearCache" class="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-gray-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Flush CMS Cache
                    </button>
                </div>
            </aside>
        </div>
    </div>
</x-filament-panels::page>
