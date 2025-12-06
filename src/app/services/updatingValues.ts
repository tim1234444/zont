interface ChangeResponseSuccess {
  ok: true;
  message: string;
}

interface ChangeResponseError {
  ok: false;
  message: string;
}

type ChangeResponse = ChangeResponseSuccess | ChangeResponseError;

export async function updateThresholdValue(
  name: string,
  min: number,
  max: number
): Promise<ChangeResponse> {
  try {
    const res = await fetch('https://zont-gresk.ru/api/updatingValues.php?route=changeThresholdValue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, min, max }),
    });

    if (!res.ok) {
      const errJson = (await res.json()) as ChangeResponse;
      return errJson;
    }

    const data = (await res.json()) as ChangeResponse;
    return data;
  } catch (err: unknown) {
    let message = 'Неизвестная ошибка';

    if (err instanceof Error) {
      message = err.message;
    }

    return {
      ok: false,
      message,
    };
  }
}



export async function updateHeatingSeason(
  heating_start_date: string,
  heating_end_date: string
): Promise<ChangeResponse> {
  try {
    const res = await fetch(
      "https://zont-gresk.ru/api/updatingValues.php?route=updateHeatingSeason",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ heating_start_date, heating_end_date }),
      }
    );

    if (!res.ok) {
      const errJson = (await res.json()) as ChangeResponse;
      return errJson;
    }

    const data = (await res.json()) as ChangeResponse;
    return data;
  } catch (err: unknown) {
    let message = "Неизвестная ошибка";

    if (err instanceof Error) {
      message = err.message;
    }

    return {
      ok: false,
      message,
    };
  }
}
