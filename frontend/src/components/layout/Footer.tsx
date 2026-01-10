import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="py-6 text-center text-sm text-gray-500 bg-transparent">
            <p>&copy; {new Date().getFullYear()} Alberta Energy Regulator. All rights reserved.</p>
            <p className="text-xs mt-1">Version 1.0.0</p>
        </footer>
    );
};
