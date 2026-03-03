/* Recebe uma entrada do tipo:
[
{
    "question": "What is Decmatrix?",
    "answer": "Decmatrix is a platform..."
},
{...
]
*/

"use client";
import { motion, AnimatePresence } from "framer-motion";
import React from 'react';
import style from "./FAQ.module.css";

export default function FAQ({questions}) {
    const [activeCategory, setActiveCategory] = React.useState(null);
    
    function isActive(index) {
        return activeCategory === index;
    }

    function handleCategory(index) {
        setActiveCategory(index === activeCategory ? null : index);
    }
    
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": questions.map((qa) => ({
            "@type": "Question",
            "name": qa.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": qa.answer
            } 
        }))
    };

    return (
        <div className={style.faqContainer}>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <h2 className={style.faqTitle}>FAQ</h2>
            {questions.map((qa, index) => (
                <div key={index} className={style.faqItem}>
                    <h3 
                        className={style.question}
                        onClick={() => handleCategory(index)}
                    >
                        <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: isActive(index) ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ display: 'inline-block', marginRight: '8px' }}
                        >
                            ▶
                        </motion.div>
                        {qa.question}
                    </h3>
                    <AnimatePresence initial={false}>
                        {isActive(index) && (
                            <motion.div
                                key="answer"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                style={{ overflow: 'hidden' }}
                            >
                                <p className={style.answer}>{qa.answer}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}