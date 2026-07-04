import React from 'react';
import { Html, Head, Preview, Body, Container, Text, Heading, Tailwind, Hr, Link } from '@react-email/components';

export function OnboardingEmail({ firstName, day, unsubscribeUrl }) {
  const contentMap = {
    3: {
      preview: "Why we built UniVerse",
      title: "The Campus Problem",
      body: `Hey ${firstName}, campus commerce is broken. We built UniVerse to fix the chaos of WhatsApp groups and unverified scammers.`
    },
    7: {
      preview: "Sneak Peek at UniVerse",
      title: "Product Preview",
      body: `We are making incredible progress, ${firstName}. Take a look at these upcoming marketplace features...`
    },
    14: {
      preview: "Development Update",
      title: "Milestones Reached",
      body: `It's been two weeks since you joined the waitlist, ${firstName}. Here is what our team has accomplished so far...`
    },
    21: {
      preview: "Invite Your Friends",
      title: "Grow the Network",
      body: `${firstName}, the marketplace only works if your friends are here. Use your referral link to earn beta points!`
    }
  };

  const content = contentMap[day] || contentMap[3];

  return (
    <Html>
      <Head />
      <Preview>{content.preview}</Preview>
      <Tailwind>
        <Body className="bg-slate-50 my-auto mx-auto font-sans">
          <Container className="border border-solid border-slate-200 rounded my-[40px] mx-auto p-[20px] max-w-[465px] bg-white">
            <Heading className="text-black text-[20px] font-normal text-center my-[20px]">
              {content.title}
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              {content.body}
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
              You are receiving this because you joined the UniVerse waitlist.
            </Text>
            <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
              <Link href={unsubscribeUrl} className="text-[#666666] underline">Unsubscribe</Link>
              {' • '}
              UniVerse HQ, Lagos, Nigeria
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
