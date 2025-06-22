import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CartPage.css";

import waterImg from "../assets/food/water.png";
import dessertsImg from "../assets/food/desserts.jpg";
import rollsImg from "../assets/food/rolls.jpg";
import drinksImg from "../assets/food/drinks.jpg";
import indianImg from "../assets/food/indian.jpeg";
import miniImg from "../assets/food/mini.png";
import comboImg from "../assets/food/combo.jpg";
import merchImg from "../assets/food/merch.png";
import stationaryImg from "../assets/food/stationary.png";

const foodItems = [
  {
    category: "Water bottles",
    image: waterImg,
    options: { "1 litre": 20, "2 litres": 35, "5 litres": 70 },
  },
  {
    category: "Desserts",
    image: dessertsImg,
    options: {
      "Cupcakes with team logos": 50,
      "Brownie-in-a-cup": 60,
    },
  },
  {
    category: "Rolls",
    image: rollsImg,
    options: { Chicken: 90, Paneer: 80 },
  },
  {
    category: "Drinks",
    image: drinksImg,
    options: {
      "Mojito/Blue Lagoon Mocktails": 100,
      "Iced Coffee Shake": 90,
    },
  },
  {
    category: "Indian Bites",
    image: indianImg,
    options: {
      "Pav Bhaji with Toasted Pav": 85,
      "Biryani in a Box (no curry, just mildly spiced)": 120,
    },
  },
  {
    category: "Mini Versions",
    image: miniImg,
    options: {
      "Personal Pizzas (6-inch)": 110,
      "Mini Burgers": 75,
    },
  },
  {
    category: "Combo Boxes",
    image: comboImg,
    options: {
      "Burger + Fries + Soft Drink": 180,
      "Chicken Popcorn + Garlic Mayo Dip + Cola": 160,
      "Paneer Kathi Roll + Masala Fries + Nimbu Soda": 170,
      "Cheese Sandwich + Nachos + Lemon Iced Tea": 150,
    },
  },
  {
    category: "Merchandise",
    image: merchImg,
    options: { Standard: 400 },
  },
  {
    category: "Stationary Items",
    image: stationaryImg,
    options: { Standard: 300 },
  },
];

export default function CartPage() {
  const [cart, setCart] = useState({});

  useEffect(() => {
    const storedCart = localStorage.getItem("ipl-cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const groupedItems = {};

  Object.entries(cart).forEach(([key, quantity]) => {
    const [category, option] = key.split("__");
    const item = foodItems.find((f) => f.category === category);
    const price = item?.options?.[option] || 0;

    if (!groupedItems[category]) {
      groupedItems[category] = {
        options: [],
        image: item?.image,
      };
    }

    groupedItems[category].options.push({
      option,
      quantity,
      price,
    });
  });

  const total = Object.values(groupedItems).reduce((sum, group) => {
    return (
      sum +
      group.options.reduce(
        (catSum, { quantity, price }) => catSum + quantity * price,
        0
      )
    );
  }, 0);

  const handlePayNow = () => {
    if (total === 0) {
      alert("Your cart is empty!");
      return;
    }
    alert(`✅ Payment of ₹${total} successful! Thank you for your order.`);
    localStorage.removeItem("ipl-cart");
    setCart({});
  };

  return (
    <div className="cart-page">
      <h1>🛒 Your Stadium Cart</h1>

      {Object.keys(groupedItems).length === 0 ? (
        <div className="empty-cart-msg">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty Cart"
            className="empty-cart-img"
          />
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven’t added anything yet.</p>
          <Link to="/services" className="go-menu-btn">🍔 Browse Menu</Link>
        </div>
      ) : (
        <div className="cart-list">
          {Object.entries(groupedItems).map(([category, { options }]) => (
            <div key={category} className="cart-item">
              <div className="cart-item-info">
                <h3>{category}</h3>
                <ul className="cart-option-list">
                  {options.map(({ option, quantity, price }) => (
                    <li key={option} className="cart-line">
                      <div className="item-line">
                        <div className="item-name">
                          <strong>{option}</strong>
                        </div>
                        <div className="item-controls">
                          <span className="price-each">₹{price} ×</span>
                          <div className="qty-box">
                            <button
                              className="glow-btn"
                              onClick={() => {
                                const key = `${category}__${option}`;
                                const updatedCart = { ...cart };
                                if (updatedCart[key] === 1) {
                                  delete updatedCart[key];
                                } else {
                                  updatedCart[key] -= 1;
                                }
                                setCart(updatedCart);
                                localStorage.setItem("ipl-cart", JSON.stringify(updatedCart));
                              }}
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={cart[`${category}__${option}`]}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                const key = `${category}__${option}`;
                                if (!isNaN(val) && val >= 1) {
                                  const updatedCart = { ...cart, [key]: val };
                                  setCart(updatedCart);
                                  localStorage.setItem("ipl-cart", JSON.stringify(updatedCart));
                                }
                              }}
                              className="qty-input"
                            />
                            <button
                              className="glow-btn"
                              onClick={() => {
                                const key = `${category}__${option}`;
                                const newQty = cart[key] + 1;
                                const updatedCart = { ...cart, [key]: newQty };
                                setCart(updatedCart);
                                localStorage.setItem("ipl-cart", JSON.stringify(updatedCart));
                              }}
                            >
                              +
                            </button>
                          </div>
                          <span className="total-price">= ₹{quantity * price}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          <div className="cart-total">
            <strong>Total:</strong> ₹{total}
          </div>

          <div className="cart-buttons">
            <button
              onClick={() => {
                localStorage.removeItem("ipl-cart");
                setCart({});
              }}
              className="clear-cart-btn"
            >
              🧹 Clear Cart
            </button>

            <button
              onClick={handlePayNow}
              className="pay-now-btn"
            >
              💳 Pay Now
            </button>
          </div>
        </div>
      )}

      <Link to="/menu" className="back-link">← Back to Menu</Link>
    </div>
  );
}