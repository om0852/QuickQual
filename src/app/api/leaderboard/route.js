import { NextResponse } from 'next/server';
import connectDB from '../../../../utils/db';
import User from '../../../../utils/User';

// GET /api/leaderboard - Get leaderboard
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const sortBy = searchParams.get('sortBy') || 'score'; // score, response_time, createdAt
    const order = searchParams.get('order') || 'desc';

    const sortOrder = order === 'desc' ? -1 : 1;
    
    const leaderboard = await User.find({})
      .sort({ [sortBy]: sortOrder })
      .limit(limit)
      .select('username fullname score response_time createdAt')
      .lean();

    // Add rank to each user
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    return NextResponse.json({
      success: true,
      data: rankedLeaderboard,
      count: rankedLeaderboard.length,
      sortBy,
      order
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
