import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./FoodMenu.css";

import waterImg from "../assets/food/water.png";
import dessertsImg from "../assets/food/desserts.jpg";
import rollsImg from "../assets/food/rolls.jpg";
import drinksImg from "../assets/food/drinks.jpg";
import indianImg from "../assets/food/indian.jpeg";
import miniImg from "../assets/food/mini.png";
import comboImg from "../assets/food/combo.jpg";
import merchImg from "../assets/food/merch.png";
import stationaryImg from "../assets/food/stationary.png";

// Full list of all food items
const allFoodItems = [
  { category: "Water bottles", image: waterImg, options: { "1 litre": 20, "2 litres": 35, "5 litres": 70 } },
  { category: "Desserts", image: dessertsImg, options: { "Cupcakes with team logos": 50, "Brownie-in-a-cup": 60 } },
  { category: "Rolls", image: rollsImg, options: { Chicken: 90, Paneer: 80 } },
  { category: "Drinks", image: drinksImg, options: { "Mojito/Blue Lagoon Mocktails": 100, "Iced Coffee Shake": 90 } },
  { category: "Indian Bites", image: indianImg, options: { "Pav Bhaji with Toasted Pav": 85, "Biryani in a Box (no curry, just mildly spiced)": 120 } },
  { category: "Mini Versions", image: miniImg, options: { "Personal Pizzas (6-inch)": 110, "Mini Burgers": 75 } },
  { category: "Combo Boxes", image: comboImg, options: { "Burger + Fries + Soft Drink": 180, "Chicken Popcorn + Garlic Mayo Dip + Cola": 160, "Paneer Kathi Roll + Masala Fries + Nimbu Soda": 170, "Cheese Sandwich + Nachos + Lemon Iced Tea": 150 } },
  { category: "Merchandise", image: merchImg, options: { Standard: 400 }, fixed: true },
  { category: "Stationary Items", image: stationaryImg, options: { Standard: 300 }, fixed: true },
];

// Grouped sections
const sectionGroups = [
  { title: "Food", categories: ["Desserts", "Rolls", "Indian Bites", "Mini Versions"] },
  { title: "Drinks", categories: ["Water bottles", "Drinks"] },
  { title: "Foods & Drinks", categories: ["Combo Boxes"] },
  { title: "Others", categories: ["Merchandise", "Stationary Items"] },
];

export default function FoodMenu() {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("ipl-cart");
    return stored ? JSON.parse(stored) : {};
  });

  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    localStorage.setItem("ipl-cart", JSON.stringify(cart));
  }, [cart]);

  const handleSelectChange = (category, value) => {
    setSelectedOptions((prev) => ({ ...prev, [category]: value }));
  };

  const handleAdd = (category, options, fixed) => {
    const selected = fixed ? "Standard" : selectedOptions[category];
    if (!selected || !options[selected]) {
      alert("⚠️ Please select a valid item before adding to cart.");
      return;
    }
    const key = `${category}__${selected}`;
    setCart((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
  };

  const handleUpdate = (category, option, change) => {
    const key = `${category}__${option}`;
    setCart((prev) => {
      const count = (prev[key] || 0) + change;
      if (count <= 0) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: count };
    });
  };

  const renderCard = ({ category, image, options, fixed }) => {
    const selected = selectedOptions[category] || "";
    const optionKey = fixed ? "Standard" : selected;
    const key = `${category}__${optionKey}`;
    const quantity = cart[key] || 0;
    const price = options[optionKey];

    const categoryCartItems = Object.entries(cart)
      .filter(([k]) => k.startsWith(`${category}__`))
      .map(([k, q]) => {
        const opt = k.split("__")[1];
        const itemPrice = options?.[opt] || 0;
        return { option: opt, quantity: q, price: itemPrice };
      });

    return (
      <div key={category} className="menu-card-wrapper">
        <div className={`menu-card ${fixed ? "fixed-card" : ""}`}>
          <img className="card-image" src={image} alt={category} />
          <div className="card-content">
            <h3 className="category-title">{category}</h3>

            {!fixed && (
              <>
                <p className="items-price-label">Items & Price</p>
                <select
                  value={selected}
                  onChange={(e) => handleSelectChange(category, e.target.value)}
                >
                  <option value="" disabled>Select an Item</option>
                  {Object.entries(options).map(([opt, p]) => (
                    <option key={opt} value={opt}>{opt} — ₹{p}</option>
                  ))}
                </select>
              </>
            )}

            {fixed && (
              <p className="fixed-price-note">Fixed Price: <strong>₹{price}</strong></p>
            )}

            <div className="card-actions">
              {quantity > 0 ? (
                <div className="quantity-controls">
                  <button className="glow-btn" onClick={() => handleUpdate(category, optionKey, -1)}>−</button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= 1) {
                        const updatedCart = { ...cart, [key]: val };
                        setCart(updatedCart);
                      }
                    }}
                    className="qty-input"
                  />
                  <button className="glow-btn" onClick={() => handleUpdate(category, optionKey, 1)}>+</button>
                </div>
              ) : (
                <button className="glow-btn" onClick={() => handleAdd(category, options, fixed)}>
                  Add to Cart
                </button>
              )}

              <button
                className="glow-btn"
                onClick={() => {
                  if (!fixed && !selected) {
                    alert("⚠️ Please select an item before buying.");
                    return;
                  }
                  alert(`Buying 1 ${optionKey} for ₹${price}`);
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {categoryCartItems.length > 0 && (
          <div className="cart-info">
            <p><strong>Items Added:</strong></p>
            <ul>
              {categoryCartItems.map(({ option, quantity, price }) => (
                <li key={option}>
                  {option} — {quantity} × ₹{price} = ₹{quantity * price}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="menu-container">
      <h1>Stadium Menu Bar</h1>

      <div className="cart-button-container">
        <Link to="/cart" className="go-to-cart-btn">
          🛒 Go to Cart ({Object.keys(cart).length})
        </Link>
      </div>

      {sectionGroups.map(({ title, categories }) => (
        <div key={title} className="menu-section">
          <h2 className="section-heading">{title}</h2>
          <div className="menu-grid">
            {allFoodItems
              .filter((item) => categories.includes(item.category))
              .map(renderCard)}
          </div>
        </div>
      ))}
    </div>
  );
}