import React from 'react'
import { Helmet } from 'react-helmet-async';

function ReactHelmet({ title, content }) {
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={content || "PerObe AI - your personal wardrobe AI."} />
      </Helmet>
    </div>
  )
}

export default ReactHelmet;