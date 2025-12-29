import { supabase } from './supabase';

export interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  createdAt: string;
}

// Supabase 데이터베이스 응답 타입
interface DBGuestbookEntry {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

// DB 형식을 앱 형식으로 변환
function mapDBEntryToEntry(dbEntry: DBGuestbookEntry): GuestbookEntry {
  return {
    id: dbEntry.id,
    name: dbEntry.name,
    message: dbEntry.message,
    createdAt: dbEntry.created_at,
  };
}

export async function getAllEntries(): Promise<GuestbookEntry[]> {
  try {
    const { data, error } = await supabase
      .from('guestbook_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('방명록 조회 오류:', error);
      throw error;
    }

    return (data || []).map(mapDBEntryToEntry);
  } catch (error) {
    console.error('getAllEntries 오류:', error);
    return [];
  }
}

export async function addEntry(name: string, message: string): Promise<GuestbookEntry> {
  try {
    const { data, error } = await supabase
      .from('guestbook_entries')
      .insert([
        {
          name: name.trim(),
          message: message.trim(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('방명록 작성 오류:', error);
      throw error;
    }

    return mapDBEntryToEntry(data);
  } catch (error) {
    console.error('addEntry 오류:', error);
    throw error;
  }
}

export async function getEntryById(id: number): Promise<GuestbookEntry | null> {
  try {
    const { data, error } = await supabase
      .from('guestbook_entries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('방명록 조회 오류:', error);
      return null;
    }

    return data ? mapDBEntryToEntry(data) : null;
  } catch (error) {
    console.error('getEntryById 오류:', error);
    return null;
  }
}

export async function updateEntry(
  id: number,
  name: string,
  message: string
): Promise<GuestbookEntry | null> {
  try {
    const { data, error } = await supabase
      .from('guestbook_entries')
      .update({
        name: name.trim(),
        message: message.trim(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('방명록 수정 오류:', error);
      return null;
    }

    return data ? mapDBEntryToEntry(data) : null;
  } catch (error) {
    console.error('updateEntry 오류:', error);
    return null;
  }
}

export async function deleteEntry(id: number): Promise<boolean> {
  try {
    const { error } = await supabase.from('guestbook_entries').delete().eq('id', id);

    if (error) {
      console.error('방명록 삭제 오류:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('deleteEntry 오류:', error);
    return false;
  }
}

export async function clearAllEntries(): Promise<boolean> {
  try {
    const { error } = await supabase.from('guestbook_entries').delete().neq('id', 0);

    if (error) {
      console.error('방명록 전체 삭제 오류:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('clearAllEntries 오류:', error);
    return false;
  }
}
