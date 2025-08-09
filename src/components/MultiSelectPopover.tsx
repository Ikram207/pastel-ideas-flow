import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface MultiSelectProps {
  label: string;
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
}

const MultiSelectPopover: React.FC<MultiSelectProps> = ({ label, options, values, onChange }) => {
  const toggle = (v: string) => {
    onChange(values.includes(v) ? values.filter(x => x !== v) : [...values, v]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-between w-full">
          {label}
          <span className="text-muted-foreground text-sm">{values.length} sélectionné(s)</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2 max-h-64 overflow-auto">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={values.includes(opt)} onCheckedChange={() => toggle(opt)} />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectPopover;
