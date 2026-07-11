import { TeamSection, TeamMember } from '@/types/content';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';

const PLACEHOLDER_PHOTO = '/team-placeholder.svg';

function BilingualBadge({ note }: { note: string }) {
  return (
    <span
      className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold"
      style={{
        backgroundColor: 'var(--color-accent)',
        color: 'var(--color-primary)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {note}
    </span>
  );
}

function MemberContact({ member }: { member: TeamMember }) {
  if (!member.phone && !member.email) return null;
  return (
    <div className="mt-4 flex flex-col gap-1 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
      {member.phone && (
        <a href={`tel:${member.phone}`} className="hover:opacity-70" style={{ color: 'var(--color-primary)' }}>
          {member.phone}
        </a>
      )}
      {member.email && (
        <a href={`mailto:${member.email}`} className="hover:opacity-70" style={{ color: 'var(--color-primary)' }}>
          {member.email}
        </a>
      )}
    </div>
  );
}

function TeamSingle({ data }: { data: TeamSection }) {
  const member = data.members?.[0];
  return (
    <section className="py-16 md:py-24 px-6" style={{ color: 'var(--color-text)' }}>
      <Reveal className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
          >
            {data.heading}
          </h2>
          <div className="mt-3 w-12 h-[3px] mx-auto" style={{ backgroundColor: 'var(--color-accent)' }} />
          {data.subheading && (
            <p className="mt-4 text-base sm:text-lg opacity-80" style={{ fontFamily: 'var(--font-body)' }}>
              {data.subheading}
            </p>
          )}
        </div>

        {member && (
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-12 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.photo || PLACEHOLDER_PHOTO}
              alt={member.name}
              className="w-full max-w-[280px] mx-auto aspect-square object-cover rounded-2xl"
            />
            <div>
              <h3
                className="text-2xl font-bold"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
              >
                {member.name}
              </h3>
              <p className="text-base opacity-70" style={{ fontFamily: 'var(--font-body)' }}>
                {member.title}
              </p>
              {member.bilingualNote && <BilingualBadge note={member.bilingualNote} />}
              <p className="mt-4 leading-relaxed opacity-85" style={{ fontFamily: 'var(--font-body)' }}>
                {member.bio}
              </p>
              <MemberContact member={member} />
            </div>
          </div>
        )}
      </Reveal>
    </section>
  );
}

function TeamGrid({ data }: { data: TeamSection }) {
  const members = data.members ?? [];
  const cols = members.length <= 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';
  return (
    <section className="py-16 md:py-24 px-6" style={{ color: 'var(--color-text)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
          >
            {data.heading}
          </h2>
          <div className="mt-3 w-12 h-[3px] mx-auto" style={{ backgroundColor: 'var(--color-accent)' }} />
          {data.subheading && (
            <p className="mt-4 text-base sm:text-lg opacity-80" style={{ fontFamily: 'var(--font-body)' }}>
              {data.subheading}
            </p>
          )}
        </div>

        <RevealGroup stagger={0.1} className={`grid grid-cols-1 ${cols} gap-8`}>
          {members.map((member, i) => (
            <RevealItem key={i} className="text-center">
              <div className="rounded-2xl p-6 h-full transition-transform duration-200 hover:-translate-y-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.photo || PLACEHOLDER_PHOTO}
                  alt={member.name}
                  className="w-32 h-32 mx-auto aspect-square object-cover rounded-full"
                />
                <h3
                  className="mt-4 text-xl font-bold"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
                >
                  {member.name}
                </h3>
                <p className="text-sm opacity-70" style={{ fontFamily: 'var(--font-body)' }}>
                  {member.title}
                </p>
                {member.bilingualNote && <BilingualBadge note={member.bilingualNote} />}
                <p className="mt-3 text-sm leading-relaxed opacity-80" style={{ fontFamily: 'var(--font-body)' }}>
                  {member.bio}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

export default function Team({ data }: { data: TeamSection }) {
  if (data.variant === 'team-grid') return <TeamGrid data={data} />;
  return <TeamSingle data={data} />;
}
