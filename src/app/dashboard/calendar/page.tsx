import CalendarViewPage from "@/features/calendar/components/calendar-view-page";
import { SearchParams } from "nuqs";

export const metadata = {
  title: "Обзор : Календарь",
};

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return <CalendarViewPage searchParams={searchParams} />;
}