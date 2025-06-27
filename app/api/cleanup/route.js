import { NextResponse } from 'next/server';
import { deleteOldConversations } from '@/lib/db';

export async function GET() {
  try {
    await deleteOldConversations();
    return NextResponse.json({ message: 'Old conversations deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting old conversations:', error);
    return NextResponse.json({ error: 'Failed to delete old conversations' }, { status: 500 });
  }
}