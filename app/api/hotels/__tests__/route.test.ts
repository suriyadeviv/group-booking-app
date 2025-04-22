import { Room } from '@/types/room';
import { GET } from '../route';
import { NextResponse } from 'next/server';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((data) => ({
      json: () => Promise.resolve(data),
      status: 200,
    })),
  },
}));

jest.mock('@/mock-data/hotels.json', () => [
  {
    id: 1,
    name: 'Test Hotel',
    location: 'Test City'
  },
  {
    id: 2,
    name: 'Another Hotel',
    location: 'Another City'
  }
], { virtual: true });

describe('Hotels API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the hotels data', async () => {
    const response = await GET();
    const result = await response.json();

    expect(result).toEqual([
      {
        id: 1,
        name: 'Test Hotel',
        location: 'Test City',
      },
      {
        id: 2,
        name: 'Another Hotel',
        location: 'Another City'
      }
    ]);

    expect(NextResponse.json).toHaveBeenCalledWith(expect.any(Array));
  });

  it('should return the correct number of hotels', async () => {
    const response = await GET();
    const result = await response.json();
    expect(result.length).toBe(2);
  });

  it('should return hotels with required properties', async () => {
    const response = await GET();
    const result = await response.json();
    
    result.forEach((hotel: Room) => {
      expect(hotel).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          location: expect.any(String)
        })
      );
    });
  });
});