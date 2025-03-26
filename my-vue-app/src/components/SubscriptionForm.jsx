import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import "../style/SubscriptionForm.css";

const SubscriptionForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валідація email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage("Будь ласка, введіть коректну адресу електронної пошти.");
      return;
    }

    try {
      // Відправка email до Firebase Firestore
      const docRef = await addDoc(collection(db, "subscribers"), {
        email,
        timestamp: new Date(),
      });
      setMessage("Дякуємо за підписку!");
      setEmail(""); // Очищення поля після підписки
    } catch (error) {
      setMessage("Помилка при підписці. Спробуйте ще раз.");
    }
  };

  return (
    <div className="subscription-form">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Введіть ваш email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Підписатися</button>
      </form>
      {message && <p className="subscription-message">{message}</p>}
    </div>
  );
};

export default SubscriptionForm;