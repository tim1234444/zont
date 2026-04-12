export interface AuthCheckResponse {
  ok: boolean;
}

export const checkSession = async (): Promise<boolean> => {
  try {
    const res = await fetch('/api/login.php?route=check', {
      credentials: 'include',
    });

    if (!res.ok) return false;

    const data: AuthCheckResponse = await res.json();
    return data.ok;
  } catch {
    return false;
  }
};

export const login = async (
  password: string
): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const response = await fetch('/api/login.php?route=login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (data.ok) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Неверный пароль',
      };
    }
  } catch {
    return {
      success: false,
      message: 'Ошибка сети',
    };
  }
};
