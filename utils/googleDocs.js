import { google } from "googleapis";
import { CLIENT_EMAIL, PRIVATE_KEY, DOCUMENT_ID } from "./config.js";

const auth = new google.auth.JWT(CLIENT_EMAIL, null, PRIVATE_KEY, [
  "https://www.googleapis.com/auth/documents",
]);
const docs = google.docs({ version: "v1", auth });

export const writeToDoc = async (data, docId = DOCUMENT_ID) => {
  try {
    const textToInsert = data ? data.join(", ") : "";
    const requests = [
      {
        insertText: {
          text: `${textToInsert}\n`,
          location: { index: 1 },
        },
      },
    ];

    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: { requests },
    });
  } catch (error) {
    console.error("Error writing to Google Docs:", error);
  }
};
