import api from "@/services/api"
import type { AIQueryPayload, AIQueryResponse } from "@/types/ai"

export async function queryAI(payload: AIQueryPayload): Promise<AIQueryResponse> {
  const response = await api.post<AIQueryResponse>("/ai/query", payload)

  return response.data
}
