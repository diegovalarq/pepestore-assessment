import { useState, useEffect } from 'react';
import axios from 'axios';
import { getFintoc } from '@fintoc/fintoc-js';
import { Product, CartItem } from './types';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<'catalog' | 'cart'>('catalog');
  const [category, setCategory] = useState<string>('');
  const [order, setOrder] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  // Read filters from URL on first load so URLs like
  // ?categoria=&orden=&buscar=barrita are respected
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoriaParam = params.get('categoria') || '';
    const ordenParam = params.get('orden') || '';
    const buscarParam = params.get('buscar') || '';
    setCategory(categoriaParam);
    setOrder(ordenParam);
    setSearch(buscarParam);
  }, []);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (category) params.categoria = category;
    if (order) params.orden = order;
    if (search) params.buscar = search;

    const API_BASE =
    import.meta.env.VITE_API_BASE_URL;

    axios.get<Product[]>(`${API_BASE}/products`, { params })
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [category, order, search]);

  const addToCart = (product: Product, quantity: number) => {
    if (quantity <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    alert('Added to cart!');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = async () => {
    try {
      // 1. Create Checkout Session
      const API_BASE =
        import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${API_BASE}/payments/checkout`, {
        amount: total,
      });
      const { session_token } = response.data;

      // 2. Open Fintoc Widget
      const Fintoc = await getFintoc();
      const widget = Fintoc.create({
        product: 'payments',
        publicKey: import.meta.env.VITE_FINTOC_PUBLIC_KEY || 'pk_test_YOUR_KEY_HERE',
        sessionToken: session_token,
        onSuccess: () => {
          alert('Payment Successful! 🎉 Thank you for your purchase.');
          setCart([]);
          setView('catalog');
        },
        onExit: () => {
          console.log('Widget closed');
        },
      });

      widget.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to start payment. Please try again.');
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (category) params.set('categoria', category);
    if (order) params.set('orden', order);
    if (search) params.set('buscar', search);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  const goHome = () => {
    setView('catalog');
    setCategory('');
    setOrder('');
    setSearch('');
    window.history.replaceState({}, '', window.location.pathname);
  };

  return (
    <div className="container">
      <header>
        <button className="logo-button" onClick={goHome}>
          <h1>Pepestore 🐸</h1>
        </button>
        <button onClick={() => setView(view === 'catalog' ? 'cart' : 'catalog')}>
          {view === 'catalog' ? `Cart (${cart.reduce((a, c) => a + c.quantity, 0)})` : 'Back to Catalog'}
        </button>
      </header>

      <main>
        {view === 'catalog' ? (
          <>
            <div className="filters-bar">
              <label>
                Filter by category:
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">All</option>
                  <option value="snacks">Snacks</option>
                  <option value="drinks">Drinks</option>
                </select>
              </label>
              <label>
                Order products by:
                <select value={order} onChange={(e) => setOrder(e.target.value)}>
                  <option value="">Default</option>
                  <option value="precio_asc">Lowest price</option>
                  <option value="precio_desc">Highest price</option>
                  <option value="alfabetico">Alphabetic order</option>
                  <option value="categoria">Category order</option>
                </select>
              </label>
              <label>
                Search product:
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. barrita"
                />
              </label>
              <button onClick={applyFilters}>Apply filters</button>
            </div>

            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>Category: {product.category}</p>
                    <p>Stock: {product.stock}</p>
                    <p className="price">${product.price} {product.currency}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById(`qty-${product.id}`) as HTMLInputElement | null;
                          if (!input) return;
                          const current = parseInt(input.value, 10) || 1;
                          const next = Math.max(1, current - 1);
                          input.value = String(next);
                        }}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={product.stock}
                        defaultValue={1}
                        id={`qty-${product.id}`}
                        style={{ width: '70px', padding: '6px', textAlign: 'center' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById(`qty-${product.id}`) as HTMLInputElement | null;
                          if (!input) return;
                          const current = parseInt(input.value, 10) || 1;
                          const next = Math.min(product.stock, current + 1);
                          input.value = String(next);
                        }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => {
                          const input = document.getElementById(`qty-${product.id}`) as HTMLInputElement | null;
                          const qty = input ? parseInt(input.value, 10) || 1 : 1;
                          addToCart(product, Math.min(qty, product.stock));
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="cart-summary">
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <span>{item.name}</span>
                    <span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        style={{ marginRight: '4px' }}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={item.stock}
                        value={item.quantity}
                        onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                        style={{ width: '60px', textAlign: 'center', marginRight: '4px' }}
                      />
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                        style={{ marginRight: '8px' }}
                      >
                        +
                      </button>
                      x ${item.price} = ${item.price * item.quantity}
                    </span>
                    <button onClick={() => removeFromCart(item.id)} style={{marginLeft: '10px', background: '#e74c3c', padding: '5px 10px'}}>Remove</button>
                  </div>
                ))}
                <div className="total">
                  Total: ${total}
                </div>
                <button className="checkout-btn" onClick={handlePayment}>
                  Pay with Fintoc
                </button>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
