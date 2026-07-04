import React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Heading, Tailwind } from '@react-email/components';

export function TransactionalEmail({ type, title, message }) {
  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Tailwind>
        <Body className="bg-slate-50 my-auto mx-auto font-sans">
          <Container className="border border-solid border-slate-200 rounded my-[40px] mx-auto p-[20px] max-w-[465px] bg-white">
            <Heading className="text-black text-[20px] font-normal text-center my-[20px]">
              {title}
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              {message}
            </Text>
            <Section className="text-center mt-[32px] mb-[32px] border-t border-slate-100 pt-8 text-xs text-slate-400">
              This is a transactional email from UniVerse regarding your account.
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
