import React from 'react';
import type { FC } from 'react';

interface INewsFormProps {
    type: string;
    name: string;
    required: boolean;
    label: string;
    placeholder: string;
    onChange: () => void;
}

const FormInput: FC<INewsFormProps> = ({
    type,
    name,
    required,
    label,
    placeholder,
    onChange,
}) => {
    return (
        <div>
            <label
                htmlFor="name"
                className="block mb-1 text-sm font-medium capitalize"
            >
                {label}
            </label>

            <input
                id={name}
                type={type}
                name={name}
                required={required}
                placeholder={placeholder}
                autoComplete={'off'}
                onChange={onChange && ((e) => onChange(e?.target?.value))}
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1"
            />
        </div>
    );
};

export default FormInput;
