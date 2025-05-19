import Api from "../../../../../interceptor";

export async function createAssistanceWorks(data) {
    try {
        const response = await Api.post('/AssistanceWork', data)

        return response
    } catch (error) {
        throw new Error(error)
    }
}