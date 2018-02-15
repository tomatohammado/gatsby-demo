import React from 'react'
// I may or may not actually need to import react-helmet here...
import Helmet from 'react-helmet'

export default function Template ({ data }) {
  const { markdownRemark: post } = data
  return (
    <div>
      <h1>{post.frontmatter.title}</h1>
    </div>
  )
}

export const postQuery = graphql`
  query BlogPostByPath($path: String!) {
     markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        title
      }
     }
  }
`
