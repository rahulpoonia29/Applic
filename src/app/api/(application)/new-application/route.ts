import { getSessionServer } from "@/auth";
import { prismaClient } from "@/lib/db";
import { JobApplication } from "@/types/JobApplication";
import { NextResponse } from "next/server";

// POST /api/application/new-application
// Create new application route
export const POST = async (req: Request) => {
	try {
		const application: JobApplication = await req.json();
		if (!application) {
			return NextResponse.json(
				{ success: false, error: "Invalid application" },
				{ status: 400 }
			);
		}

		const session = await getSessionServer();
		if (!session) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const user = await prismaClient.user.findUnique({
			where: {
				email: session.user.email,
			},
			include: {
				applications: true, // This will include related JobApplication records
			},
		});
		if (!user) {
			return NextResponse.json(
				{ success: false, error: "User not found" },
				{ status: 404 }
			);
		}

		await prismaClient.jobApplication.create({
			data: {
				...application,
				id: undefined, // This will auto-generate a new ID
				userId: user.id, // Automatically associates the application with the user
			},
		});

		return NextResponse.json(
			{
				success: true,
				message: "Application created successfully",
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error in creating new application: ", error);
		return NextResponse.json(
			{ success: false, error: "Server error. Please try again later." },
			{ status: 500 }
		);
	}
};
