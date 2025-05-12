import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateAdmin } from "@/lib/auth";

// GET /api/creators - Get all creators
export async function GET() {
    try {
        const validation = await validateAdmin();
        if (validation.error) return validation.error;

        const creators = await db.creator.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(creators);
    } catch (error) {
        console.error("Error fetching creators:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST /api/creators - Create a new creator
export async function POST(req: Request) {
    try {
        const validation = await validateAdmin();
        if (validation.error) return validation.error;

        const body = await req.json();
        const { name, email } = body;

        if (!name || !email) {
            return NextResponse.json(
                { error: "Name and email are required" },
                { status: 400 }
            );
        }

        const creator = await db.creator.create({
            data: {
                name,
                email,
            },
        });

        return NextResponse.json(creator);
    } catch (error) {
        console.error("Error creating creator:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 