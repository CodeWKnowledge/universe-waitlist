import React from 'react';
import { TextInput, TextArea, Section } from './FormHelpers';

export default function WelcomeEditor({ data, onChange }) {
  const handleChange = (field) => (val) => {
    onChange({ ...data, [field]: val });
  };

  return (
    <div>
      <Section title="Welcome Message">
        <TextInput label="Greeting" value={data.greeting} onChange={handleChange('greeting')} placeholder="Welcome to the platform, {name}!" />
        <TextArea label="Intro Text" value={data.introText} onChange={handleChange('introText')} rows={3} />
      </Section>

      <Section title="Step 1">
        <TextInput label="Title" value={data.step1Title} onChange={handleChange('step1Title')} />
        <TextArea label="Description" value={data.step1Desc} onChange={handleChange('step1Desc')} rows={2} />
      </Section>

      <Section title="Step 2">
        <TextInput label="Title" value={data.step2Title} onChange={handleChange('step2Title')} />
        <TextArea label="Description" value={data.step2Desc} onChange={handleChange('step2Desc')} rows={2} />
      </Section>

      <Section title="Step 3">
        <TextInput label="Title" value={data.step3Title} onChange={handleChange('step3Title')} />
        <TextArea label="Description" value={data.step3Desc} onChange={handleChange('step3Desc')} rows={2} />
      </Section>

      <Section title="Call to Action">
        <div className="grid grid-cols-2 gap-4">
          <TextInput label="Button Text" value={data.callToActionText} onChange={handleChange('callToActionText')} />
          <TextInput label="Button URL" value={data.callToActionUrl} onChange={handleChange('callToActionUrl')} />
        </div>
      </Section>
    </div>
  );
}
