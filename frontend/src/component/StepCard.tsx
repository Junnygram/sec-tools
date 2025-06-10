
import { LucideIcon } from 'lucide-react';

type StepCardProps = {
    icon: LucideIcon;
    title: string;
    description: string;
    details: string;
    iconColor?: string;
  };
  
export const StepCard = ({
    icon: Icon,
    title,
    description,
    details,
    iconColor = 'text-primary',
  }: StepCardProps) => {
    return (
      <div className="rounded-xl border p-6 shadow-sm bg-white">
        <div className="flex flex-col items-center text-center">
          <Icon className={`h-8 w-8 mb-2 ${iconColor}`} />
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-500 mb-3">{description}</p>
          <p className="text-sm text-gray-700">{details}</p>
        </div>
      </div>
    );
  };
  