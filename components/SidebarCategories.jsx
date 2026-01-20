import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

/**
 * SidebarCategories renders the list of category filters.
 * Props:
 *  - categories: string[] – list of category names (including 'all')
 *  - selectedCategory: string – currently active category
 *  - setSelectedCategory: (cat: string) => void – callback to change selection
 */
export default function SidebarCategories({ categories, selectedCategory, setSelectedCategory }) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
            <ul className="space-y-2">
                {categories.map((cat) => (
                    <li key={cat}>
                        <button
                            onClick={() => setSelectedCategory(cat)}
                            className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
                ${selectedCategory === cat ? 'bg-black text-white ring-2 ring-yellow-400' : 'bg-white text-gray-700 hover:bg-gray-100'}
                transition-colors`}
                        >
                            {/* Optional icon – using Sparkles as placeholder */}
                            <Sparkles className="h-4 w-4" />
                            <span>{cat === 'all' ? 'All Categories' : cat}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
