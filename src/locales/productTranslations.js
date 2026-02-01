export const productTranslations = {
    "Turmeric Powder": "മഞ്ഞൾ പൊടി",
    "Coriander Powder": "മല്ലി പൊടി",
    "Chilli Powder": "മുളക് പൊടി",
    "Kashmiri Chilli Powder": "കാശ്മീരി മുളക് പൊടി",
    "Wheat Powder": "ഗോതമ്പ് പൊടി",
    "Rice Puttu Powder": "അരി പുട്ട് പൊടി",
    "Rice Pathil Powder": "അരി പത്തിരി പൊടി",
    "Roasted Coriander Powder": "വറുത്ത മല്ലി പൊടി",
    "Coconut Oil": "വെളിച്ചെണ്ണ",
    // Add partial matches or keywords if exact match fails
    "Turmeric": "മഞ്ഞൾ",
    "Coriander": "മല്ലി",
    "Chilli": "മുളക്",
    "Kashmiri": "കാശ്മീരി മുളക് പൊടി",
    "Wheat": "ഗോതമ്പ്",
    "Putt": "പുട്ട്",
    "Pathil": "പത്തിരി",
    "Oil": "വെളിച്ചെണ്ണ"
};

export const getMalayalamName = (englishName) => {
    if (!englishName) return "";

    // Try exact match first
    if (productTranslations[englishName]) {
        return productTranslations[englishName];
    }

    // Try case-insensitive match
    const keys = Object.keys(productTranslations);
    const lowerName = englishName.toLowerCase();

    for (const key of keys) {
        if (key.toLowerCase() === lowerName) {
            return productTranslations[key];
        }
    }

    // Heuristic Matching (Optional: if you want "Awesome Turmeric" to allow "Turmeric")
    // This is a simple implementation, can be expanded.
    for (const key of keys) {
        if (lowerName.includes(key.toLowerCase())) {
            // This might return "Manjal" for "Turmeric Powder" if "Turmeric" is a key
            // Ideally we want specific matches first.
            return productTranslations[key];
        }
    }

    return null;
};
