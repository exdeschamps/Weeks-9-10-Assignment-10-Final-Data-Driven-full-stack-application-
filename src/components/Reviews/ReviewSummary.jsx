import { GoogleGenerativeAI } from "@google/generative-ai";
import { getReviewsByAlbumId } from "@/src/lib/firebase/albumFirestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp";
import { getFirestore } from "firebase/firestore";

async function generateReviewSummary(reviews) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const reviewText = reviews
      .map(
        (review) => `Rating: ${review.rating}/5\nReview: ${review.text}`
      )
      .join("\n\n");

    const prompt = `
      Analyze these album reviews and provide a concise summary:
      ${reviewText}
      
      Please provide a summary that includes:
      1. Overall sentiment
      2. Common themes in positive reviews
      3. Common themes in negative reviews (if any)
      4. Notable specific comments
      Keep the summary concise and focused on the most important points.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return summary;
  } catch (error) {
    console.error('Error generating review summary:', error);
    return "Unable to generate review summary at this time.";
  }
}

export async function GeminiSummary({ albumId }) {
  try {
    const { firebaseServerApp } = await getAuthenticatedAppForUser();
    const reviews = await getReviewsByAlbumId(
      getFirestore(firebaseServerApp),
      albumId
    );

    if (reviews.length === 0) {
      return (
        <div className="album__review_summary">
          <p>No reviews available yet. Be the first to review this album!</p>
        </div>
      );
    }

    const summary = await generateReviewSummary(reviews);

    return (
      <div className="album__review_summary">
        <h3>AI-Generated Review Summary</h3>
        <p>{summary}</p>
      </div>
    );
  } catch (error) {
    console.error('Error in GeminiSummary:', error);
    return (
      <div className="album__review_summary">
        <p>Unable to load review summary at this time.</p>
      </div>
    );
  }
}

export function GeminiSummarySkeleton() {
  return (
    <div className="album__review_summary">
      <h3>AI-Generated Review Summary</h3>
      <p>✨ Analyzing album reviews with AI...</p>
      <div className="loading-animation">
        <div className="pulse"></div>
      </div>
    </div>
  );
}
