import axios from 'axios'

const apiKey = import.meta.env.OPENAI_API_KEY

export const fetchCompetitors = (companyName: string, number: number = 20) => {
  return axios.post("https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Create a json with a list of up to ${number} real competitors for ${companyName}. Each competitor found should have the following properties: companyName, industrySegment, and numCompetitors. companyName is the name of the company. industrySemgent is the industry sub-segment the competitor belongs to. numCompetitors is the number of competitors of that company.`
        }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    }
  )
}