/** @jsx jsx */
import { jsx, Styled } from 'theme-ui'
import { graphql, Link } from 'gatsby'

export const query = graphql`
  query BlogPages {
    pages: allSitePage(
      sort: {
        fields: context___frontmatter___date,
        order: DESC
      },
      filter: {
        path: {
          glob: "/blog/*"
        },
        context: {
          frontmatter: {
            draft: {
              ne: true
            }
          }
        }
      }
    ) {
      nodes {
        id
        path
        context {
          frontmatter {
            title
            date
            draft
          }
        }
      }
    }
  }
`

export default props => {
  const posts = props.data.pages.nodes
  // console.log(posts)

  return (
    <ul
      sx={{
        maxWidth: 'container',
        listStyle: 'none',
        padding: 0,
        margin: 0,
      }}>
      {posts.map(post => (
        <li key={post.id}>
          <Styled.h1 as='h2'>
            <Link
              to={post.path}
              sx={{
                variant: 'styles.navlink',
              }}>
              {post.context.frontmatter.title}
            </Link>
          </Styled.h1>
          <div sx={{ variant: 'type.small' }}>
            {new Date(post.context.frontmatter.date).toLocaleDateString()}
          </div>
        </li>
      ))}
    </ul>
  )
}
