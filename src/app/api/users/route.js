import { NextResponse } from 'next/server';
import connectDB from '../../../../utils/db';
import User from '../../../../utils/User';

// GET /api/users - Get all users or search users
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const sortBy = searchParams.get('sortBy') || 'score';
    const order = searchParams.get('order') || 'desc';
    const search = searchParams.get('search') || '';

    let query = {};
    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { fullname: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const users = await User.find(query)
      .sort({ [sortBy]: sortOrder })
      .limit(limit)
      .select('-__v');

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { username, fullname, score, response_time } = body;

    // Validate required fields
    if (!username || !fullname) {
      return NextResponse.json(
        { success: false, error: 'Username and fullname are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
   W

    const user = new User({
      username,
      fullname,
      score: score || 0,
      response_time: response_time || 0
    });

    await user.save();

    return NextResponse.json({
      success: true,
      data: user,
      message: 'User created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
