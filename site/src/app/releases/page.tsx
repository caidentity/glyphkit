'use client';

import React from 'react';
import './releases.scss';
import Footer from '@/components/Footer/Footer';
import '@/styles/pages/infopages.scss';
import FloatingTOC from '@/components/FloatingTOC/FloatingTOC';
import CodeBlock from '@/components/CodeBlock/CodeBlock';

// Define the type for a release entry
type ChangeItem = {
  description: string;
  list?: string[];  // Add support for bullet points
};

type ReleaseContent = {
  new?: ChangeItem[];
  fixes?: ChangeItem[];
  removed?: ChangeItem[];
  changes?: ChangeItem[];
};

type Release = {
  version: string;
  date: string;
  title?: string;
  content: ReleaseContent;
};

// Example releases data (you might want to move this to a separate file later)
const releases: Release[] = [
  {
    version: '1.0.0',
    date: '2025-01-08',
    title: 'Introducing GlyphKit',
    content: {
      new: [
        {
          description: 'Added support for custom icon directories',
          list: [
            'Support for multiple icon directories',
            'Automatic path resolution',
            'Custom prefix support'
          ]
        }
      ],
      fixes: [
        {
          description: 'Fixed caching issues',
          list: [
            'Resolved memory leak in icon cache',
            'Improved cache invalidation'
          ]
        }
      ],
      changes: [
        {
          description: 'Updated error handling',
          list: [
            'Better error messages',
            'Improved error recovery'
          ]
        }
      ]
    }
  },
  // Add more releases here
];

const tocItems = [
  { href: '#latest-release', text: 'Latest Release' },
  { href: '#previous-releases', text: 'Previous Releases' }
];

export default function ReleasesPage() {
  return (
    <main className="docs-page">
      <div className="page-masthead">
        <h1>Release Notes</h1>
      </div>

      <div className="info-page-wrapper">
        <div className="content-container">
          {releases.map((release, index) => (
            <section 
              key={release.version} 
              id={index === 0 ? 'latest-release' : `release-${release.version}`}
              className="release-section"
            >
              <h2>
                Version {release.version}
                <span className="release-date">{release.date}</span>
              </h2>
              
              {release.title && <h3 className="release-title">{release.title}</h3>}
              
              <div className="changes-list">
                {release.content.new && release.content.new.length > 0 && (
                  <div className="change-category">
                    <h3>New Features</h3>
                    {release.content.new.map((item, i) => (
                      <div key={i} className="change-item new">
                        <p className="description">{item.description}</p>
                        {item.list && item.list.length > 0 && (
                          <ul>
                            {item.list.map((bullet, j) => (
                              <li key={j}>{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {release.content.changes && release.content.changes.length > 0 && (
                  <div className="change-category">
                    <h3>Changes</h3>
                    {release.content.changes.map((item, i) => (
                      <div key={i} className="change-item changed">
                        <p className="description">{item.description}</p>
                        {item.list && item.list.length > 0 && (
                          <ul>
                            {item.list.map((bullet, j) => (
                              <li key={j}>{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {release.content.fixes && release.content.fixes.length > 0 && (
                  <div className="change-category">
                    <h3>Bug Fixes</h3>
                    {release.content.fixes.map((item, i) => (
                      <div key={i} className="change-item fixed">
                        <p className="description">{item.description}</p>
                        {item.list && item.list.length > 0 && (
                          <ul>
                            {item.list.map((bullet, j) => (
                              <li key={j}>{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {release.content.removed && release.content.removed.length > 0 && (
                  <div className="change-category">
                    <h3>Removed</h3>
                    {release.content.removed.map((item, i) => (
                      <div key={i} className="change-item removed">
                        <p className="description">{item.description}</p>
                        {item.list && item.list.length > 0 && (
                          <ul>
                            {item.list.map((bullet, j) => (
                              <li key={j}>{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
        
        <FloatingTOC items={tocItems} />
      </div>

      <Footer />
    </main>
  );
} 