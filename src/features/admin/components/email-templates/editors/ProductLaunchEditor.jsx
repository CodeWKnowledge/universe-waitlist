import React from 'react';
import { TextInput, TextArea, Section } from './FormHelpers';

export default function ProductLaunchEditor({ data, onChange }) {
  const handleChange = (field) => (val) => {
    onChange({ ...data, [field]: val });
  };

  return (
    <div>
      <Section title="Hero Section">
        <TextInput label="Hero Image URL" value={data.heroImage} onChange={handleChange('heroImage')} />
        <TextInput label="Headline" value={data.headline} onChange={handleChange('headline')} />
        <TextArea label="Subheadline" value={data.subheadline} onChange={handleChange('subheadline')} />
        <div className="grid grid-cols-2 gap-4">
          <TextInput label="Button Text" value={data.primaryButtonText} onChange={handleChange('primaryButtonText')} />
          <TextInput label="Button URL" value={data.primaryButtonUrl} onChange={handleChange('primaryButtonUrl')} />
        </div>
      </Section>

      <Section title="Feature 1 (Left)">
        <TextInput label="Title" value={data.feature1Title} onChange={handleChange('feature1Title')} />
        <TextArea label="Description" value={data.feature1Desc} onChange={handleChange('feature1Desc')} rows={3} />
      </Section>

      <Section title="Feature 2 (Right)">
        <TextInput label="Title" value={data.feature2Title} onChange={handleChange('feature2Title')} />
        <TextArea label="Description" value={data.feature2Desc} onChange={handleChange('feature2Desc')} rows={3} />
      </Section>
    </div>
  );
}
