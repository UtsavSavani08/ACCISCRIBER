import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const allLanguages = [
  'Dutch', 'Spanish', 'Korean', 'Italian', 'German', 'Thai', 'Russian', 'Portuguese', 'Polish',
  'Indonesian', 'Mandarin (TW)', 'Swedish', 'Czech', 'English', 'Japanese', 'French', 'Romanian',
  'Cantonese (CW)', 'Turkish', 'Mandarin (CN)', 'Catalan', 'Hungarian', 'Ukrainian', 'Greek',
  'Bulgarian', 'Arabic', 'Serbian', 'Macedonian', 'Cantonese (HK)', 'Latvian', 'Slovenian', 'Hindi',
  'Galician', 'Danish', 'Urdu', 'Slovak', 'Hebrew', 'Finnish', 'Azerbaijani', 'Lithuanian',
  'Estonian', 'Nynorsk', 'Welsh', 'Punjabi', 'Afrikaans', 'Persian', 'Basque', 'Vietnamese',
  'Bengali', 'Marathi', 'Belarusian', 'Kazakh', 'Armenian', 'Swahili', 'Tamil', 'Albanian',
  'Malay', 'Filipino', 'Bosnian', 'Maori', 'Nepali', 'Gujarati', 'Telugu', 'Kannada', 'Icelandic'
];

const LanguagesPage = () => {
  const navigate = useNavigate();

  const handleLanguageClick = (language) => {
    navigate('/language-details', { state: { language } });
  };

  return (
    <div className="min-h-screen w-screen mt-20 bg-gray-50 pt-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="w-full px-4 pb-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Supported Languages
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Our advanced AI models support a wide range of languages.
          </p>
        </motion.div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {allLanguages.map((language, index) => (
            <li
              key={language + index}
              onClick={() => handleLanguageClick(language)}
              className="cursor-pointer px-6 py-3 text-lg font-medium text-gray-800 hover:text-blue-700 hover:bg-blue-50 rounded transition text-center"
              tabIndex={0}
              role="button"
              onKeyPress={e => { if (e.key === 'Enter') handleLanguageClick(language); }}
            >
              {language}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default LanguagesPage;
