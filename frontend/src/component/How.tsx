import React from 'react';
import { Search, CheckCircle, AlertTriangle } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Search',
    description: 'Enter a username to check',
    details: 'Simply type in your desired username in the search box above and click "Check Availability".',
    iconColor: 'text-blue-600',
  },
  {
    icon: CheckCircle,
    title: 'Check',
    description: 'We scan popular platforms',
    details: 'Our system checks the username across multiple social media platforms and websites.',
    iconColor: 'text-green-600',
  },
  {
    icon: AlertTriangle,
    title: 'Results',
    description: 'Review availability status',
    details: 'See at a glance where your username is available, taken, or has an unknown status.',
    iconColor: 'text-yellow-600',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-8 ">
      <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <StepCard key={index} {...step} />
        ))}
      </div>
    </div>
  );
};




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
   
 <div className="rounded-xl border p-4 shadow-sm  ">
      <div className="flex flex-col ">
        <Icon className={`h-8 w-8 mb-2  ${iconColor}`} />
        <h3 className="text-lg text-left font-semibold">{title}</h3>
        <p className="text-sm text-gray-500 mb-3">{description}</p>
        <p className="text-sm text-gray-700">{details}</p>
      </div>
    </div>

   
  );
};



