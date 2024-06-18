import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const configFilePath = path.resolve(process.cwd(), 'config.json');

export const GET = async (req: NextRequest) => {
  try {
    const data = await fs.readFile(configFilePath, 'utf-8');
    const config = JSON.parse(data);
    return NextResponse.json(config, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error reading configuration file' }, { status: 500 });
  }
};


export const PUT = async (req: NextRequest) => {
  try {
    const body = await req.json();
    await fs.writeFile(configFilePath, JSON.stringify(body, null, 2));
    return NextResponse.json(body, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error writing configuration file' }, { status: 500 });
  }
};
