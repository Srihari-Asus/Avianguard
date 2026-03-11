import { UserProfile } from '../types';
const API_URL = 'http://localhost:5000/api/users';

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
        const response = await fetch(`${API_URL}/${uid}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

export async function createUserProfile(
    uid: string,
    data: {
        displayName: string;
        email: string;
        photoURL: string;
    }
): Promise<UserProfile> {
    const profile = {
        uid,
        displayName: data.displayName,
        email: data.email,
        photoURL: data.photoURL,
        createdAt: Date.now(),
        onboarded: false,
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profile),
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
    }
}

export async function updateUserProfile(
    uid: string,
    data: Partial<UserProfile>
): Promise<void> {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid, ...data }),
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}
