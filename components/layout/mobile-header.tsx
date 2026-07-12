'use client';

import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: ReactNode;
}

export function MobileHeader({ title, onBack, rightAction }: MobileHeaderProps) {
  return (
    <div className="sticky top-0 z-40 flex md:hidden items-center justify-between h-14 px-4 bg-surface border-b border-outline-variant shadow-sm text-on-surface">
      <div className="flex-1 flex justify-start">
        {onBack && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="w-10 h-10 rounded-full hover:bg-surface-container-low text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
      </div>
      
      <div className="flex-2 flex justify-center text-center">
        <h1 className="text-lg font-bold text-primary truncate max-w-[200px]">
          {title}
        </h1>
      </div>
      
      <div className="flex-1 flex justify-end">
        {rightAction}
      </div>
    </div>
  );
}
