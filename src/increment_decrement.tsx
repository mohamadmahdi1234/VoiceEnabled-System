import React, { useState } from "react";
import "./inc_dec_style.css";

const IncrementDecrementBtn = ({ minValue = 0, maxValue = 100 ,val = 0}) => {
  const [count, setCount] = useState(val);

  const handleIncrementCounter = () => {
    if (count < maxValue) {
      setCount((prevState) => prevState + 1);
    }
  };

  const handleDecrementCounter = () => {
    if (count > minValue) {
      setCount((prevState) => prevState - 1);
    }
  };

  return (
    <div className="btn-group">
      <button className="increment-btn" onClick={handleIncrementCounter}>
        <span className="material-symbols-outlined">add</span>
      </button>
      <p>{count}</p>
      <button className="decrement-btn" onClick={handleDecrementCounter}>
        <span className="material-symbols-outlined">remove</span>
      </button>
    </div>
  );
  };
export default IncrementDecrementBtn;