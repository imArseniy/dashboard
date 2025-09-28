// File: src/features/calendar/components/calendar-view-page.tsx
import { EventCalendar } from '@/components/event-calendar/event-calendar';
import { SearchParams } from 'nuqs';
import { searchParamsCache } from '@/lib/searchparams';
import { Suspense } from 'react';
import { Events } from '@/types/event';
import { parseISO } from 'date-fns';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import NewTaskDialog from '@/features/kanban/components/new-task-dialog';

const dummyEvents: Events[] = [
  {
    id: '1',
    title: 'Daily Team Standup',
    description: 'Daily sync to discuss progress and blockers.',
    startDate: new Date(),
    endDate: new Date(),
    startTime: '09:00',
    endTime: '09:30',
    isRepeating: true,
    repeatingType: 'daily',
    location: 'Virtual - Google Meet',
    category: 'Work',
    color: 'red',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Project Alpha Deadline',
    description: 'Final submission for Project Alpha.',
    startDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    startTime: '17:00',
    endTime: '17:30',
    isRepeating: false,
    repeatingType: null,
    location: 'Project Management Platform',
    category: 'Project',
    color: 'blue',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Weekly Review',
    description: 'Review of the past week and planning for the next.',
    startDate: new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay() + 5),
    ),
    endDate: new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay() + 5),
    ),
    startTime: '15:00',
    endTime: '16:00',
    isRepeating: true,
    repeatingType: 'weekly',
    location: 'Conference Room B',
    category: 'Work',
    color: 'yellow',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    title: 'Dentist Appointment',
    description: 'Annual check-up.',
    startDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    startTime: '11:00',
    endTime: '12:00',
    isRepeating: false,
    repeatingType: null,
    location: 'City Dental Clinic',
    category: 'Personal',
    color: 'purple',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface DemoPageProps {
  searchParams: SearchParams;
}

// normalize events: гарантируем Date в startDate/endDate
const normalizeEvent = (e: Events): Events => ({
  ...e,
  startDate:
    e.startDate instanceof Date
      ? e.startDate
      : typeof e.startDate === 'string'
      ? parseISO(e.startDate)
      : typeof e.startDate === 'number'
      ? new Date(e.startDate)
      : new Date(),
  endDate:
    e.endDate instanceof Date
      ? e.endDate
      : typeof e.endDate === 'string'
      ? parseISO(e.endDate)
      : typeof e.endDate === 'number'
      ? new Date(e.endDate)
      : new Date(),
});

export default async function CalendarViewPage({ searchParams }: DemoPageProps) {
  const search = searchParamsCache.parse(searchParams);

  const eventsResponse = {
    events: dummyEvents,
  };

  const safeEvents = eventsResponse.events.map(normalizeEvent);

  // безопасный initialDate
  const rawDate = (search as any)?.date;
  const initialDateSafe =
    rawDate instanceof Date
      ? rawDate
      : typeof rawDate === 'string'
      ? parseISO(rawDate)
      : typeof rawDate === 'number'
      ? new Date(rawDate)
      : new Date();

  return (
    <div className='min-w-full'>
      <div className="flex p-4 md:px-6 min-h-screen flex-col">
      <div className='flex items-start justify-between'>
        <Heading title={`Календарь`} description='Manage tasks by dnd' />
      </div>
        <main className="flex-1 py-6">
          <div className="container">
            <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
              <Suspense
                fallback={
                  <div className="flex h-[700px] items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
                      <p className="text-muted-foreground text-sm">Loading calendar...</p>
                    </div>
                  </div>
                }
              >
                <EventCalendar events={safeEvents} initialDate={initialDateSafe} />
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </div>

  );
}
