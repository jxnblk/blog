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

const getImage = (path = '') => {
  if (path === '/') return '/pages/home.png'
  const name = path
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .replace(/\//, '-')
  return '/pages/' + name + '.png'
}

export default props => {
  const pages = props.data.pages.nodes

  return (
    <div>
      <h1>Sitemap | {pages.length} pages</h1>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          marginLeft: -16,
          marginRight: -16,
        }}>
        {pages.map(page => (
          <div key={page.id}
            style={{
              width: '25%',
              padding: 16,
            }}>
            <img
              src={getImage(page.path)}
              alt={page.path}
              style={{
                display: 'block',
                maxWidth: '100%',
                height: 'auto',
                border: '1px solid lightgray',
              }}
            />
            {false && (
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
              <Link
                to={page.path}
                style={{
                  fontFamily: '"Roboto Mono", Menlo, monospace',
                  fontSize: 12,
                }}>
                {page.path}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
