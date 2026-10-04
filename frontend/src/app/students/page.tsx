import { redirect } from "next/navigation";

interface StudentsPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function StudentsRedirectPage({ searchParams }: StudentsPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const query = new URLSearchParams();

  Object.entries(resolvedParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => query.append(key, v));
    } else if (typeof value === "string") {
      query.append(key, value);
    }
  });

  const queryString = query.toString();
  redirect(queryString ? `/student?${queryString}` : "/student");
}
