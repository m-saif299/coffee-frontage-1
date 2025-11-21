import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");
// Find cafes by city
export const findCafesByCity = async (city) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
        });
        const prompt = `
      List 6 popular specialty coffee shops in ${city}. Return ONLY a JSON array.

      For each cafe, provide:
      - name
      - short attractive description in Arabic
      - location (format: "City - District - Street")
      - rating (3.5–5.0)
      - priceLevel ("Low" | "Medium" | "High")
      - isOpen (boolean)
      - amenities (array of strings)
      - coffeeTypes (array of strings)
      - features (array of strings)
      - menu (array of items: name, price, category, description)
      - reviews (array of 2 mock Arabic reviews)
    `;
        const result = await model.generateContent(prompt);
        const jsonText = result.response.text();
        const data = JSON.parse(jsonText);
        // Normalization + Inject mock IDs + images
        return data.map((item, i) => ({
            ...item,
            id: `cafe-${item.name.replace(/\s/g, "")}-${i}`,
            imageUrl: `https://picsum.photos/seed/${item.name.replace(/\s/g, "")}/800/600`,
            rating: typeof item.rating === "number" ? item.rating : 4.5,
            features: item.features || [],
            amenities: item.amenities || [],
            coffeeTypes: item.coffeeTypes || [],
            reviews: item.reviews || [],
            menu: (item.menu || []).map((m) => ({
                ...m,
                imageUrl: `https://picsum.photos/seed/${m.name.replace(/\s/g, "")}/200/200`
            })),
            googleRating: Math.min(5, (item.rating || 4) + (Math.random() * 0.4 - 0.2)),
            googleReviewsCount: Math.floor(Math.random() * 2000) + 50
        }));
    }
    catch (err) {
        console.error("Gemini error:", err);
        return [];
    }
};
// Generate cafe description
export const generateCafeDescription = async (name, location) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
        });
        const result = await model.generateContent(`Write a short, inviting Arabic description for a coffee shop named "${name}" in "${location}", under 20 words.`);
        return result.response.text() || "مقهى رائع يقدم أفضل أنواع القهوة.";
    }
    catch {
        return "مقهى مميز يستحق الزيارة.";
    }
};
