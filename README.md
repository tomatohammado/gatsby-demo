# WDI Teach Yo Self: Gatsby Intro and Demo

## Motivation

I like the idea of using a static site generator for my personal site, because I like the idea of using a JAM stack (JavaScript, Angular, Markdown) to easily add content (ie **_blog posts_** and **_portfolio projects_**) with markdown.

There are many options, and the three that I am most interested in are [Gatsby](https://www.gatsbyjs.org/), [Hugo](https://gohugo.io/), and [Hexo](https://hexo.io/).

I chose to dive into Gatsby first because it implements React (which I think makes it more of an (unfortunatly named) JRM stack) and it appears I will be able to make templates for both Blog Posts and Portfolio Projects, whereas with something like Hugo I was a little less sure how much customization I have outside of a conventional blog-like site.

I also intend on implementing animations, and I felt that by virtue of using React I might be in a better position to implement the particular animations I have in mind.

In researching Gatsby, I relied heavily on the [official documentation](https://www.gatsbyjs.org/docs/), as well as a tutorial from [LevelUpTuts](https://www.leveluptutorials.com/).

This repo is the result of my creating a Gatsby site from scratch.

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

The `./src/layouts/` directory contains the particular `index.js` file that is rendered on all of the pages (by default, there might be a way to use other layouts but I did). This is not to be confused by the `index.js` in the `./src/pages/` directory, which corresponds to the index.js _page_ and not the layout.

_PLACEHOLDER_ more about `/pages/` and the content-types

## Impelmenting Markdown Support

Gatsby uses plugins to add additional features. In order to use markdown files for specific content types and render them based on a template, we will need to add a few plugins.

We will need:

- _gatsby-source-filesystem package_: to use files on our file system and not some external source
- _gatsby-transformer-remark_: so we can work with markdown files

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

After installing these plugins, it is important to stop the development server with `^C` and start it again with `gatsby develop`.

## Creating the First Blog Post

Since we have configured our plugins to look in the `./src/pages` directory for our files, we can create a directory named `./src/pages/15-Feb-2018-first-post` and add an `index.md` file in it to test to see if our site is working correctly.

in the `index.md`, we write some frontmatter at the top of the file with properties we want to reference later, and then the body of the markdown file.

```
---
path: '/first-post'
title: 'First Totally Rad Blog Post'
---
# This is a blog post
```
Now, we need to make a `./src/templates` file and create a `post.js` template file for this content type.

```js
import React from 'react'
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

The query is graphql, which to be honest I don't understand fully. But this query is finding the markdown file that matches the path, and returning html and frontmatter properties.

---

## Future Goals

- [ ] Styled Components
- [ ] Adding support for Sass via the plugin
- [ ] Deploy to Netlify
- [ ] Infinite Scrolling for Blog Posts
- [ ] Less important for this demo, but update site info in `gatsby-config.js` and `package.json`
- [ ] determing what to call the properties of frontmatter

## Deploy

Note: _This section was automatically generated by gatsby-cli when I initialized the project_

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/gatsbyjs/gatsby-starter-default)
