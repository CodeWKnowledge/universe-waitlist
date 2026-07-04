import React from 'react';
import { TextInput, TextArea, Section } from './FormHelpers';

export default function NewsletterEditor({ data, onChange }) {
  const handleChange = (field) => (val) => {
    onChange({ ...data, [field]: val });
  };

  return (
    <div>
      <Section title="Main Article">
        <TextInput label="Header Image URL" value={data.headerImage} onChange={handleChange('headerImage')} />
        <div className="grid grid-cols-2 gap-4">
          <TextInput label="Issue Number / Tagline" value={data.issueNumber} onChange={handleChange('issueNumber')} placeholder="e.g. Issue #42" />
        </div>
        <TextInput label="Main Title" value={data.mainTitle} onChange={handleChange('mainTitle')} />
        <TextArea label="Article Text" value={data.mainArticle} onChange={handleChange('mainArticle')} rows={6} />
        <div className="grid grid-cols-2 gap-4">
          <TextInput label="Read More Text" value={data.readMoreText} onChange={handleChange('readMoreText')} />
          <TextInput label="Read More URL" value={data.readMoreUrl} onChange={handleChange('readMoreUrl')} />
        </div>
      </Section>

      <Section title="Side Article 1">
        <TextInput label="Image URL" value={data.sideArticle1Image} onChange={handleChange('sideArticle1Image')} />
        <TextInput label="Title" value={data.sideArticle1Title} onChange={handleChange('sideArticle1Title')} />
        <TextArea label="Description" value={data.sideArticle1Desc} onChange={handleChange('sideArticle1Desc')} rows={3} />
      </Section>

      <Section title="Side Article 2">
        <TextInput label="Image URL" value={data.sideArticle2Image} onChange={handleChange('sideArticle2Image')} />
        <TextInput label="Title" value={data.sideArticle2Title} onChange={handleChange('sideArticle2Title')} />
        <TextArea label="Description" value={data.sideArticle2Desc} onChange={handleChange('sideArticle2Desc')} rows={3} />
      </Section>
    </div>
  );
}
