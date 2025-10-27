import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { PromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"

const templateString = `You are a medical assistant generating a short and complete prescription based on the following appointment details.

Patient Case:

Symptoms: {symptoms}
Diagnosis: {diagnosis}
Instructions: {instructions}
Vitals:
- Blood Pressure: {bloodPressure}
- Heart Rate: {heartRate}
- Temperature: {temperature}
- Oxygen Saturation: {oxygenSaturation}

Provide a single concise paragraph that includes:
- The suggested medicine with dosage and frequency,
- Duration of medication,
- Lifestyle and dietary recommendations,
- Any additional remarks for recovery.

Write it clearly and professionally as a one-paragraph prescription, written in the first person as if by the physician. Avoid bullet points.`

export async function getPrescription(appointment: any): Promise<string> {
  try {
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.NEXT_GOOGLE_GEMINI_API_KEY!,
      temperature: 0.1,
      model: "gemini-2.5-flash",
    })

    const prompt = PromptTemplate.fromTemplate(templateString)
    appointment = appointment.appointment || appointment

    const chain = RunnableSequence.from([
      {
        symptoms: () => appointment.symptoms || "Not provided",
        diagnosis: () => appointment.diagnosis || "Not provided",
        instructions: () => appointment.instructions || "Not provided",
        bloodPressure: () => appointment.bloodPressure || "Not provided",
        heartRate: () => appointment.heartRate?.toString() || "Not provided",
        temperature: () =>
          appointment.temperature?.toString() || "Not provided",
        oxygenSaturation: () =>
          appointment.oxygenSaturation?.toString() || "Not provided",
      },
      prompt,
      model,
      async (response) => {
        return response.content
      },
    ])

    return await chain.invoke(appointment)
  } catch (error) {
    console.error("AI prescription error:", error)
    return "Prescription generation failed. Please try again later."
  }
}
