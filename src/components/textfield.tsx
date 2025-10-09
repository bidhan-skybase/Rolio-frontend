"use client";

import React from "react";

interface TextFieldProps {
    placeholder?: string;
    type?: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}

export default function TextField({
                                      placeholder,
                                      type = "text",
                                      name,
                                      value,
                                      onChange,
                                      disabled = false,
                                  }: TextFieldProps) {
    return (
        <div className="flex flex-col gap-1 w-full">
            <input
                style={{backgroundColor:"#E8E8E8"}}
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`rounded-[4px] px-3 py-3 text-gray-900 placeholder-gray-500 
        focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 placeholder:text-[14px]
        text-[16px] font-medium
        ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
            />
        </div>
    );
}
