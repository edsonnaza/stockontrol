"use client"

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface ComboboxOption {
    value: string | number;
    label: string;
}

interface ComboboxProps {
    options: ComboboxOption[];
    value: string | number;
    onValueChange: (value: string | number) => void;
    placeholder?: string;
    children?: React.ReactNode;
}

interface ComboboxContextType {
    search: string;
    setSearch: (search: string) => void;
    value: string | number;
    options: ComboboxOption[];
    onSelect: (value: string | number) => void;
    filtered: ComboboxOption[];
}

const ComboboxContext = React.createContext<ComboboxContextType | undefined>(undefined);

const useComboboxContext = () => {
    const context = React.useContext(ComboboxContext);
    if (!context) {
        throw new Error('Combobox components must be used within Combobox');
    }
    return context;
};

export function Combobox({
    options,
    value,
    onValueChange,
    placeholder = 'Selecciona una opción',
    children,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');

    const handleSelect = (selectedValue: string | number) => {
        onValueChange(selectedValue);
        setOpen(false);
        setSearch('');
    };

    const filtered = options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    const selectedOption = options.find(opt => opt.value.toString() === value.toString());

    return (
        <ComboboxContext.Provider
            value={{
                search,
                setSearch,
                value,
                options,
                onSelect: handleSelect,
                filtered,
            }}
        >
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        <span className="truncate">
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    {children}
                </PopoverContent>
            </Popover>
        </ComboboxContext.Provider>
    );
}

export function ComboboxInput({
    placeholder = 'Buscar...',
    ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
    const { search, setSearch } = useComboboxContext();

    return (
        <div className="flex items-center border-b px-3 py-2">
            <input
                type="text"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex h-11 w-full rounded-md bg-transparent px-0 py-0 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                {...props}
            />
        </div>
    );
}

export function ComboboxContent({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('overflow-hidden p-1 text-popover-foreground', className)}>
            {children}
        </div>
    );
}

export function ComboboxEmpty({ children }: { children: React.ReactNode }) {
    return <div className="py-6 text-center text-sm">{children}</div>;
}

export function ComboboxList({ children }: { children: React.ReactNode }) {
    return <div className="overflow-y-auto max-h-75">{children}</div>;
}

export function ComboboxItem({
    value,
    children,
    className,
}: {
    value: string | number;
    children: React.ReactNode;
    className?: string;
}) {
    const { onSelect, value: selectedValue } = useComboboxContext();
    const isSelected = selectedValue.toString() === value.toString();

    return (
        <button
            onClick={() => onSelect(value)}
            className={cn(
                'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
                isSelected && 'bg-accent text-accent-foreground',
                className
            )}
        >
            <Check
                className={cn(
                    'mr-2 h-4 w-4',
                    isSelected ? 'opacity-100' : 'opacity-0'
                )}
            />
            {children}
        </button>
    );
}

// Helper component para renderizar items filtrados automáticamente
export function ComboboxItemsFiltered() {
    const { filtered } = useComboboxContext();

    if (filtered.length === 0) {
        return <ComboboxEmpty>No encontrado</ComboboxEmpty>;
    }

    return (
        <ComboboxList>
            {filtered.map((item) => (
                <ComboboxItem key={item.value} value={item.value}>
                    {item.label}
                </ComboboxItem>
            ))}
        </ComboboxList>
    );
}
