import React from 'react';
import Pill from './Pill';

interface PillGroupProps {
  label: string;
  options: string[];
  selectedValue: string | undefined;
  onSelectionChange: (value: string | undefined) => void;
  allowDeselect?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium';
}

const PillGroup: React.FC<PillGroupProps> = ({
  label,
  options,
  selectedValue,
  onSelectionChange,
  allowDeselect = true,
  variant = 'primary',
  size = 'medium'
}) => {
  const handlePillClick = (value: string) => {
    if (selectedValue === value && allowDeselect) {
      // Deselect if already selected and deselection is allowed
      onSelectionChange(undefined);
    } else {
      // Select the new value
      onSelectionChange(value);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#333',
        marginBottom: '0.25rem'
      }}>
        {label}
      </label>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        alignItems: 'center'
      }}>
        {allowDeselect && (
          <Pill
            key="all"
            label={`All ${label}`}
            isSelected={!selectedValue}
            onClick={() => onSelectionChange(undefined)}
            variant={variant}
            size={size}
          />
        )}
        {options.map((option) => (
          <Pill
            key={option}
            label={option}
            isSelected={selectedValue === option}
            onClick={() => handlePillClick(option)}
            variant={variant}
            size={size}
          />
        ))}
      </div>
    </div>
  );
};

export default PillGroup;
