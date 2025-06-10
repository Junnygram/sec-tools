// src/api/usernameChecker.ts

import axios from 'axios';

export type CheckResult = {
  platform: {
    name: string;
  };
  url: string;
  isAvailable: boolean | null;
  status: 'available' | 'unavailable' ; 
};

type RawResult = {
  platform: string;
  url: string;
  status: 'available' | 'unavailable' ;
  code: number;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const checkUsernameAvailability = async (username: string): Promise<CheckResult[]> => {
  try {
    const response = await axios.get<RawResult[]>(` ${apiUrl}/check?user=${username}`);

    return response.data.map((item) => ({
      platform: { name: item.platform },
      url: item.url,
      isAvailable:
        item.status === 'available' ? true :
        item.status === 'unavailable' ? false : null,
      status: item.status, 
    }));
  } catch (error) {
    console.error("Error fetching username availability:", error);
    throw new Error("Error checking username availability");
  }
};
