import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = true,
}) => {
  const baseClasses = `bg-surface border border-border-subtle rounded-2xl p-6 transition-all duration-200 ease-out${className ? ` ${className}` : ''}`;

  if (hoverable && onClick) {
    return (
      <motion.div
        className={`${baseClasses} hover:border-purple-700/50 hover:shadow-purple-glow cursor-pointer`}
        whileHover={{ scale: 1.015 }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  if (hoverable && !onClick) {
    return (
      <div className={`${baseClasses} hover:border-purple-700/50 hover:shadow-purple-glow`}>
        {children}
      </div>
    );
  }

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`pb-4 border-b border-border-subtle mb-4${className ? ` ${className}` : ''}`}>
    {children}
  </div>
);

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={className || undefined}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`pt-4 border-t border-border-subtle mt-4${className ? ` ${className}` : ''}`}>
    {children}
  </div>
);

export default Card;
