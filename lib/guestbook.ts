export interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  createdAt: string;
}

// 메모리에 방명록 데이터 저장 (실제 프로덕션에서는 데이터베이스 사용)
let guestbookEntries: GuestbookEntry[] = [];
let nextId = 1;

export function getAllEntries(): GuestbookEntry[] {
  return guestbookEntries.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addEntry(name: string, message: string): GuestbookEntry {
  const entry: GuestbookEntry = {
    id: nextId++,
    name: name.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };
  guestbookEntries.push(entry);
  return entry;
}

export function getEntryById(id: number): GuestbookEntry | undefined {
  return guestbookEntries.find((entry) => entry.id === id);
}

export function updateEntry(id: number, name: string, message: string): GuestbookEntry | null {
  const entry = guestbookEntries.find((e) => e.id === id);
  if (!entry) {
    return null;
  }
  entry.name = name.trim();
  entry.message = message.trim();
  return entry;
}

export function deleteEntry(id: number): boolean {
  const index = guestbookEntries.findIndex((e) => e.id === id);
  if (index === -1) {
    return false;
  }
  guestbookEntries.splice(index, 1);
  return true;
}

export function clearAllEntries(): boolean {
  guestbookEntries = [];
  nextId = 1;
  return true;
}

