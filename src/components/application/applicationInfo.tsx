"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import daysToInterview from "@/lib/daysToInterview";
import { useModal } from "@/store/useModal";
import { JobApplication, JobStatus } from "@prisma/client";
import { isPast } from "date-fns";
import {
	Award,
	Briefcase,
	Building2,
	Calendar as CalendarIcon,
	CheckCircle,
	Clipboard,
	DollarSign,
	FileText,
	IndianRupee,
	LinkIcon,
	LucideIcon,
	Mail,
	MapPin,
} from "lucide-react";
import Link from "next/link";
import BadgeButton from "../badge";
import TailwindAdvancedEditor from "../editor/advanced-editor";
import { Badge } from "../ui/badge";

type Props = {
	application: JobApplication;
};

// Define a type for keys of the JobApplication object that we're interested in
type JobApplicationKeys = keyof Pick<
	JobApplication,
	| "role"
	| "company"
	| "salary"
	| "type"
	| "location"
	| "status"
	| "posting_link"
	| "interviewDate"
	| "interviewerEmail"
	| "notes"
>;

function ApplicationInfo({ application }: Props) {
	const { onOpen } = useModal();
	// const [value, setValue] = useState<JSONContent>(defaultEditorContent);

	const properties: {
		[key in JobApplicationKeys]: {
			label: string;
			icon: LucideIcon;
			condition: (value: any) => boolean;
			format: (value: any) => any;
		};
	} = {
		role: {
			label: "Role",
			icon: Briefcase,
			condition: (value: any) => !!application.role,
			format: (value: string) => value,
		},
		company: {
			label: "Company",
			icon: Building2,
			condition: (value: any) => !!application.company,
			format: (value: string) => value,
		},
		salary: {
			label: "Salary",
			icon: DollarSign,
			condition: (value: any) => !!application.salary,
			format: (value: number) => value.toLocaleString(),
		},
		type: {
			label: "Job Type",
			icon: Award,
			condition: (value: any) => !!application.type,
			format: (value: string) =>
				value.charAt(0).toUpperCase() + value.slice(1),
		},
		location: {
			label: "Location",
			icon: MapPin,
			condition: (value: any) => !!application.location,
			format: ({ city, country }: { city: string; country: string }) =>
				`${city}, ${country}`,
		},
		status: {
			label: "Status",
			icon: Clipboard,
			condition: (value: any) => !!application.status,
			format: (value: string) =>
				value.charAt(0).toUpperCase() + value.slice(1),
		},
		posting_link: {
			label: "Posting Link",
			icon: LinkIcon,
			condition: (value: any) => !!application.posting_link,
			// format: (value: string) => {
			// 	const regex = /^(?:https?:\/\/)?(?:www\.)?([^\/]+)(\/.*)?$/;
			// 	const [_, domain, path] = value.match(regex) || [];
			// 	const firstSegment = path
			// 		? path.split("/")[1] + "/" + path.split("/")[2]
			// 		: "";
			// 	const formattedPath = firstSegment
			// 		? `/${firstSegment}/...`
			// 		: "";
			// 	const formattedUrl = `${domain}${formattedPath}`;

			// 	return (
			// 		<Link
			// 			href={value}
			// 			target="_blank"
			// 			className="hover:underline"
			// 		>
			// 			{formattedUrl}
			// 		</Link>
			// 	);
			// },
			format: (value: string) => value,
		},
		interviewDate: {
			label: "Interview Date",
			icon: CalendarIcon,
			condition: (value: any) => !!application.interviewDate,
			format: (date: Date) => {
				if (
					application.status === JobStatus.bookmarked ||
					application.status === JobStatus.applied
				) {
					return <span>Interview not scheduled yet</span>;
				}

				if (!application.interviewDate) {
					return (
						<div className="flex flex-nowrap items-center space-x-4">
							<span className="line-clamp-1">
								No interview date provided
							</span>
							<BadgeButton
								text="Set Date"
								color="red"
								hoverColor="red"
								className="ml-4"
								onClick={() =>
									onOpen("set-interview-date", {
										applicationId: application.id,
									})
								}
							/>
						</div>
					);
				}

				return (
					<span className="flex items-center gap-2 capitalize">
						{daysToInterview(date)}
						{isPast(date) && (
							<CheckCircle className="size-4 text-green-500" />
						)}
					</span>
				);
			},
		},
		interviewerEmail: {
			label: "Interviewer Email",
			icon: Mail,
			condition: (value: any) => !!application.interviewerEmail,
			format: (value: string) => {
				if (
					application.status === JobStatus.bookmarked ||
					application.status === JobStatus.applied
				)
					return <span>Interview not scheduled yet</span>;

				if (
					!application.interviewerEmail ||
					application.interviewerEmail.length === 0
				) {
					return (
						<div className="flex flex-nowrap items-center space-x-4">
							<span className="line-clamp-1">
								No interviewer email provided
							</span>
							<BadgeButton
								text="Set Email"
								color="red"
								hoverColor="red"
								onClick={() =>
									onOpen("set-interview-email", {
										applicationId: application.id,
									})
								}
							/>
						</div>
					);
				}

				return (
					<Link
						href={`mailto:${application.interviewerEmail}`}
						className="hover:underline"
					>
						{application.interviewerEmail}
					</Link>
				);
			},
		},
		notes: {
			label: "Notes",
			icon: FileText,
			condition: (value: any) => !!application.notes,
			format: (value: string) => value,
		},
	};

	return (
		<div className="grid w-full grid-cols-1 items-center space-y-6 p-4">
			<Card className="border-t-4 border-t-blue-500">
				<CardHeader className="flex flex-col items-start justify-between space-y-2 pb-2 sm:flex-row sm:items-center sm:space-y-0">
					<div>
						<CardTitle className="text-2xl font-bold">
							{properties.company.condition(
								application.company,
							) && properties.company.format(application.company)}
						</CardTitle>
						<p className="text-sm text-muted-foreground">
							{properties.role.condition(application.role) &&
								properties.role.format(application.role)}
						</p>
					</div>
					<Badge
						variant="outline"
						className="bg-green-100 text-green-800 hover:bg-green-100"
					>
						{properties.status.condition(application.status) &&
							properties.status.format(application.status)}
					</Badge>
				</CardHeader>
				<CardContent>
					<div className="mt-4 flex flex-wrap justify-between gap-8 font-medium">
						<div className="flex items-center justify-start space-x-2">
							<MapPin className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm">
								{properties.location.condition(
									application.location,
								) &&
									properties.location.format({
										city: application.location,
										country: application.country,
									})}
							</span>
						</div>
						<div className="flex items-center space-x-2">
							<IndianRupee className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm">
								{properties.salary.condition(
									application.salary,
								) &&
									properties.salary.format(
										application.salary,
									) + " per year"}
							</span>
						</div>
						<div className="flex items-center space-x-2">
							<Award className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm">
								{properties.type.condition(application.type) &&
									properties.type.format(application.type)}
							</span>
						</div>
						<div className="flex items-center space-x-2">
							<LinkIcon className="h-4 w-4 text-muted-foreground" />
							<Link
								href={
									properties.posting_link.condition(
										application.posting_link,
									) &&
									properties.posting_link.format(
										application.posting_link,
									)
								}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center text-sm text-blue-600 hover:underline"
							>
								View Job Posting
							</Link>
						</div>
					</div>
					{/* <div className="flex items-center space-x-2">
									<Clock className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">
										{properties.status.condition(
											application.status,
										) &&
											properties.status.format(
												application.status,
											)}
									</span>
								</div> */}
				</CardContent>
			</Card>

			{/* Interview Details Section */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-xl font-semibold">
							Interview Details
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center space-x-2">
							<CalendarIcon className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm">
								{properties.interviewDate.format(
									application.interviewDate,
								)}
							</span>
						</div>

						<div className="flex items-center space-x-2">
							<Mail className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm">
								{properties.interviewerEmail.format(
									application.interviewerEmail,
								)}
							</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-xl font-semibold">
							Application Materials
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<FileText className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">Resume</span>
							</div>
							<span className="text-sm text-muted-foreground">
								Software_Engineer_v2.pdf
							</span>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<FileText className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">Cover Letter</span>
							</div>
							<span className="text-sm text-muted-foreground">
								Microsoft_CoverLetter.pdf
							</span>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<LinkIcon className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">Portfolio</span>
							</div>
							<Link
								href="https://rahulpoonia.co"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center text-sm text-blue-600 hover:underline"
							>
								rahulpoonia.co
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Notes Section */}
			{/* <Card>
				<CardHeader>
					<CardTitle className="text-strt text-2xl font-semibold">
						Notes
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4 text-start"> */}
			<div className="">
				<TailwindAdvancedEditor applicationId={application.id} />
			</div>
			{/* </CardContent>
			</Card>
			*/}
		</div>
	);
}

export default ApplicationInfo;
