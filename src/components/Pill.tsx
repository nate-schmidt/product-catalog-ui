import React from 'react';

interface PillProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium';
}

const Pill: React.FC<PillProps> = ({ 
  label, 
  isSelected, 
  onClick, 
  variant = 'primary',
  size = 'medium' 
}) => {
  const getBaseStyles = () => ({
    padding: size === 'small' ? '0.375rem 0.75rem' : '0.5rem 1rem',
    borderRadius: '20px',
    border: '2px solid',
    cursor: 'pointer',
    fontSize: size === 'small' ? '0.8rem' : '0.9rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    userSelect: 'none' as const,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap' as const,
    outline: 'none'
  });

  const getPrimaryStyles = () => ({
    ...getBaseStyles(),
    backgroundColor: isSelected ? '#007bff' : 'transparent',
    borderColor: '#007bff',
    color: isSelected ? 'white' : '#007bff'
  });

  const getSecondaryStyles = () => ({
    ...getBaseStyles(),
    backgroundColor: isSelected ? '#6c757d' : 'transparent',
    borderColor: '#6c757d',
    color: isSelected ? 'white' : '#6c757d'
  });

  const styles = variant === 'primary' ? getPrimaryStyles() : getSecondaryStyles();

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isSelected) {
      const primaryHoverColor = variant === 'primary' ? '#007bff' : '#6c757d';
      e.currentTarget.style.backgroundColor = primaryHoverColor;
      e.currentTarget.style.color = 'white';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isSelected) {
      e.currentTarget.style.backgroundColor = 'transparent';
      const primaryColor = variant === 'primary' ? '#007bff' : '#6c757d';
      e.currentTarget.style.color = primaryColor;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      style={styles}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      aria-pressed={isSelected}
      role="button"
      tabIndex={0}
    >
      {label}
    </button>
  );
};

export default Pill;
