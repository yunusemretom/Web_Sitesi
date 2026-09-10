# Personal Portfolio Site

A server-rendered personal portfolio: an Express application using EJS
templates, deployed on Vercel.

![demo](docs/demo.gif)

## Tech stack

![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-Templates-B4CA65)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

## Quick start

```bash
git clone https://github.com/yunusemretom/Web_Sitesi.git
cd Web_Sitesi
npm install
node server.js
```

Serves on `http://localhost:3000`, or on `PORT` if that is set.

## How it works

```
server.js          Express setup, view engine, route mounting, 404 handler
routes/            one module per page: index, about, projects, contact
views/             EJS templates
views/partials/    head, nav, footer shared across pages
public/            static assets
vercel.json        deployment configuration
```

Each route is its own module mounted in `server.js`, and each page passes a
`page` variable into the template so the navigation partial can mark the current
item active. That is the reason this is server-rendered rather than static: the
shared head, nav and footer live in one place each, and adding a page means
adding a route and a template instead of copying a navigation block into another
HTML file and eventually forgetting to update one of them.

The 404 handler is registered last, after all routes, because Express matches
middleware in registration order. Put it earlier and it swallows every request.

## Known limitations

- Content is hardcoded in the templates. There is no CMS and no data file, so
  adding a project means editing EJS.
- No tests and no linting.
- Turkish content only.
- Not responsive-tested beyond common desktop widths.
- The earlier version of this README described the site as static, which was
  wrong. It has been server-rendered since the Express rewrite.

## Roadmap

- Move project and page content into a JSON or Markdown data file.
- Responsive pass across mobile widths.
- English locale.

## License

MIT. See [LICENSE](LICENSE).
