export function storeData(key: string, data: Object) {
  const namespacedKey = `gutendexlookup:${key}`;

  localStorage.setItem(namespacedKey, JSON.stringify(data));
}

export function retreiveData<T>(key: string): T | null {
  const namespacedKey = `gutendexlookup:${key}`;
  const storedData = localStorage.getItem(namespacedKey);

  return storedData ? (JSON.parse(storedData) as T) : null;
}

export default { storeData, retreiveData };
