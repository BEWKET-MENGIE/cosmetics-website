// app/admin/messages/page.tsx
import Link from 'next/link';
import { AdminHeading, EmptyState, StatusBadge } from '@/components/admin/AdminUi';
import { MessageActions } from '@/components/admin/MessageActions';
import { db } from '@/lib/db';
import { formatDate } from '@/lib/date';

const FILTERS = ['all', 'new', 'replied', 'closed'];

interface MessagesPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminMessagesPage({ searchParams }: MessagesPageProps) {
  const sp = await searchParams;
  const status = FILTERS.includes(sp.status ?? '') ? (sp.status as string) : 'all';

  const messages = await db.contactMessage.findMany({
    where: status === 'all' ? {} : { status },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return (
    <div>
      <AdminHeading title="Messages" description="Messages from the contact form." />

      <nav aria-label="Filter messages" className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((value) => (
          <Link
            key={value}
            href={value === 'all' ? '/admin/messages' : `/admin/messages?status=${value}`}
            aria-current={status === value ? 'true' : undefined}
            className={`rounded-full border px-4 py-2 text-xs font-bold capitalize transition-colors ${
              status === value
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-rose-300'
            }`}
          >
            {value}
          </Link>
        ))}
      </nav>

      {messages.length === 0 ? (
        <EmptyState>No messages here.</EmptyState>
      ) : (
        <ul className="space-y-3">
          {messages.map((message) => (
            <li key={message.id}>
              <details className="group rounded-2xl border border-slate-200 bg-white shadow-sm open:shadow-md" open={message.status === 'new' && messages.length <= 3}>
                <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 [&::-webkit-details-marker]:hidden">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{message.subject}</p>
                    <p className="text-xs text-slate-500">
                      {message.name} · {message.email} · {formatDate(message.createdAt.toISOString())}
                    </p>
                  </div>
                  <StatusBadge status={message.status} />
                </summary>
                <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                  <p className="mb-5 whitespace-pre-wrap text-sm leading-7 text-slate-700">{message.message}</p>
                  <MessageActions id={message.id} status={message.status} email={message.email} subject={message.subject} />
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}