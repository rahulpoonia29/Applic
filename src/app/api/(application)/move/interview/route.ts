import { getSessionServer } from "@/auth";
import { prismaClient } from "@/lib/db";
import { NextResponse } from "next/server";

// PATCH /api/application/move/interview
// Move a job application to the interview scheduled status
export const PATCH = async (req: Request) => {
	try {
		const url = new URL(req.url);
		const applicationId = url.searchParams.get("applicationId");
		if (!applicationId || isNaN(Number(applicationId))) {
			return NextResponse.json(
				{ success: false, message: "Invalid application ID" },
				{ status: 400 },
			);
		}

		const session = await getSessionServer();
		if (!session) {
			return NextResponse.json(
				{
					success: false,
					message: "Unauthorized",
				},
				{ status: 401 },
			);
		}

		const application = await prismaClient.jobApplication.update({
			where: {
				id: parseInt(applicationId),
				userId: session.user.id,
			},
			data: {
				status: "interview",
			},
			select: {
				id: true,
			},
		});

		if (!application) {
			return NextResponse.json(
				{
					success: false,
					message: "Application not found",
				},
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{
				success: true,
				message: "Application moved to interview scheduled status",
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error(
			"Failed to move application to interview scheduled status:",
			error,
		);
		return NextResponse.json(
			{
				success: false,
				message:
					"Failed to move application to interview scheduled status",
			},
			{ status: 500 },
		);
	}
};
