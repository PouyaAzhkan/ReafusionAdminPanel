import Api from "../../../../../interceptor";

export async function updateAssistanceWorks(data) {
    try {
        const response = await Api.put('/AssistanceWork', data)

        return response
    } catch (error) {
        throw new Error(error)
    }
}