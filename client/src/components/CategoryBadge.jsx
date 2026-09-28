import React from 'react';
import { BookOpen, Users, Briefcase, PartyPopper, Sun, Lock } from 'lucide-react';

const CATEGORY_CONFIG = {
  'Study Room': {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: BookOpen,
  },
  'Hangout Space': {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Users,
  },
  'Meeting Room': {
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Briefcase,
  },
  'Party/Event Space': {
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: PartyPopper,
  },
  'Terrace': {
    bg: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: Sun,
  },
  'Private Room': {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: Lock,
  }
};

export default function CategoryBadge({ category, size = 'sm' }) {
  const config = CATEGORY_CONFIG[category] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Users
  };
  const Icon = config.icon;

  const sizeClasses = size === 'sm'
    ? 'text-xs px-2.5 py-1 gap-1.5'
    : 'text-sm px-3.5 py-1.5 gap-2 font-medium';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-xs ${config.bg} ${sizeClasses}`}
    >
      <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      <span>{category}</span>
    </span>
  );
}
