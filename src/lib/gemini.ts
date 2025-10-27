export async function extractAppointmentDetailsFromTranscript(transcript: string) {
  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Extract patient name, doctor name, and appointment date and time from this sentence: "${transcript}". 
Return in this JSON format:
{
  "patientName": "John Doe",
  "doctorName": "Dr. Smith",
  "datetime": "2025-06-20T15:30:00Z"
}`
            }
          ]
        }
      ]
    })
  });

  const data = await res.json();

  const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

  return JSON.parse(textResponse);
}