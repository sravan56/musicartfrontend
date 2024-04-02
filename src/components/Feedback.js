import React, { useState } from "react";
import axios from "axios";
import style from "../styles/Feedback.module.css";

const Feedback = ({ isOpen, onClose }) => {
  const [feedbackType, setFeedbackType] = useState("");
  const [feedbackText, setFeedbackText] = useState("");

  const baseURL='https://musicartbackend-a7k3.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${baseURL}/api/feedback/takefeedback`, {
        type: feedbackType,
        feedback: feedbackText,
      });
      console.log("Feedback submitted successfully!");
      onClose();

      setFeedbackType("");
      setFeedbackText("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={style.feedbackModal}>
      <div className={style.feedbackModalContent}>
        <span className={style.closeButton} onClick={onClose}>
          &times;
        </span>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="feedbackType">Type of feedback</label>
            <select
              id="feedbackType"
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              required
              className={style.feedbackModalSelect}
            >
              <option value="" disabled hidden>Choose the type</option>
              <option value="bug">Bug</option>
              <option value="feedback">Feedback</option>
              <option value="query">Query</option>
            </select>
          </div>
          <div>
            <label htmlFor="feedbackText">Feedback</label>
            <textarea
              id="feedbackText"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              required
              className={style.feedbackModalTextarea}
              placeholder="Type your feedback"
            ></textarea>
          </div>
          <button type="submit" className={style.feedbackModalSubmitButton}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
