export interface MoodDataPoint {
    uuid: string;
    rating: number;
    note: string;
    timestamp: number;
}

export interface AmplenoteTask {
    uuid: string;
    noteUUID: string;
    content: string;
    createdAt: number;
    completedAt?: number;
    important: boolean;
    urgent: boolean;
    score: number;
    isRepeating: boolean;
    repeat: string | null;
}