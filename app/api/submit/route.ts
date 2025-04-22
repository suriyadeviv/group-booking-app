import { NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const DATA_DIR = join(process.cwd(), 'mock-data');
const FILE_PATH = join(DATA_DIR, 'submissions.json');

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR);
    }

    let submissions  = [];
    if (existsSync(FILE_PATH)) {
      const fileContent = await readFile(FILE_PATH, 'utf-8');
      submissions = JSON.parse(fileContent || '[]');
    }

    submissions.push({ ...data, submittedAt: new Date().toISOString() });

    await writeFile(FILE_PATH, JSON.stringify(submissions, null, 2), 'utf-8');

    return NextResponse.json({ message: 'Success', saved: true });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ message: 'Failed to save submission' }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!existsSync(FILE_PATH)) {
      return NextResponse.json([]);
    }

    const fileContent = await readFile(FILE_PATH, 'utf-8');
    const submissions = JSON.parse(fileContent || '[]');
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ message: 'Error reading submissions' }, { status: 500 });
  }
}
