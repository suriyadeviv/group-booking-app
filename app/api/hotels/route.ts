import { NextResponse } from 'next/server';
import hotels from '@/mock-data/hotels.json';

export async function GET() {
  return NextResponse.json(hotels);
}
