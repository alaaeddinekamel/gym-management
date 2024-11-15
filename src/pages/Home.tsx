import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Dumbbell, 
  ChevronLeft, 
  ChevronRight, 
  Star,
  TrendingUp,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

const carouselItems = [
  {
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1920',
    title: 'Transform Your Body',
    subtitle: 'Join our expert-led fitness programs',
    cta: 'Start Now',
    link: '/register'
  },
  {
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1920',
    title: 'Premium Equipment',
    subtitle: 'Shop the latest fitness gear',
    cta: 'Shop Now',
    link: '/store?category=equipment'
  },
  {
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80&w=1920',
    title: 'Personal Training',
    subtitle: 'Get personalized workout plans',
    cta: 'Book Session',
    link: '/schedule'
  }
];

const categories = [
  {
    name: 'Equipment',
    image: 'https://images.unsplash.com/photo-1586401100295-7a8096fd0bbb?auto=format&fit=crop&q=80&w=400',
    count: 24,
    slug: 'equipment'
  },
  {
    name: 'Supplements',
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&q=80&w=400',
    count: 32,
    slug: 'supplements'
  },
  {
    name: 'Apparel',
    image: 'https://images.unsplash.com/photo-1609899464726-861593284d78?auto=format&fit=crop&q=80&w=400',
    count: 18,
    slug: 'apparel'
  },
  {
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1518609571773-39b7d303a87b?auto=format&fit=crop&q=80&w=400',
    count: 45,
    slug: 'accessories'
  }
];

const popularProducts = [
  {
    id: '1',
    name: 'Premium Yoga Mat',
    price: 29.99,
    rating: 4.8,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=400',
    category: 'equipment'
  },
  {
    id: '2',
    name: 'Resistance Bands Set',
    price: 24.99,
    rating: 4.7,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1598632640487-6ea4a4e8b963?auto=format&fit=crop&q=80&w=400',
    category: 'equipment'
  },
  {
    id: '3',
    name: 'Whey Protein',
    price: 49.99,
    rating: 4.9,
    reviews: 256,
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&q=80&w=400',
    category: 'supplements'
  },
  {
    id: '4',
    name: 'Adjustable Dumbbell',
    price: 199.99,
    rating: 4.8,
    reviews: 184,
    image: 'https://images.unsplash.com/photo-1586401100295-7a8096fd0bbb?auto=format&fit=crop&q=80&w=400',
    category: 'equipment'
  }
];

export const Home = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const handleAddToCart = (productId: string) => {
    // TODO: Implement add to cart functionality
    navigate('/cart');
  };

  React.useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Carousel */}
      <div className="relative h-[600px] overflow-hidden rounded-3xl">
        {carouselItems.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-8">
                <h1 className="text-6xl font-bold text-white mb-4">{item.title}</h1>
                <p className="text-2xl text-white/90 mb-8">{item.subtitle}</p>
                <Link
                  to={item.link}
                  className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition inline-flex items-center space-x-2"
                >
                  <span>{item.cta}</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Shop Categories */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Shop Categories</h2>
          <Link to="/store" className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/store?category=${category.slug}`}
              className="group relative h-64 rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                <p className="text-white/80">{category.count} Products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Products */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Popular Products</h2>
            <p className="text-gray-600">Top picks from our customers</p>
          </div>
          <Link to="/store" className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
              <Link to={`/store?category=${product.category}&product=${product.id}`}>
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">${product.price}</span>
                  </div>
                </div>
              </Link>
              <div className="px-6 pb-6">
                <button 
                  onClick={() => handleAddToCart(product.id)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers Banner */}
      <section className="relative h-96 rounded-3xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1571388208497-71bedc66e932?auto=format&fit=crop&q=80&w=1920"
          alt="Best Sellers"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-600/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-8">
            <div className="max-w-lg">
              <h2 className="text-4xl font-bold text-white mb-4">Best Sellers</h2>
              <p className="text-xl text-white/90 mb-8">
                Discover our most popular fitness equipment and supplements loved by our community
              </p>
              <Link
                to="/store?sort=best-sellers"
                className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition inline-flex items-center space-x-2"
              >
                <span>Shop Now</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};