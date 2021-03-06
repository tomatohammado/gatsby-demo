# WDI Teach Yo Self: Gatsby Intro and Demo

## Motivation

I am interested in implementing a static site generator for my personal site, because I like the idea of using a JAM stack (JavaScript, Angular, Markdown) to easily add content (ie _blog posts_ and _portfolio projects_) with markdown.

There are many options, and the three that I am most interested in are [Gatsby](https://www.gatsbyjs.org/), [Hugo](https://gohugo.io/), and [Hexo](https://hexo.io/).

I chose to dive into Gatsby first because it implements React (which I think makes it more of an (unfortunatly named) JRM stack) and it appears I will be able to make templates for both Blog Posts and Portfolio Projects, whereas with something like Hugo I was a little less sure how much customization I have outside of a conventional blog-like site. If I only had time to try out one, it looks like I'll get the most mileage out of Gatsby.

I also intend on adding certain animations, and I felt that by virtue of using React I might be in a better position to implement the particular animations I have in mind.

In researching Gatsby, I relied heavily on the [official documentation](https://www.gatsbyjs.org/docs/), as well as a tutorial from [LevelUpTuts](https://www.leveluptutorials.com/). However, the LevelUpTuts videos reference an older version of Gatsby, so there are some minor adjustments that we have to figure out ourself and apply. Nothing crazy, but you do have to think about it.

---

## Initializing a Project

The first thing we need to do is install the gatsby-cli node package

```bash
npm install --global gatsby-cli
```

With that installed, we can initialize a project with `gatsby new <project-name>`, similar to how we start a rails or react project.

In my case, I ran `gatsby new gatsby-demo` for this project.

## Starting a Server

After using `cd` to navigate to the newly created directory, we can start a server using `gatsby develop`. The default port is 8000, as we can see in the terminal output.

```bash
$ gatsby develop
success delete html files from previous builds — 0.021 s
success open and validate gatsby-config.js — 0.014 s
success copy gatsby files — 0.036 s
success onPreBootstrap — 0.011 s
success source and transform nodes — 0.052 s
success building schema — 0.258 s
success createLayouts — 0.095 s
success createPages — 0.001 s
success createPagesStatefully — 0.040 s
success onPreExtractQueries — 0.001 s
success update schema — 0.107 s
success extract queries from components — 0.144 s
success run graphql queries — 0.057 s
success write out page data — 0.006 s
success write out redirect data — 0.001 s
success onPostBootstrap — 0.001 s

info bootstrap finished - 14.623 s

 DONE  Compiled successfully in 8602ms                                                    1:52:50 PM


You can now view gatsby-starter-default in the browser.

  http://localhost:8000/

View GraphiQL, an in-browser IDE, to explore your site's data and schema

  http://localhost:8000/___graphql

Note that the development build is not optimized.
To create a production build, use gatsby build
```

I will only briefly talk about graphql in this demo, but the link `http://localhost:8000/___graphql` is very useful for testing out queries we might need to use in parts of our application.

## File Structure

The `./src` directory is where we will put the content of our site. There are a number of `./gatsby-<something>.js` configuration files, which we will also modify in the process of building this application.

The `./src/layouts/` directory contains the particular `index.js` file that is rendered on all of the pages (there might be a way to use other layouts but I did not research that. Yet.)

This is not to be confused by the `index.js` in the `./src/pages/` directory, which corresponds to the index.js _page_ and not the layout.

## Impelmenting Markdown Support

Gatsby uses plugins to add additional features. In order to use markdown files for specific content types and render them based on a template, we will need to add a few plugins.

We will need:

- **gatsby-source-filesystem package**: to use files on our file system and not some external source
- **gatsby-transformer-remark**: so we can work with markdown files

```bash
npm install gatsby-source-filesystem gatsby-transformer-remark
```

Next, we need to include these plugins in `./gatsby-config.js`

```diff js
module.exports = {
  siteMetadata: {
    title: 'Gatsby Default Starter'
  },
-  plugins: ['gatsby-plugin-react-helmet']
+ plugins: [
+    'gatsby-plugin-react-helmet',
+    {
+      resolve: 'gatsby-source-filesystem',
+      options: {
+        path: `${__dirname}/src/pages`,
+        name: 'pages'
+      }
+    },
+    'gatsby-transformer-remark'
+  ]
}

```

After installing these plugins, it is important to stop the development server with `^C` and restart it with `gatsby develop`.

## Creating the First Blog Post

Since we have configured our plugins to look in the `./src/pages` directory for our files, we can create a directory named `./src/pages/15-Feb-2018-first-post` and add an `index.md` file in it to test to see if our site is working correctly.

In the `index.md`, we write some frontmatter at the top of the file. Frontmatter is a convention from the Jekyll static site generator, and it contains properties we want to reference later.

We can then write normal markdown for the body of the content, in this case a blog post.

```md
---
path: '/first-post'
title: 'First Totally Rad Blog Post'
---
# This is a blog post
```

## Creating the Post Template

Now, we need to make a `./src/templates` file and create a `post.js` template file for this content type.

```js
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
```

The query is graphql, which to be honest I am not familiar with and do not know what's going on with the syntax (backticks? no commas in an object-literal-looking-thing?!).

But from what I can tell, it looks like this query is finding the markdown file that matches the path, and returning its html and frontmatter properties.

## Applying the Template to Posts

The last step is to modify the `./gatsby-node.js` file to use our template to create the blog post pages.

```js
const path = require('path')

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators

  const postTemplate = path.resolve('src/templates/post.js')

  return graphql(`{
    allMarkdownRemark {
      edges {
        node {
          html
          id
          frontmatter {
            path
            title
          }
        }
      }
    }
  }`)
  .then(res => {
    if (res.errors) {
      return Promise.reject(res.errors)
    }

    res.data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        path: node.frontmatter.path,
        component: postTemplate
      })
    })
  })
}
```

It might be helpful to restart the `gatsby develop` server to check to see if there are any errors.

If not, you should get something like this

![rendered blog post](./screenshots/Screen-Shot-2018-02-15-at-3.27.05-PM.png)

Great job!!!

I encourage you to now try to make a new blog post that uses the same template.

---

## Future Goals

- [ ] [Styled Components](https://github.com/styled-components/styled-components)
- [ ] Adding support for Sass via [the plugin](https://www.gatsbyjs.org/packages/gatsby-plugin-sass/)
- [ ] Deploy to Netlify (see link at bottom)
- [ ] Infinite Scrolling for Blog Posts ([see here](https://github.com/metafizzy/infinite-scroll))
- [ ] Less important for this demo, but update site info in `gatsby-config.js` and `package.json`
- [ ] determing what to call the properties of frontmatter

## Resources

- [Terminal output from demo](https://gist.github.com/tomatohammado/dea0ce2425a939c8483b7af4b798b155)

## Deploy

Note: _This section was automatically generated by gatsby-cli when I initialized the project_

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/gatsbyjs/gatsby-starter-default)
