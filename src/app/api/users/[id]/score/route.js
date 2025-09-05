import { NextResponse } from 'next/server';
import connectDB from '../../../../../../utils/db';
import User from '../../../../../../utils/User';

// PUT /api/users/[id]/score - Update user score and response time
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await request.json();
    const { score, response_time, increment } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    let updateData = {};
    
    // Handle score update
    if (increment !== undefined) {
      // Increment score by the given amount
      updateData.$inc = { score: increment };
    } else if (score !== undefined) {
      // Set absolute score value
      updateData.score = score;
    }

    // Handle response time update
    if (response_time !== undefined) {
      updateData.response_time = response_time;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Score updated successfully'
    });

  } catch (error) {
    console.error('Error updating score:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update score' },
      { status: 500 }
    );
  }
}

// GET /api/users/[id]/score - Get user score
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await User.findById(id).select('username score response_time');
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        username: user.username,
        score: user.score,
        response_time: user.response_time
      }
    });

  } catch (error) {
    console.error('Error fetching score:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch score' },
      { status: 500 }
    );
  }
}
