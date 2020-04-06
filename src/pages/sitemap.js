import React from 'react'
import { graphql, Link } from 'gatsby'

export const query = graphql`
query {
  pages: allSitePage(filter: {
    path: {
      nin: ["/sitemap/","/dev-404-page/"]
    }
  }) {
    nodes {
      id
      path
    }
  }
}
`

export default props => {
  const pages = props.data.pages.nodes

  return (
    <div>
      <pre>sitemap | {pages.length} pages</pre>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}>
        {pages.map(page => (
          <div key={page.id}
            style={{
              padding: 32,
            }}>
            {true && (
            <iframe
              src={page.path}
              loading='lazy'
              sandbox=''
              title={page.path}
              width={256}
              height={320}
              style={{
                border: '1px solid lightgray',
                zoom: 1/2,
              }}
            />
            )}
            <div>
              <Link to={page.path}>
                {page.path}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
