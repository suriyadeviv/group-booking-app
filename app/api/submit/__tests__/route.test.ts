import { POST, GET } from '../route';
import { NextResponse } from 'next/server';
import { writeFile, mkdir, readFile, unlink, rmdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

jest.mock('fs/promises');
jest.mock('fs');

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((data, init) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
    })),
  },
}));

const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockWriteFile = writeFile as jest.MockedFunction<typeof writeFile>;
const mockMkdir = mkdir as jest.MockedFunction<typeof mkdir>;
const mockReadFile = readFile as jest.MockedFunction<typeof readFile>;

const DATA_DIR = join(process.cwd(), 'mock-data');
const FILE_PATH = join(DATA_DIR, 'submissions.json');

describe('Submissions API', () => {
    const mockDate = new Date('2023-01-01T00:00:00.000Z');
  jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

  const mockSubmissionData = [{ name: 'Test User', email: 'test@example.com', submittedAt:  mockDate.toISOString() }];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should create directory if it does not exist', async () => {
      mockExistsSync.mockReturnValue(false);
      mockReadFile.mockRejectedValue(new Error('File not found'));

      const mockRequest = {
        json: () => Promise.resolve(mockSubmissionData),
      } as any;

      await POST(mockRequest);

      expect(mockExistsSync).toHaveBeenCalledWith(DATA_DIR);
      expect(mockMkdir).toHaveBeenCalledWith(DATA_DIR);
    });

    it('should create new file with submission when no file exists', async () => {
        mockExistsSync.mockImplementation((path) => {
            if (path === DATA_DIR) return true;
            return false;
          });
        
          const mockRequest = {
            json: () => Promise.resolve(mockSubmissionData),
          } as any;
        
          await POST(mockRequest);
        
          expect(mockWriteFile).toHaveBeenCalledWith(
            FILE_PATH, 
            JSON.stringify([{
              ...mockSubmissionData,
              submittedAt: mockDate.toISOString()
            }], null, 2),
            'utf-8'
          );
        
          expect(NextResponse.json).toHaveBeenCalledWith(
            { message: 'Success', saved: true }
          );
    });

    it('should return submissions from file', async () => {
        const mockSubmissions = [
          { 
            name: 'Test User', 
            email: 'test@example.com', 
            submittedAt: '2023-01-01T00:00:00.000Z' 
          },
          { 
            name: 'User 2', 
            email: 'user2@example.com', 
            submittedAt: '2023-01-02T00:00:00.000Z' 
          },
        ];
      
        mockExistsSync.mockReturnValue(true);
        mockReadFile.mockResolvedValue(JSON.stringify(mockSubmissions));
      
        const response = await GET();
        const result = await response.json();
      
        expect(result).toEqual(mockSubmissions);

        expect(result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: expect.any(String),
              email: expect.any(String),
              submittedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
            })
          ])
        );
      });

      it('should return 500 on error', async () => {
        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
      
        mockExistsSync.mockReturnValue(true);
        mockReadFile.mockRejectedValue(new Error('Read error'));
      
        const mockRequest = {
          json: () => Promise.resolve(mockSubmissionData),
        } as any;
      
        const response = await POST(mockRequest);
        const result = await response.json();
      
        expect(result).toEqual({ message: 'Failed to save submission' });
        expect(response.status).toBe(500);
      
        expect(consoleErrorMock).toHaveBeenCalledWith(
          'Submission error:',
          expect.any(Error)
        );
      
        consoleErrorMock.mockRestore();
      });
  });

  describe('GET', () => {
    it('should return empty array when no file exists', async () => {
      mockExistsSync.mockReturnValue(false);

      await GET();

      expect(NextResponse.json).toHaveBeenCalledWith([]);
    });

    it('should return submissions from file', async () => {
      mockExistsSync.mockReturnValue(true);
      const mockSubmissions = [
        { ...mockSubmissionData },
        { name: 'User 2', email: 'user2@example.com', submittedAt: '2023-01-01' },
      ];
      mockReadFile.mockResolvedValue(JSON.stringify(mockSubmissions));

      await GET();

      expect(NextResponse.json).toHaveBeenCalledWith(mockSubmissions);
    });

    it('should return empty array when file is empty', async () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue('');

      await GET();

      expect(NextResponse.json).toHaveBeenCalledWith([]);
    });
  });

  afterAll(async () => {
    try {
      if (existsSync(FILE_PATH)) {
        await unlink(FILE_PATH);
      }
      if (existsSync(DATA_DIR)) {
        await rmdir(DATA_DIR);
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  });
});