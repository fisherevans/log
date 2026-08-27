---
id: NLDnNWX5dq
title: Listr
date: 2014-04-09
description: A collaborative list app, and my first crack at a JavaScript front end talking to a REST API.
tags:
  - tools
draft: false
---
Listr was a simple app for keeping itemized lists and sharing them with other people.

The idea came from a mundane problem: Lisa and I wanted one grocery list that both of our phones could edit. Everything we tried was either too heavy or too fiddly for something that should just be a list. So I built my own. (We eventually gave up and moved to WunderList, which we loved - but by then I had already learned the thing I actually wanted to learn.)

You could register, spin up a list, and start adding items right away: check them off, archive the ones you didn't want cluttering the view, or delete them outright. It auto-completed new items from what you'd added before, which made repeat grocery runs quick. You could add friends and share a list with them to edit together.

The reason Listr mattered to me wasn't the feature set - it was the architecture. It was my first real attempt at a JavaScript front-end application talking to a web-service API rather than a page rendered whole by the server. The backend was a RESTful API in PHP over MySQL; the front end was served as a shell by PHP and then ran on jQuery in the browser, calling the API for everything. That split - a dumb server handing data to a smart client - is the shape of basically everything I've built since.

[Source on GitHub](https://github.com/fisherevans/Listr)
