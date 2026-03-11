const API_URL = 'http://localhost:5000/api';

export async function logDetection(data: {
    userId: string;
    class: string;
    score: number;
    imageUrl?: string;
    riskLevel?: 'Low' | 'Medium' | 'High';
    actionTaken?: string;
}) {
    try {
        const response = await fetch(`${API_URL}/detections`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        console.error('Error logging detection:', error);
        return null;
    }
}

export async function getDetectionLogs(userId: string) {
    try {
        const response = await fetch(`${API_URL}/detections/${userId}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching detection logs:', error);
        return [];
    }
}
