import { useState } from 'react';
import { getCategoriesByType } from '@/utils/helpers';

interface CategorySelectorProps {
  type: 'income' | 'expense' | 'investment';
  selectedId: string;
  onSelect: (categoryId: string) => void;
}

export default function CategorySelector({ type, selectedId, onSelect }: CategorySelectorProps) {
  const categories = getCategoriesByType(type);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(cat => 
    cat.name.includes(searchTerm)
  );

  const typeLabels = {
    income: '💵 收入',
    expense: '💸 支出',
    investment: '📈 投资',
  };

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-600 mb-3">{typeLabels[type]}</h4>
      
      <input
        type="text"
        placeholder="搜索分类..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="cute-input mb-3 text-sm"
      />

      <div className="grid grid-cols-4 gap-2">
        {filteredCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-cute transition-all ${
              selectedId === category.id
                ? 'bg-cute-pink text-white shadow-cute'
                : 'bg-white border-2 border-gray-100 hover:border-cute-pink'
            }`}
          >
            <span className="text-xl">{category.icon}</span>
            <span className="text-xs">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
