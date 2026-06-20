import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchProjectsData } from '../utils/api';
import { supabase } from '../utils/supabase';

// Mock the supabase client
vi.mock('../utils/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('fetchProjectsData (Phase 4 Supabase Integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully fetch projects from Supabase', async () => {
    const mockData = [
      { project_id: '1', category: 'INTERIOR', title_i18n: { en: 'Test' } }
    ];

    // Setup the mock chain: supabase.from().select()
    const selectMock = vi.fn().mockResolvedValue({ data: mockData, error: null });
    supabase.from.mockReturnValue({ select: selectMock });

    const result = await fetchProjectsData();

    expect(supabase.from).toHaveBeenCalledWith('projects');
    expect(selectMock).toHaveBeenCalledWith('*');
    expect(result).toEqual(mockData);
  });

  it('should return an empty array if data is null', async () => {
    const selectMock = vi.fn().mockResolvedValue({ data: null, error: null });
    supabase.from.mockReturnValue({ select: selectMock });

    const result = await fetchProjectsData();
    expect(result).toEqual([]);
  });

  it('should throw an error if Supabase request fails', async () => {
    const mockError = new Error('Database connection failed');
    const selectMock = vi.fn().mockResolvedValue({ data: null, error: mockError });
    supabase.from.mockReturnValue({ select: selectMock });

    await expect(fetchProjectsData()).rejects.toThrow('Database connection failed');
  });
});
