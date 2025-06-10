import React from "react";

interface SimpleCardProps {
  title?: string;
  content: React.ReactNode;
  className?: string;
}

const SimpleCard = ({
  title,
  content,
  className = "",
}: SimpleCardProps) => {
  return (
    <section
      role="region"
    
      className={`rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      {title && (
        <header className="border-b px-5 py-3 bg-gray-50 rounded-t-xl">
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        </header>
      )}

      <div className="p-5 text-gray-700 text-sm leading-relaxed">
        {content}
      </div>
    </section>
  );
};

export default SimpleCard;
