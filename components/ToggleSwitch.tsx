import React from 'react';

interface ToggleSwitchProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  description?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, enabled, onChange, description }) => {
  const handleToggle = () => {
    onChange(!enabled);
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <label htmlFor="toggle-switch" className="font-medium text-slate-300">
          {label}
        </label>
        {description && <p className="text-xs text-slate-500">{description}</p>}
      </div>
      <button
        id="toggle-switch"
        type="button"
        onClick={handleToggle}
        className={`${
          enabled ? 'bg-indigo-600' : 'bg-slate-600'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800`}
        role="switch"
        aria-checked={enabled}
      >
        <span
          aria-hidden="true"
          className={`${
            enabled ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
