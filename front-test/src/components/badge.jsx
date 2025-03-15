import React from "react";

export const Badge = ({ children, className, ...props }) => {
  return (
    <div
      className={`inline-flex items-center px-2 py-1 text-sm font-medium bg-gray-100 border rounded-full ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
