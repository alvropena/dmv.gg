import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { birthday, gender, ethnicity, language } = await request.json();

        if (!birthday || !gender || !ethnicity || !language) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Update the user's profile data
        await db.user.updateMany({
            where: {
                clerkId: userId,
            },
            data: {
                birthday: new Date(birthday),
                gender,
                ethnicity,
                language,
                updatedAt: new Date(),
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating user profile:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { birthday, gender, ethnicity, language } = await request.json();

        // Build update data object with only provided fields
        const updateData: {
            updatedAt: Date;
            birthday?: Date;
            gender?: string;
            ethnicity?: string;
            language?: string;
        } = {
            updatedAt: new Date(),
        };

        if (birthday) updateData.birthday = new Date(birthday);
        if (gender) updateData.gender = gender;
        if (ethnicity) updateData.ethnicity = ethnicity;
        if (language) updateData.language = language;

        // Update the user's profile data
        await db.user.updateMany({
            where: {
                clerkId: userId,
            },
            data: updateData,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating user profile:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
} 