
import React, { useState } from 'react';

const faqData = [
  {
    question: 'What is the difference between an Acknowledgment and a Jurat?',
    answer: 'An Acknowledgment is a notarial act where a signer personally appears before the notary, is identified, and declares that they have willingly signed the document. A Jurat is where a signer personally appears before the notary, is identified, and signs the document in the notary\'s presence, swearing or affirming that the statements in the document are true.'
  },
  {
    question: 'Can I notarize a document for a family member?',
    answer: 'This depends on your state\'s laws. Many states prohibit notarizing for immediate family members (spouse, parents, children) to avoid conflicts of interest. It is best practice to decline notarizing for family members even if not explicitly prohibited.'
  },
  {
    question: 'What should I do if the signer\'s ID is expired?',
    answer: 'Most states require the identification to be current and unexpired. Some states make exceptions for recently expired IDs (e.g., within the last 5 years for a California driver\'s license). Always check your state\'s specific laws. If the ID is unacceptable, you cannot proceed with the notarization until the signer provides valid identification.'
  },
  {
    question: 'Can I refuse to perform a notarization?',
    answer: 'Yes, a Notary Public can and should refuse to notarize if they are not satisfied with the signer\'s identity, if the signer appears to be under duress or not mentally competent, or if the notary has a prohibitive conflict of interest or suspects fraud.'
  },
  {
    question: 'What information must be in my journal entry?',
    answer: 'Journal entry requirements vary by state, but typically include: the date and time of the notarization, the type of notarial act, a description of the document, the signer\'s name and signature, how the signer was identified (including ID details), and any fees charged. '
  }
];

const FaqItem: React.FC<{ question: string; answer: string; isOpen: boolean; onClick: () => void; }> = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border-b border-slate-200 dark:border-slate-700">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center text-left py-4 px-2"
            >
                <span className="font-semibold text-slate-800 dark:text-slate-200">{question}</span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                    <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <p className="p-4 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-b-lg">{answer}</p>
            </div>
        </div>
    )
};


const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Notary FAQ</h2>
      <div className="space-y-2">
        {faqData.map((item, index) => (
          <FaqItem 
            key={index} 
            question={item.question} 
            answer={item.answer} 
            isOpen={openIndex === index}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Faq;
