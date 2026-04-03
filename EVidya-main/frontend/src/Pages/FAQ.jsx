import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/FAQ.css";

const faqData = {
  Students: {
    icon: "🎓",
    items: [
      {
        q: "What is EVidya and how does it help students?",
        a: "EVidya is a centralized learning platform that helps students discover courses, internships, projects, and build a strong academic and professional profile."
      },
      {
        q: "How do I apply for a scholarship or project?",
        a: "Simply sign up on Evidya, complete your profile, browse available scholarships or projects, and apply directly through the platform."
      },
      {
        q: "Can I collaborate with other students?",
        a: "Yes! EVidya enables peer collaboration on projects, hackathons, and research activities."
      },
      {
        q: "How do certificates and achievements work?",
        a: "Your completed courses, projects, and internships are added to your digital profile as verified achievements."
      },
      {
        q: "Is EVidya free for students?",
        a: "Yes, most student features are free. Some advanced programs may offer optional premium access."
      }
    ]
  },

  Faculty: {
    icon: "🧑‍🏫",
    items: [
      {
        q: "How can faculty onboard to EVidya?",
        a: "Faculty members can register by selecting the Faculty role and completing their professional profile."
      },
      {
        q: "Can faculty create and manage courses?",
        a: "Yes, faculty can create courses, upload content, assign tasks, and manage enrolled students."
      },
      {
        q: "How does student progress tracking work?",
        a: "EVidya provides analytics and dashboards to track student engagement, performance, and outcomes."
      },
      {
        q: "Can faculty mentor projects and internships?",
        a: "Absolutely. Faculty can mentor student projects, guide research, and evaluate internship progress."
      },
      {
        q: "Are assessment tools available?",
        a: "Yes, EVidya supports quizzes, assignments, grading, and structured feedback."
      }
    ]
  },

  Accounts: {
    icon: "👤",
    items: [
      {
        q: "How do I create or update my profile?",
        a: "You can update your profile anytime from the dashboard under Profile Settings."
      },
      {
        q: "Can I switch roles later?",
        a: "Yes, role switching is available depending on your permissions."
      },
      {
        q: "How do I reset my password?",
        a: "Use the 'Forgot Password' option on the sign-in page to reset your password securely."
      },
      {
        q: "Is my data secure on EVidya?",
        a: "Yes. EVidya uses secure authentication and data protection practices to keep your information safe."
      }
    ]
  }
};

export default function FAQ() {
  const [activeTab, setActiveTab] = useState("Students");
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(true);

  // ✅ FIX: Always start FAQ page from top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredFaqs = faqData[activeTab].items.filter(
    (item) =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`faq-page ${dark ? "dark" : "light"}`}>
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <button className="mode-btn" onClick={() => setDark(!dark)}>
          {dark ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>

      <br />
      <br />

      <div className="faq-container">
        {/* LEFT TABS */}
        <div className="faq-tabs">
          {Object.keys(faqData).map((tab) => (
            <button
              key={tab}
              className={`faq-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab);
                setOpenIndex(null);
              }}
            >
              <span>{faqData[tab].icon}</span> {tab}
            </button>
          ))}
        </div>

        {/* RIGHT CONTENT */}
        <div className="faq-content">
          <AnimatePresence>
            {filteredFaqs.map((item, index) => (
              <motion.div
                key={index}
                className="faq-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="faq-question"
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                >
                  <span>{item.q}</span>
                  <span className="icon">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </div>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      className="faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      {item.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredFaqs.length === 0 && (
            <div className="no-result">No matching questions found</div>
          )}
        </div>
      </div>
    </div>
  );
}
