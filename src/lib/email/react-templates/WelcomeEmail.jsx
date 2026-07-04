import React from 'react';
import { 
  Html, Head, Preview, Body, Container, Section, Text, Heading, Button, Tailwind, Hr, Link, Row, Column 
} from '@react-email/components';

export default function WelcomeEmail({ firstName, referralLink, unsubscribeUrl, waitlistPosition, totalSignups }) {
  const bgDark = '#0A0A0A';
  const bgElevated = '#111111';
  const emeraldDeep = '#15803D';
  const emeraldSoft = '#4ADE80';
  const mintLight = '#DCFCE7';
  const textPrimary = '#FFFFFF';
  const textSecondary = '#A3A3A3';

  const positionDisplay = waitlistPosition ? `#${waitlistPosition.toLocaleString()}` : '#—';
  const totalDisplay = totalSignups ? totalSignups.toLocaleString() : '—';
  const progressPct = Math.min(100, ((totalSignups - waitlistPosition) / Math.max(totalSignups, 1)) * 100 + 15);

  return (
    <Html>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        `}</style>
      </Head>
      <Preview>You are {positionDisplay} on the Universe waitlist. Welcome, {firstName || 'early member'}.</Preview>

      <Tailwind>
        <Body style={{ backgroundColor: bgDark, margin: 'auto', fontFamily: 'Inter, sans-serif' }}>
          <Container style={{ maxWidth: '600px', margin: '40px auto', backgroundColor: bgDark }}>

            {/* ── HEADER ────────────────────────────────────────────── */}
            <Section style={{ padding: '0 24px', marginBottom: '32px' }}>
              <Row>
                <Column style={{ width: '50%' }}>
                  <Text style={{ margin: 0, color: textPrimary, fontSize: '22px', fontWeight: '900', letterSpacing: '2px' }}>
                    UNIVERSE
                  </Text>
                </Column>
                <Column style={{ width: '50%', textAlign: 'right' }}>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(74, 222, 128, 0.08)',
                    color: emeraldSoft,
                    border: '1px solid rgba(74, 222, 128, 0.25)',
                    borderRadius: '100px',
                    padding: '5px 14px',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '0.8px',
                  }}>
                    EARLY ACCESS MEMBER
                  </span>
                </Column>
              </Row>
            </Section>

            {/* ── HERO ──────────────────────────────────────────────── */}
            <Section style={{
              padding: '48px 32px',
              marginBottom: '20px',
              backgroundColor: '#08120D',
              borderRadius: '16px',
              border: '1px solid rgba(21, 128, 61, 0.2)',
              backgroundImage: 'radial-gradient(ellipse at top left, rgba(21, 128, 61, 0.2), transparent 55%)'
            }}>
              <Text style={{ margin: '0 0 16px 0', color: emeraldSoft, fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Waitlist Confirmed
              </Text>
              <Heading style={{ color: textPrimary, fontSize: '44px', fontWeight: '900', lineHeight: '1.1', margin: '0 0 20px 0', letterSpacing: '-1.5px' }}>
                You're In,{firstName ? ` ${firstName}` : ''}.
              </Heading>
              <Text style={{ color: textSecondary, fontSize: '17px', lineHeight: '1.65', margin: '0 0 36px 0' }}>
                Your spot on the Universe waitlist is officially reserved. You are now part of an exclusive group of early insiders helping us build the future of student commerce and campus life.
              </Text>
              <Button
                href={referralLink || '#'}
                style={{
                  backgroundColor: emeraldSoft,
                  color: bgDark,
                  fontWeight: '800',
                  fontSize: '15px',
                  padding: '15px 32px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  display: 'inline-block',
                  letterSpacing: '0.2px'
                }}
              >
                View Your Waitlist Status
              </Button>
            </Section>

            {/* ── WAITLIST POSITION ─────────────────────────────────── */}
            <Section style={{
              padding: '36px 32px',
              marginBottom: '20px',
              backgroundColor: bgElevated,
              borderRadius: '16px',
              border: '1px solid rgba(74, 222, 128, 0.15)',
              textAlign: 'center',
            }}>
              <Text style={{ margin: '0 0 8px 0', color: textSecondary, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Your Waitlist Position
              </Text>
              <Text style={{ margin: '0 0 4px 0', color: emeraldSoft, fontSize: '64px', fontWeight: '900', lineHeight: '1', letterSpacing: '-2px' }}>
                {positionDisplay}
              </Text>
              <Text style={{ margin: '0 0 20px 0', color: textSecondary, fontSize: '14px', lineHeight: '1.5' }}>
                out of <strong style={{ color: textPrimary }}>{totalDisplay}</strong> early members
              </Text>
              {/* Progress bar */}
              <div style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '100px', height: '6px', margin: '0 0 20px 0' }}>
                <div style={{
                  width: `${progressPct}%`,
                  backgroundColor: emeraldSoft,
                  borderRadius: '100px',
                  height: '6px'
                }} />
              </div>
              <Text style={{ margin: 0, color: textSecondary, fontSize: '14px', lineHeight: '1.5' }}>
                Refer friends to move up the list and unlock priority beta access.
              </Text>
            </Section>

            {/* ── REFERRAL URGENCY ──────────────────────────────────── */}
            <Section style={{
              padding: '40px 32px',
              marginBottom: '20px',
              background: 'linear-gradient(135deg, #0D2818 0%, #08120D 100%)',
              borderRadius: '16px',
              border: `1px solid ${emeraldDeep}44`,
              textAlign: 'center',
            }}>
              <Text style={{ margin: '0 0 6px 0', color: emeraldSoft, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Move Up the List
              </Text>
              <Heading style={{ color: textPrimary, fontSize: '26px', fontWeight: '800', margin: '0 0 14px 0', letterSpacing: '-0.5px' }}>
                Jump the Queue
              </Heading>
              <Text style={{ color: textSecondary, fontSize: '15px', lineHeight: '1.65', margin: '0 0 8px 0' }}>
                Every friend you invite earns you a higher position. The more people you bring in, the sooner you unlock beta access — and the more you help shape what Universe becomes.
              </Text>
              <Text style={{ color: emeraldSoft, fontSize: '13px', fontWeight: '700', margin: '0 0 28px 0' }}>
                Each referral that joins moves you up the list.
              </Text>
              <Button
                href={referralLink || '#'}
                style={{
                  backgroundColor: emeraldDeep,
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: '15px',
                  padding: '15px 32px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  display: 'inline-block',
                  marginBottom: '20px'
                }}
              >
                Invite Friends Now
              </Button>
              <Text style={{ color: '#555', fontSize: '12px', margin: 0, wordBreak: 'break-all' }}>
                Your link:{' '}
                <Link href={referralLink || '#'} style={{ color: emeraldSoft, textDecoration: 'none', fontWeight: '600' }}>
                  {referralLink || 'Generating...'}
                </Link>
              </Text>
            </Section>

            {/* ── SOCIAL PROOF ──────────────────────────────────────── */}
            <Section style={{ padding: '0 24px', marginBottom: '20px' }}>
              <Row style={{
                borderRadius: '12px',
                backgroundColor: bgElevated,
                padding: '28px 0',
                border: '1px solid rgba(74, 222, 128, 0.1)',
              }}>
                <Column style={{ textAlign: 'center', width: '33%', padding: '0 8px' }}>
                  <Text style={{ margin: '0 0 4px 0', color: emeraldSoft, fontSize: '28px', fontWeight: '900', letterSpacing: '-1px' }}>
                    {totalDisplay}
                  </Text>
                  <Text style={{ margin: 0, color: textSecondary, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '600' }}>
                    Early Members
                  </Text>
                </Column>
                <Column style={{ textAlign: 'center', width: '33%', padding: '0 8px', borderLeft: '1px solid rgba(255,255,255,0.06)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                  <Text style={{ margin: '0 0 4px 0', color: emeraldSoft, fontSize: '28px', fontWeight: '900', letterSpacing: '-1px' }}>
                    50+
                  </Text>
                  <Text style={{ margin: 0, color: textSecondary, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '600' }}>
                    Universities
                  </Text>
                </Column>
                <Column style={{ textAlign: 'center', width: '33%', padding: '0 8px' }}>
                  <Text style={{ margin: '0 0 4px 0', color: emeraldSoft, fontSize: '28px', fontWeight: '900', letterSpacing: '-1px' }}>
                    100%
                  </Text>
                  <Text style={{ margin: 0, color: textSecondary, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '600' }}>
                    Student-Verified
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* ── ABOUT ─────────────────────────────────────────────── */}
            <Section style={{ padding: '36px 32px', marginBottom: '8px', backgroundColor: bgElevated, borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Text style={{ color: emeraldSoft, fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
                What We Are Building
              </Text>
              <Heading style={{ color: textPrimary, fontSize: '22px', fontWeight: '800', margin: '0 0 16px 0', letterSpacing: '-0.5px' }}>
                More than a marketplace.
              </Heading>
              <Text style={{ color: textSecondary, fontSize: '15px', lineHeight: '1.7', margin: '0' }}>
                Universe is a comprehensive student ecosystem. One platform where you can safely buy and sell, discover campus events, find internships, promote your student business, and connect with your entire campus community.
              </Text>
            </Section>

            {/* ── FEATURE CHIPS ─────────────────────────────────────── */}
            <Section style={{ padding: '24px 32px', marginBottom: '20px', backgroundColor: bgElevated, borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '8px' }}>
              {[
                'Marketplace Listings',
                'Jobs & Internships',
                'Campus Events',
                'Accommodation',
                'Student Networks',
                'Business Promotions',
              ].map((f, i) => (
                <span key={i} style={{
                  display: 'inline-block',
                  padding: '7px 14px',
                  backgroundColor: 'rgba(74, 222, 128, 0.06)',
                  color: mintLight,
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '500',
                  border: '1px solid rgba(74, 222, 128, 0.12)',
                  marginBottom: '8px',
                  marginRight: '8px',
                }}>
                  {f}
                </span>
              ))}
            </Section>

            {/* ── TIMELINE ──────────────────────────────────────────── */}
            <Section style={{ padding: '32px', marginBottom: '20px', backgroundColor: bgElevated, borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Heading style={{ color: textPrimary, fontSize: '20px', fontWeight: '700', margin: '0 0 28px 0' }}>
                What Happens Next
              </Heading>
              {[
                { num: 1, title: 'You joined the waitlist.', sub: 'Completed', done: true },
                { num: 2, title: 'We share product previews and updates.', sub: 'In Progress', done: false },
                { num: 3, title: 'Beta access granted to top supporters.', sub: 'Invite friends to qualify faster', done: false },
                { num: 4, title: 'Universe launches publicly.', sub: 'Opening to all campuses', done: false },
              ].map((step, i) => (
                <Row key={i} style={{ marginBottom: i < 3 ? '24px' : '0' }}>
                  <Column style={{ width: '44px', verticalAlign: 'top' }}>
                    <div style={{
                      width: '28px', height: '28px',
                      backgroundColor: step.done ? emeraldSoft : 'rgba(255,255,255,0.08)',
                      border: step.done ? 'none' : '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '50%',
                      color: step.done ? bgDark : textSecondary,
                      textAlign: 'center', fontSize: '13px', fontWeight: '800', lineHeight: '28px',
                    }}>
                      {step.done ? '+' : step.num}
                    </div>
                  </Column>
                  <Column>
                    <Text style={{ color: step.done ? textPrimary : textSecondary, margin: '2px 0 3px 0', fontWeight: step.done ? '700' : '500', fontSize: '15px' }}>
                      {step.title}
                    </Text>
                    <Text style={{ color: step.done ? emeraldSoft : '#555', margin: 0, fontSize: '12px', fontWeight: '600', letterSpacing: '0.3px' }}>
                      {step.sub}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            {/* ── WHILE YOU WAIT ────────────────────────────────────── */}
            <Section style={{ padding: '0 24px', marginBottom: '20px' }}>
              <Heading style={{ color: textPrimary, fontSize: '20px', fontWeight: '700', margin: '0 0 20px 0' }}>
                While You Wait
              </Heading>
              <Row style={{ marginBottom: '12px' }}>
                <Column style={{ width: '48%', padding: '20px', backgroundColor: bgElevated, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Text style={{ color: emeraldSoft, fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 10px 0' }}>Updates</Text>
                  <Text style={{ color: textPrimary, fontWeight: '700', margin: '0 0 6px 0', fontSize: '15px' }}>Stay Updated</Text>
                  <Text style={{ color: textSecondary, fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Receive exclusive product announcements and launch news.</Text>
                </Column>
                <Column style={{ width: '4%' }}></Column>
                <Column style={{ width: '48%', padding: '20px', backgroundColor: bgElevated, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Text style={{ color: emeraldSoft, fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 10px 0' }}>Community</Text>
                  <Text style={{ color: textPrimary, fontWeight: '700', margin: '0 0 6px 0', fontSize: '15px' }}>Invite Friends</Text>
                  <Text style={{ color: textSecondary, fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Grow the community and move up the waitlist.</Text>
                </Column>
              </Row>
              <Row>
                <Column style={{ width: '48%', padding: '20px', backgroundColor: bgElevated, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Text style={{ color: emeraldSoft, fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 10px 0' }}>Previews</Text>
                  <Text style={{ color: textPrimary, fontWeight: '700', margin: '0 0 6px 0', fontSize: '15px' }}>Follow Development</Text>
                  <Text style={{ color: textSecondary, fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Get sneak peeks of upcoming features.</Text>
                </Column>
                <Column style={{ width: '4%' }}></Column>
                <Column style={{ width: '48%', padding: '20px', backgroundColor: bgElevated, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Text style={{ color: emeraldSoft, fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '0 0 10px 0' }}>Prepare</Text>
                  <Text style={{ color: textPrimary, fontWeight: '700', margin: '0 0 6px 0', fontSize: '15px' }}>Plan Your Profile</Text>
                  <Text style={{ color: textSecondary, fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Think about what you will buy, sell, or promote at launch.</Text>
                </Column>
              </Row>
            </Section>

            {/* ── FOUNDER MESSAGE ───────────────────────────────────── */}
            <Section style={{ padding: '32px', marginBottom: '20px', backgroundColor: bgElevated, borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ borderLeft: `3px solid ${emeraldDeep}`, paddingLeft: '20px' }}>
                <Text style={{ color: textSecondary, fontSize: '16px', lineHeight: '1.65', margin: '0 0 16px 0', fontStyle: 'italic' }}>
                  "Universe is being built with students at the center. Every signup, every piece of feedback, and every supporter helps shape what we are creating. Thank you for joining us at the very beginning."
                </Text>
                <Text style={{ color: textPrimary, fontSize: '13px', fontWeight: '700', margin: 0, letterSpacing: '0.5px' }}>
                  THE FOUNDERS, UNIVERSE
                </Text>
              </div>
            </Section>

            {/* ── FINAL CTA ─────────────────────────────────────────── */}
            <Section style={{
              padding: '48px 32px',
              marginBottom: '40px',
              background: '#08120D',
              borderRadius: '16px',
              textAlign: 'center',
              border: `1px solid ${emeraldDeep}33`,
            }}>
              <Heading style={{ color: textPrimary, fontSize: '30px', fontWeight: '900', margin: '0 0 12px 0', letterSpacing: '-1px' }}>
                Your Journey Starts Here.
              </Heading>
              <Text style={{ color: textSecondary, fontSize: '15px', lineHeight: '1.65', margin: '0 auto 28px auto', maxWidth: '400px' }}>
                You are <strong style={{ color: emeraldSoft }}>{positionDisplay}</strong> on the list. Invite friends to move up and get beta access before the public launch.
              </Text>
              <Button
                href={referralLink || '#'}
                style={{
                  backgroundColor: emeraldSoft,
                  color: bgDark,
                  fontWeight: '800',
                  fontSize: '15px',
                  padding: '15px 36px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Invite Friends and Move Up
              </Button>
            </Section>

            {/* ── FOOTER ────────────────────────────────────────────── */}
            <Section style={{ padding: '0 24px', textAlign: 'center', paddingBottom: '40px' }}>
              <Hr style={{ borderColor: 'rgba(255,255,255,0.08)', marginBottom: '28px' }} />
              <Text style={{ color: textPrimary, fontSize: '14px', fontWeight: '900', margin: '0 0 4px 0', letterSpacing: '3px' }}>
                UNIVERSE
              </Text>
              <Text style={{ color: textSecondary, fontSize: '12px', margin: '0 0 20px 0' }}>
                Built by students, for students.
              </Text>
              <div style={{ margin: '0 0 20px 0' }}>
                <Link href="#" style={{ color: textSecondary, fontSize: '12px', margin: '0 10px', textDecoration: 'none' }}>Twitter</Link>
                <Link href="#" style={{ color: textSecondary, fontSize: '12px', margin: '0 10px', textDecoration: 'none' }}>Instagram</Link>
                <Link href="mailto:hello@universe.com" style={{ color: textSecondary, fontSize: '12px', margin: '0 10px', textDecoration: 'none' }}>hello@universe.com</Link>
              </div>
              <Text style={{ color: '#444', fontSize: '11px', margin: '0 0 8px 0', lineHeight: '1.6' }}>
                You are receiving this because you signed up for the Universe early access waitlist.
              </Text>
              <Text style={{ color: '#444', fontSize: '11px', margin: 0 }}>
                <Link href={unsubscribeUrl} style={{ color: '#555', textDecoration: 'underline' }}>Manage Preferences</Link>
                {' · '}
                <Link href={unsubscribeUrl} style={{ color: '#555', textDecoration: 'underline' }}>Unsubscribe</Link>
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
