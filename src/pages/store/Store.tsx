import React from 'react';
import { ShoppingCart, Star, SlidersHorizontal } from 'lucide-react';
import { useProductStore } from '../../store/productStore';
import { useCartStore } from '../../store/cartStore';

const priceRanges = [
  { min: 0, max: 25, label: 'Under $25' },
  { min: 25, max: 50, label: '$25 - $50' },
  { min: 50, max: 100, label: '$50 - $100' },
  { min: 100, max: Infinity, label: 'Over $100' }
];

export const Store = () => {
  const products = useProductStore((state) => state.products);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [selectedPriceRange, setSelectedPriceRange] = React.useState<number>(-1);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [showFilters, setShowFilters] = React.useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = selectedPriceRange === -1 ? true : 
                        product.price >= priceRanges[selectedPriceRange].min && 
                        product.price < priceRanges[selectedPriceRange].max;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const handleAddToCart = (product) => {
    addItem(product);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedPriceRange(-1);
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Pro Shop</h1>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search products..."
              className="px-4 py-2 border rounded-md w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 border rounded-md hover:bg-gray-50"
              title="Toggle Filters"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="w-full px-4 py-2 border rounded-md"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Supplements">Supplements</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <select
                  className="w-full px-4 py-2 border rounded-md"
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(Number(e.target.value))}
                >
                  <option value={-1}>All Prices</option>
                  {priceRanges.map((range, index) => (
                    <option key={range.label} value={index}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
            <div className="relative h-64 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{product.description}</p>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-1 text-sm font-medium">4.8</span>
                </div>
                <span className="text-sm text-gray-500">(120+ reviews)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">${product.price}</span>
                <span className="text-sm text-gray-500">{product.stock} in stock</span>
              </div>
            </div>
            <div className="px-6 pb-6">
              <button 
                onClick={() => handleAddToCart(product)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};