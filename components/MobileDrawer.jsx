'use client';

import * as React from 'react';
import { X } from 'lucide-react';

/**
 * MobileDrawer – a custom slide-in drawer for mobile devices.
 * Props:
 *   isOpen: boolean – controls drawer visibility
 *   onClose: () => void – callback when drawer should close
 *   children: ReactNode – content (usually the category list)
 */
export default function MobileDrawer({ isOpen, onClose, children }) {
    // Close on escape key
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when drawer is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div
                className={`fixed inset-y-0 left-0 w-[280px] bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-md hover:bg-gray-100 focus:outline-none transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-700" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">{children}</div>
            </div>
        </>
    );
}
